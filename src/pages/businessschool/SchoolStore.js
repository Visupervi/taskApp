import {observable, flow} from "mobx"
import appStore from "../../sys/AppStore"
import Common from '../common_method/GeneralMethod'
import {Shopguidehttp} from './Shopguidehttp'
import {HTTPCnst} from "../../service/httpCnst.js"
import {getExamListByTaskId} from "../../apis/Api";
// import { getCourseCommentNumsScorenNums, getFindBrowsRecordAndSave, getFavourList, getCommentLIst } from '../../apis/Api'
import {getQueryString} from '../../utils/getToken'

const common = new Common();
const Http = new Shopguidehttp();
const shopguidehttp = new Shopguidehttp();
//判断是Iphone还是Android
let browser = {
	versions: function () {
		let u = navigator.userAgent,
			app = navigator.appVersion;
		return {
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
			iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		}
	}(),
	language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
export default class SchoolStore {
  constructor() {
    this.cache = SchoolStore.chooseCache;
    this.switchValue = this.cache.get('switchValue') === 0 ? 0 : (this.cache.get('courseId') && 1)
    if (this.switchValue === undefined) {
      this.switchValue = 0
    }
    this.common = new Common();
    if (this.cache.get('clear') === 'clear') {  //设置缓存清除
      this.cache.set('courseId', null);
      this.cache.set('clear', null)
    }
  }

  // 页面计时
  @observable stayTime = 0;
  @observable videoPlayObj = {videoPalyTime: 0, duration: 0, currentTime: 0};
  //
  @observable nowPage = 1; //当前页
  @observable favourList = []; //点赞列表
  @observable bookList = []; //书本列表
  @observable isLoading = false; //任务详情
  @observable static chooseCache = new Map();
  @observable static err = undefined;
  @observable static lastReqTime = 0;//@fixme
  /*目录页*/
  @observable getText = '';  //
  @observable switchValue = 0;
  @observable data = null;
  @observable courseId = 0;
  @observable isPlay = false;
  @observable coverImg = '';
  @observable choosedData = null;
  @observable commentText = '';
  @observable newsData = {};  /*提示信息*/
  @observable pageComment = {maxPage: 1, nowPage: 1, pageSize: 5, totalCount: 0};  //初始化页数
  @observable scroll = true;
  @observable showEmpty = false;

  switch(n) {
    this.cache.set('switchValue', n);
    this.switchValue = n
  }

  getBookList = flow(function* (id, n) { //请求列表
    if (this.lastReqTime && Date.now() - this.lastReqTime < 1000 * 3) {
      return
    }
    appStore.Loading.show()
    let result = yield shopguidehttp.GET('emba/getBookList', {'moduleId': id})
    this.bookList.clear();
    this.bookList.push(...result.dataObject);
    if (result.dataObject && result.dataObject.length < 1) {
      this.showEmpty = true
    }
    appStore.Loading.hidden()
    this.lastReqTime = Date.now();
  })
  goBook = (item, self) => { //去课本
    if (item.status === 4) {
      appStore.Snackbar.handleClick('已上锁!');
      return false
    }
    this.cache.set('clear', 'clear');//设置清除选中的信息
    this.cache.set('switchValue', 0); //返回目录页
    this.switchValue = 0
    sessionStorage.removeItem('courseId')/*删除sessionStorage*/
    // this.choosedData=[];
    let img = item.img ? item.img.split('/') : ['http://supershoper.xxynet.com/vsvz1573296912872']
    self.props.history.push("/courseDetails/" + encodeURIComponent(`${item.book_id}&&${JSON.stringify(img)}`));
  }

  async getFavourListAll(type, n) {
    let favourType = 1
    let favourRelId = this.cache.get('courseId');
    if (type === '4') {
      favourType = 4
      favourRelId = this.cache.get('commentId')
    }
    if (n === 1) {
      this.nowPage++;
    } else {
      this.nowPage = 1
      this.favourList.clear()
    }
    let result = await shopguidehttp.GET('bbs/getFavourList', {
      'accessToken': getQueryString("accessToken"),
      'favourRelId': favourRelId,
      'type': 4,  //1：论坛，2：活动，3：文章，4：课程
      'favourType': favourType,
      'page': this.nowPage,
      'rows': 20
    })
    let data = result.dataObject
    data.forEach((vi) => {
      vi.createTime = this.common.dateFormat(vi.createTime, 'MM-dd hh:mm', "show")
    });
    this.favourList.push(...data)
  }

  // updateCourseLearningStatus=()=>{
  //     let lesonId=sessionStorage.lessonId
  //     if(!lesonId)return
  //     let obj={
  //         cost_time:((new Date()).getTime()-(sessionStorage.timeLearning)),
  //         lesson_id:lesonId,
  //         interface_type:3
  //     }
  //     // shopguidehttp.GET('emba/updateCourseLearningStatus',obj).then((json)=>{
  //     //     if(json.dataObject.value==='成功'){
  //     //         appStore.Snackbar.handleClick("状态更新成功");
  //     //     }
  //     // }).catch((error)=>{
  //     //     console.warn(error)
  //     // });
  // }
  async collect() {
    let courseId = this.courseId || this.cache.get('courseId')
    let favoriteUrl = `${HTTPCnst.shopguide_url}game/addFavorite?accessToken=${getQueryString("accessToken")}&favoritePic=${this.choosedData.courseImg}&favoriteTitle=${this.choosedData.courseName}&targetType=1&targetId=${courseId}&targetIntro=${this.choosedData.courseIntro}`;
    let favoriteresult = await fetch(favoriteUrl);
    const favorites = await favoriteresult.json();
    if (favorites.dataObject.value === '成功' || favorites.dataObject.value === '数据已收藏') {
      this.choosedData.isFavouroite = '1'
    } else {
      this.choosedData.isFavouroite = '0'
      appStore.Snackbar.handleClick("操作失败");
    }
  }

  async delFavouroite() {
    let favoriteUrl = `${HTTPCnst.shopguide_url}game/delFavoriteById?accessToken=${getQueryString("accessToken")}&targetType=1&targetId=${this.cache.get('courseId')}`;
    let favoriteresult = await fetch(favoriteUrl);
    const favorites = await favoriteresult.json();
    if (favorites.dataObject === 'success') {
      this.choosedData.isFavouroite = '0'
    } else {
      this.choosedData.isFavouroite = '1'
      appStore.Snackbar.handleClick("操作失败");
    }
  }

  async toTest(id) {
    // debugger
    if (!this.store.cache.get('isPlay')) {
      appStore.Snackbar.handleClick('请先阅读文章!');
      return
    }
    console.log(this.store.choosedData);
    let task = await getExamListByTaskId({
      newTaskId:this.store.cache.get('taskId'),
      accessToken:getQueryString("accessToken"),
      version:"1.0"
    });
    // console.log(task.dataObject);
    // this.props.history.push({pathname: `/examList/${id}&&course=${""}?accessToken=${getQueryString("accessToken")}`});
    this.props.history.push({pathname: "/examList/"+id+"&&course=null?accessToken="+getQueryString("accessToken")});
    // if(task.dataObject.value==="没有考试数据"){
    //   appStore.Snackbar.handleClick(task.dataObject.value);
    // }else{
    //   this.props.history.push('/examexplain/' + encodeURI(encodeURIComponent(JSON.stringify(task.dataObject)))+'?accessToken='+getQueryString("accessToken")+'&examId='+id);
    // }
  }

  getBookDir(id) {
    if (id === `__SELF__?accessToken=${getQueryString("accessToken")}`) {
      return
    }
    Http.GET('emba/getBookDir', {'book_id': id}).then((json) => {
      this.temp = json.dataObject;
      this.addnum = 0;
      this.countnum = 0;
      if (json.dataObject) {
        json.dataObject && json.dataObject.forEach((item, index) => {
          item.chapter_list && item.chapter_list.forEach((chapter) => {
            this.addnum += 1;
            this.getCourseList(chapter);
          })
        })
      } else {
        appStore.Snackbar.handleClick("无内容");
      }
    }).catch((error) => {
      console.warn(error);
    });
  }

  getCourseList(chapter) {
    appStore.Loading.show()
    Http.GET('emba/getCourseList', {
      'object_id': chapter.id,
      'interface_type': 3   /*1 复习，2 精品推荐，3 章节的课程列表，4单元的课程列表*/
    }).then((json) => {
      if (json.dataObject) {
        this.countnum += 1;
        chapter.courseList = json.dataObject;
        if (this.countnum === this.addnum) {
          this.data = this.temp;
        }
        appStore.Loading.hidden()
      } else {
        appStore.Snackbar.handleClick("获取课程列表失败");
        appStore.Loading.hidden()
      }
    }).catch((error) => {
      appStore.Loading.hidden()
      console.warn(error)
    });
  }

  playPause() { //开始播放
    /*this.store.isPlay=true;*/
    this.store.cache.set('isPlay', true)
    /*如果是无闯关视频*/
    if (!this.store.cache.get('isTask') && this.store.choosedData.checkpoints !== '1') {
      this.store.updateCourseLearningStatus()
    }
    if (this.store.cache.get('isTask') && (this.store.choosedData.checkpoints !== '1')) {
      this.store.cache.set('isSumbit', true)
      let accept = decodeURIComponent(this.props.match.params.bookId).split('&&');
      if (this.store.cache.get('isSumbit') === (true || 0)) {  //可以提交显示，代表我们通过了测试
        //this.GrowthPathStore.saveRecord(accept[0]);
        if (this.store.cache.get('isSumbit') === 0) { //0是不通过，1是通过
          this.GrowthPathStore.commit(accept[0], 0)
        } else {
          this.GrowthPathStore.commit(accept[0], 1)
        }
      }
    }
  }

  toDetail(course_id) {
    // debugger
    console.log("这是appStore：" + appStore);
    // appStore.Loading.show()
    let self = this
    Http.GET('newTask/getCourseCommentNumsScorenNums', {
      'accessToken': getQueryString("accessToken"),
      'courseId': course_id,
    }).then((json) => {
      if (json.dataObject) {
        self.choosedData = json.dataObject;
        self.findBrowsRecordAndSave(course_id);//获取查看人数
        self.getFavourList(course_id);//获取点赞列表数据
        self.commentLIst(course_id);//获取评论列表数据
      } else {
        appStore.Snackbar.handleClick("获取详情失败");
      }
      // appStore.Loading.hidden()
    }).catch((error) => {
      console.warn(error)
      // appStore.Loading.hidden()
    });
  }

  // getNum() {
  //   let id = this.cache.get('courseId');
  //   Http.GET('newTask/getCourseCommentNumsScorenNums', {
  //     'courseId': id,
  //   }).then((json) => {
  //     if (json.dataObject) {
  //       this.choosedData.commentnums = json.dataObject.commentnums;
  //       this.choosedData.likeNum = json.dataObject.likeNum;
  //     }
  //   }).catch((error) => {

  //   });
  // }

  findBrowsRecordAndSave(targetId) {
    Http.GET('contmgn/findBrowsRecordAndSave', {
      'targetId': targetId,
      'findFlag': 1,  //1：只查浏览数，2浏览数+浏览记录集合
      'type': 2,  //1：文章，2：视频
      'accessToken': getQueryString("accessToken")
      // 'accessToken':sessionStorage['accessToken']
    }).then((json) => {
      if (json.dataObject) {
        this.choosedData.browsNum = json.dataObject.browsNum;
        this.choosedData = this.copy(this.choosedData);
      } else {
        appStore.Snackbar.handleClick("获取浏览数失败");
      }
    }).catch((error) => {
      console.warn(error)
    });
  }

  getFavourList(favourRelId) {
    Http.GET('bbs/getFavourList', {
      'accessToken': getQueryString("accessToken"),
      'favourRelId': favourRelId,
      'type': 4,  //1：论坛，2：活动，3：文章，4：课程
      'favourType': 1,
      'page': 1,
      'rows': 15
    }).then((json) => {
      if (json.dataObject) {
        this.choosedData.FavourList = json.dataObject;
        // this.getNum();
        this.choosedData = this.copy(this.choosedData);
      } else {
        appStore.Snackbar.handleClick("获取点赞列表失败");
      }
    }).catch((error) => {
      console.warn(error)
    });
  }

  //评论列表
  commentLIst(courseId, commentId, n) {
    if (n === 1) {
      this.pageComment.nowPage++;
    } else {
      this.pageComment.nowPage = 1
      this.choosedData.commentList = []
    }
    let obj = {
      'accessToken': getQueryString("accessToken"),
      'courseId': courseId,
      'rows': this.pageComment.pageSize,
      'page': this.pageComment.nowPage
    }
    if (commentId) {
      obj.commentId = commentId;
    }
    /*this.loading=true;*/
    Http.GET('game/getCourseCommentByCourseId', obj).then((json) => {
      if (json.dataObject) {
        let temp = json.dataObject;
        temp.forEach((vi) => {
          vi.commentTime = common.dateFormat(vi.commentTime, 'MM-dd hh:mm', "show")
        });
        this.choosedData.commentList.push(...temp);
        // this.getNum();
        this.choosedData = this.copy(this.choosedData);
      } else {
        appStore.Snackbar.handleClick("获取评论列表失败");
      }
      appStore.Loading.hidden()
    }).catch((error) => {
      console.warn(error)
      // appStore.Loading.hidden()
    });
  }
  //分享
	//分享
  postShape = (store) =>{
    // debugger
		let img=store.choosedData.courseImg;
		let title=store.choosedData.courseName;
		// let intro=store.choosedData.courseIntro;
		let msgAndroid={
			method:"share",
			args:[img,title,title,window.location.href]
		}
	  let msgIos={
			method:"share",
			args:{
				sendData:{
					"img":img,
					"title":title,
					"url":document.location.href,
					"subtitle":title
				},
			}
		}
	  communicationWithNative(msgIos,msgAndroid)
	}
  //点赞
  postPraise(id) {
    // 提交点赞文章
    //
    let obj = {
      'accessToken': getQueryString("accessToken"),
      'courseId': this.courseId || this.cache.get('courseId')
    }
    if (id) {
      obj.replyId = id;
    } else {
      this.choosedData.isLike = this.choosedData.isLike === 1 ? 0 : 1;//点亮点赞标识
    }
    /*else{
        if(this.choosedData.isLike!==0){
            this.snackbar.handleClick('已点赞');
            return
        }
    }*/
    Http.GET('bbs/courseLikeOper', obj)
      .then((json) => {
        if (json) {
          if (id) {
            this.commentLIst(this.courseId || this.cache.get('courseId'));
          } else {
            // this.choosedData.isLike=this.choosedData.isLike===1?0:1;//点亮点赞标识
            this.getFavourList(this.courseId || this.cache.get('courseId'));
          }

        } else {
          appStore.Snackbar.handleClick('点赞失败');
        }
      });
  };

  postComment(content) {
    if (!content || (content.length > 0 && content.trim().length === 0)) {
      appStore.Snackbar.handleClick('内容不能为空');
      return;
    }
    // 提交评论
    if (content) {
      Http.GET('game/addCourseComment', {
        'accessToken': getQueryString("accessToken"),
        'courseId': this.courseId || this.cache.get('courseId'),
        'commentContent': content
      })
        .then((json) => {
          if (json) {
            // 清空评论输入框
            content = '';
            this.commentText = '';
            // 刷新评论信息
            this.commentLIst(this.courseId || this.cache.get('courseId'));
            //当前评论数+1
            this.choosedData.commentnums++
          } else {
            appStore.Snackbar.handleClick("点赞失败")
          }
        });
    } else {
      appStore.Snackbar.handleClick("请输入评论内容")
    }
  };

  addLearningLog = () => {
    let lesonId = this.cache.get('lessenId')
    if (!lesonId) return
    let obj = {
      accessToken: getQueryString("accessToken"),
      cost_time: ((new Date()).getTime() - (this.cache.get('timeLearning') || sessionStorage.timeLearning)),
      lesson_id: lesonId,
      interface_type: 3
    }
    Http.GET('emba/addEmbaLearningLog', obj).then((json) => {
      if (json.dataObject.value !== '成功') {
        appStore.Snackbar.handleClick("记录提交不成功");
      }
    }).catch((error) => {
      console.warn(error)
    });
  }
  updateCourseLearningStatus = () => {
    let lesonId = this.cache.get('lessenId') || sessionStorage.lessonId
    if (!lesonId) return
    let obj = {
      accessToken: getQueryString("accessToken"),
      cost_time: ((new Date()).getTime() - (this.cache.get('timeLearning') || sessionStorage.timeLearning)),
      lesson_id: lesonId,
      interface_type: 3
    }
    let self = this
    Http.GET('emba/updateCourseLearningStatus', obj).then((json) => {
      // if(json.dataObject.value==='成功'){
      //     appStore.Snackbar.handleClick("状态更新成功");
      // }
      let temp = decodeURIComponent(sessionStorage.bookInfo).split('&&');
      self.getBookDir(temp[0])
    }).catch((error) => {
      console.warn(error)
    });
  }
  getText = (event) => {
    this.commentText = event.target.value;
  };

  copy(obj1) {
    let obj2 = {};
    for (var i in obj1) {
      obj2[i] = obj1[i];
    }
    return obj2;
  }

  async sumbitTask(self) {
    if (this.cache.get('isHistory') === '1') {
      return
    }
    let url = `${HTTPCnst.shopguide_url}newTask/addGameTaskAtricle?accessToken=${getQueryString("accessToken")}&newTaskId=${this.cache.get('taskId')}&version=4`
    let result = await fetch(url);
    const list = await result.json()
    appStore.Snackbar.handleClick(list.dataObject && list.dataObject.value);
    setTimeout(() => {
      // self.props.history.push('/task')
      window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
			this.props.history.go(-1);
    }, 2000)
  }
}
const communicationWithNative = (iosObj, androidObj, webObj) => {
  if (browser.versions.wechat) {
    window.postMessage(webObj, '*');
  } else if (browser.versions.android) {
    let _android;
    let method = androidObj.method,
      sendData = androidObj.args;
    javascript: (_android = window.android)[method].apply(_android, _toConsumableArray(sendData));
  } else {
    let method = iosObj.method,
      sendData = iosObj.args || null;
    window.webkit.messageHandlers[method].postMessage(sendData);
  }
};
const _toConsumableArray = (arr) => {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
};
const _nonIterableSpread = () => {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
};
const _iterableToArray = (iter) => {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
};
const _arrayWithoutHoles = (arr) => {
  if (Array.isArray(arr)) {
    let arr2 = new Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
};

