import {observable, action, flow} from "mobx";
import {HTTPCnst} from "../../service/httpCnst.js"
import appStore from "../../sys/AppStore"
import {getQueryString} from '../../utils/getToken';

var _ = require('lodash');
export default class CommentStore {
  constructor(appStore) {
    this.praisedata = [];
    this.discussdata = [];
    this.discussId = '';
    this.replyId = '';
    this.replyuserId = '';
    this.pageSize = 10;
    this.nowPage = 1;
    this.commentNum = 0;
    this.submitFlag = true;
    this.fetchMoreLoading = false;
    appStore.isShowNameToArticle = sessionStorage.getItem('isShowName') ? JSON.parse(sessionStorage.getItem('isShowName')).dataObject.isShowNameToArticle : '0';
  }

  @observable commentText = '';
  @observable praiseState = '';
  @observable open = false;
  @observable msg = '';
  @observable iframeHeight = '';
  @observable data = {};
  @observable praisedata = [];
  @observable discussdata = [];
  @observable discussId = '';
  @observable replyId = '';
  @observable replyuserId = '';
  @observable pageSize = 10;
  @observable nowPage = 1;
  @observable commentNum = 0;
  @observable submitFlag = true;
  @observable fetchMoreLoading = false;
  @observable static isLoading = false;
  @observable static err = undefined;
  @observable static lastReqTime = 0 //@fixme
  // 评论详情
  @action initData = flow(function* (discussId) {
    this.data = {};
    CommentStore.isLoading = true;
    this.open = true;
    try {
      let accessToken = getQueryString("accessToken")
      let articleUrl = `${HTTPCnst.H5_url}cms/discuss/info?discussTargetId=${discussId}&discussType=articleComment&accessToken=${accessToken}`;
      let articleresult = yield fetch(articleUrl);
      const article = yield articleresult.json()
      if (article && article[0]) {
        //应该复制数据到store中定义的详细字段
        let userUrl = `${HTTPCnst.H5_url}user?userIds=${article[0].createUser}&accessToken=${accessToken}`;
        let userresult = yield fetch(userUrl);
        const users = yield userresult.json();
        article[0].headPic = users[0] ? users[0].headPic : '';
        article[0].name = users[0] ? users[0].name : '';
        article[0].nickName = users[0] ? users[0].nickName : '';
        article[0].isShowNameToArticle = appStore.isShowNameToArticle;
        this.data = article[0];
      } else {
        appStore.Snackbar.handleClick('获取评论详情失败');
      }
      CommentStore.lastReqTime = Date.now()
    } catch (err) {
      CommentStore.err = err;
      appStore.Snackbar.handleClick(err);
    }
    CommentStore.isLoading = false;
    this.open = false;
  })
  // 评论点赞列表
  @action initPraiseData = flow(function* (discussId) {
    try {
      let accessToken = getQueryString("accessToken")
      let praiseUrl = `${HTTPCnst.H5_url}cms/praise?praiseType=articleComment&praiseTargetId=${discussId}&pageSize=10&nowPage=1&accessToken=${accessToken}`;
      let praiseresult = yield fetch(praiseUrl);
      const praises = yield praiseresult.json();
      if (praises.list) {
        let praiseuserIds = [];
        praises.list.forEach((praiseitem, idx) => {
          praiseuserIds.push(praiseitem.createUser);
        });
        // 根据点赞人id拿到点赞者信息
        let userUrl = `${HTTPCnst.H5_url}user?userIds=${praiseuserIds.join(',')}&accessToken=${accessToken}`;
        let praresult = yield fetch(userUrl);
        const praiseusers = yield praresult.json();
        praises.list.forEach((praiseitem, index) => {
          praiseusers.forEach((user) => {
            if (praiseitem.createUser === user.sysUserId) {
              praiseitem.headPic = user.headPic;
              praiseitem.name = user.name;
              praiseitem.nickName = user.nickName;
              praiseitem.isShowNameToArticle = appStore.isShowNameToArticle;
            }
          })
        });
        this.praisedata = praises;
      } else {
        this.praisedata.clear()
      }
    } catch (err) {
      appStore.Snackbar.handleClick(err);
    }
  })
  // 评论回复列表
  @action initCommentData = flow(function* (discussId) {
    try {
      // 获取帖子评论列表
      this.fetchMoreLoading = true;
      let accessToken = getQueryString("accessToken")
      let commentUrl = `${HTTPCnst.H5_url}cms/discuss?discussType=articleReply&discussTargetId=${discussId}&pageSize=${this.pageSize}&nowPage=${this.nowPage}&accessToken=${accessToken}`;
      let commentresult = yield fetch(commentUrl);
      const comments = yield commentresult.json();
      if (comments.list && comments.list.length > 0) {
        let commentuserIds = [];
        // let commentIds = [];
        _.map(comments.list, (item) => {
          commentuserIds.push(item.createUser);
          if (item.parentReplyUserId && item.parentReplyUserId !== 0) {
            commentuserIds.push(item.parentReplyUserId);
          }
        });
        let commentFilteruserId = new Set(commentuserIds);
        // 根据评论人id拿到评论者信息
        let comUrl = `${HTTPCnst.H5_url}user?userIds=${[...commentFilteruserId].join(',')}&accessToken=${accessToken}`;
        let comresult = yield fetch(comUrl);
        const commentusers = yield comresult.json();
        comments.list.forEach((commentitem, index) => {
          commentusers.forEach((user) => {
            if (commentitem.createUser === user.sysUserId) {
              commentitem.headPic = user.headPic;
              commentitem.name = user.name;
              commentitem.nickName = user.nickName;
              commentitem.isShowNameToArticle = appStore.isShowNameToArticle;
            }
            if (commentitem.parentReplyUserId === user.sysUserId) {
              commentitem.parentReplyUserName = user.name;
            }
          })
        });
        if (this.nowPage === 1) {
          this.discussdata = comments.list;
        } else {
          this.discussdata = this.discussdata.slice().concat(comments.list);
        }
        this.commentNum = comments.totalCount;
      }
      this.fetchMoreLoading = false;
      this.open = false;
    } catch (err) {
      this.open = false;
      this.fetchMoreLoading = false;
      appStore.Snackbar.handleClick(err);
    }
  })

  //下拉默认请求第一页数据  (应该是取store数据）
  @action _onPullRefresh = flow(function* (store) {
    store.nowPage = 1;
    yield this.initCommentData(store.discussId);
  })

  //上滑加载更多  concat  page+1数据
  @action _onEndReached = flow(function* (store) {
    store.nowPage++;
    yield this.initCommentData(store.discussId);
  })
  // 提交点赞文章
  postPraise = flow(function* (store) {
    let praise = 'praise'
    if (store.data.favourStatus) {
      praise = 'praise/del'
    }
    try {
      let accessToken = getQueryString("accessToken")
      let praiseUrl = `${HTTPCnst.H5_url}cms/${praise}?praiseType=articleComment&praiseTargetId=${store.discussId}&superId=${store.data.articleId}&accessToken=${accessToken}`;
      let praiseresult = yield fetch(praiseUrl, {method: "POST"});
      const praises = yield praiseresult.json();
      if (praises) {
        store.initPraiseData(store.discussId)
        store.data.favourStatus = !store.data.favourStatus;
      } else {
        store.data.favourStatus = !store.data.favourStatus;
        store.initPraiseData(store.discussId)
      }
    } catch (err) {
      store.data.favourStatus = false;
      appStore.Snackbar.handleClick(err);
    }
  })
  // 提交点赞活动评论
  // postSecondPraise =flow(function * (store,targetId) {
  //     try {
  //         let praiseUrl = `${HTTPCnst.H5_url}cms/praise?praiseType=articleComment&praiseTargetId=${targetId}&superId=${store.discussId}`;
  //         let praiseresult = yield fetch(praiseUrl,{method:"POST"});
  //         const praises = yield praiseresult.json();
  //         if(praises){
  //             console.log('点赞成功')
  //         }else{
  //             store.initCommentData(store.discussId)
  //         }
  //      } catch (err) {
  //         // this.err = err;
  //         store.initCommentData(store.discussId)
  //         store.snackbar.handleClick(err);
  //     }
  // })
  // 提交评论回复
  postComment = flow(function* (store, content) {
    if (!content || (content.length > 0 && content.trim().length === 0)) {
      appStore.Snackbar.handleClick('评论内容不能为空');
      return
    }
    store.submitFlag = true;
    let formData = {
      'content': content,
      'discussTargetId': store.data.articleId,
      'parentId': store.discussId,
      'parentReplyId': store.replyId,
      'parentReplyUserId': store.replyuserId
    };
    try {
      let accessToken = getQueryString("accessToken")
      let commentUrl = `${HTTPCnst.H5_url}cms/discuss?discussType=articleReply&accessToken=${accessToken}`;
      let commentresult = yield fetch(commentUrl, {
        method: "POST",
        dataType: 'json',
        body: JSON.stringify(formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      let json = yield commentresult.json();
      if (json) {
        // 清空评论输入框
        store.commentText = '';
        // 刷新评论信息
        store.nowPage = 1;
        store.initCommentData(store.discussId);
      } else {
        appStore.Snackbar.handleClick("点赞失败");
      }

      appStore.Mask.hidden()
    } catch (err) {

      appStore.Mask.hidden()
      appStore.Snackbar.handleClick(err);
    }
    ;
  });

  //判断是否显示发送按钮
  switchover(store, n) {
    if (n === 1) {
      store.submitFlag = false;
      appStore.Mask.show()
    }
    if (n === 2 && !store.commentText) {
      setTimeout(function () {
        store.submitFlag = true;
        appStore.Mask.hidden()
      }, 300)
    }
  }

  getText = (event) => {
    this.commentText = event.target.value;
  };

}
