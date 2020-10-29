import {
	observable,
	action,
	flow
} from "mobx";
import {
	HTTPCnst
} from "../../service/httpCnst.js"
import appStore from "../../sys/AppStore"
// import {
// 	Platform
// } from '../../sys/Platform'

import {
	getArticleInfo,
	getUserByuserIds,
	getPraiseData,
	getDiscussData,
	addPraise,
	delPraise,
	addFavorite,
	articleDiscuss
} from '../../apis/Api'
import {
	getQueryString
} from '../../utils/getToken';
// import * as wx from'weixin-js-sdk'
var _ = require('lodash');
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
export default class ArticledetailStore {
	constructor(appStore) {
		// this.articleDetailMap=(appStore&&appStore.articleDetailMap)||new Map();
		// appStore.articleDetailMap = this.articleDetailMap;
		this.praisedata = [];
		this.discussdata = [];
		this.arrImg = [];
		this.articleId = '';
		this.pageSize = 10;
		this.nowPage = 1;
		this.commentNum = 0;
		this.submitFlag = true;
		this.fetchMoreLoading = false;
		this.cache = ArticledetailStore.articleDetailMap;
		this.innerStyle = {
			'width': '62vw'
		};
		appStore.isShowNameToArticle = sessionStorage.getItem('isShowName') ? JSON.parse(sessionStorage.getItem('isShowName')).dataObject.isShowNameToArticle : '0';
		//Platform.config(window.location.href)
	}
	@observable newsData = {};
	@observable cache = new Map();
	@observable static articleDetailMap = new Map();
	@observable commentText = '';
	@observable praiseState = '';
	@observable open = true;
	@observable msg = '';
	@observable iframeHeight = '';
	@observable articledata = {};
	@observable arrImg = []; //富文本内图片链接地址
	@observable praisedata = [];
	@observable discussdata = [];
	@observable articleId = '';
	@observable imgFlag = true;
	@observable pageSize = 10;
	@observable nowPage = 1;
	@observable commentNum = 0;
	@observable submitFlag = true;
	@observable fetchMoreLoading = false;
	@observable clickNumber = 1
	@observable static isLoading = false;
	@observable static err = undefined;
	@observable static lastReqTime = 0 //@fixme

	async sumbitTask() {
		let url = `${HTTPCnst.shopguide_url}newTask/addGameTaskAtricle?newTaskId=${this.store.cache.get('taskId')}&version=4&accessToken=${getQueryString("accessToken")}`
		let result = await fetch(url);
		const list = await result.json()
		appStore.Snackbar.handleClick(list.dataObject && list.dataObject.value);
		setTimeout(() => {
			//window.close();
			window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
			this.props.history.go(-1);
		}, 2000)
	}
	//点击评论
	pinglun = () => {
		if (this.clickNumber === 1) {
			let newH = window.document.getElementsByClassName('listview-content')[0].scrollTop;
			let aaa = document.getElementById('comstitle')
			window.document.getElementsByClassName('listview-content')[0].scrollTo(0, newH + aaa.getBoundingClientRect().y)
			this.clickNumber--
		} else {
			window.document.getElementsByClassName('listview-content')[0].scrollTo(0, 0)
			this.clickNumber++
		}
	}
	// 活动详情
	@action initArticleData = flow(async function* (articleId) {
		// 若store存在
		// 若不存在
		this.articledata = {};
		ArticledetailStore.isLoading = true;
		this.open = true;
		try {
			let getArticleInfoRes = await getArticleInfo({
				"targetId": articleId,
				"accessToken": getQueryString("accessToken")
			});
			const article = getArticleInfoRes;
			if (article) {
				//应该复制数据到store中定义的详细字段
				let users = await getUserByuserIds({
					"userIds": article.author,
					"accessToken": getQueryString("accessToken")
				});

				article.headPic = users[0] ? users[0].headPic : '';
				article.name = users[0] ? users[0].name : '';
				article.nickName = users[0] ? users[0].nickName : '';
				// 根据素材id获取活动素材

				if (article.contentType === "1") {
					let materialurl = HTTPCnst.shopguide_url.replace("api/", "");
					let materialData = yield fetch(materialurl + "appembed-findText.jhtml", {
						"headers": {
							"content-type": "application/x-www-form-urlencoded; charset=UTF-8"
						},
						"body": "search.id=" + article.materialId + "&search.target=1",
						"method": "POST"
					});
					const meterialJson = yield materialData.json();
					article.materialUrl = meterialJson.content;
				}
				//console.log(article)
				this.articledata = article;
				//this.articledata.materialUrl为富文本
				let imgs = this.articledata.materialUrl.match(/<img[^>]+>/g)

				let script = this.articledata.materialUrl.match(/<script[^>]+>/g);
				let scriptUrl = HTTPCnst.shopguide_url.replace('/api/', '/h5') + '/imgEditor/imgEditor/js/preview.js'

				if (script) {
					let scriptTag = document.createElement('script');
					scriptTag.type = 'text/javascript';
					scriptTag.src = scriptUrl;
					document.body.appendChild(scriptTag);
				}
				let arrImg = []
				if (imgs) {
					for (let i = 0; i < imgs.length; i++) {
						// 正则匹配，摘出img标签下的src里的内容
						imgs[i].replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
							arrImg.push(capture)
						})
					}
					this.arrImg = arrImg
					//console.log(this.arrImg)
				}
				// if (article.shareFlag === '1') {
				// 	Platform.config(window.location.href, ['showMenuItems', 'previewImage', 'onMenuShareAppMessage', 'onMenuShareWechat', 'onMenuShareTimeline']).then((res) => {
				// 		Platform.showMenuItems(['menuItem:share:appMessage', 'menuItem:share:wechat', 'menuItem:favorite', 'menuItem:share:timeline'])
				// 		Platform.onMenuShareAppMessage(article.title, article.intro, `http://${HTTPCnst.share_url}/h5-mb-collections/share/shop_article_qy.html?articleId=${articleId}`, article.pic + '?imageView2/1/w/50/h/50')
				// 	})
				// }
			} else {
				//alert('获取文章详情失败')
				appStore.Snackbar.handleClick('获取文章详情失败');
			}
			//let articleUrl = `${HTTPCnst.H5_url}cms/article/info?targetId=${articleId}&accessToken=9bfa4fc61215d6be479bf80921075167_csz`;
			// let articleresult = yield fetch(articleUrl);
			// const article = yield articleresult.json()
			// if(article){
			//     //应该复制数据到store中定义的详细字段
			//     let userUrl = `${HTTPCnst.H5_url}user?userIds=${article.author}&accessToken=9bfa4fc61215d6be479bf80921075167_csz`;
			//     let userresult = yield fetch(userUrl);
			//     const users = yield userresult.json();
			//     article.headPic =  users[0]?users[0].headPic:'';
			//     article.name = users[0]?users[0].name:'';
			//     article.nickName = users[0]?users[0].nickName:'';
			//     // 根据素材id获取活动素材
			//     if(article.contentType==="1"){
			//         let materialurl = HTTPCnst.shopguide_url.replace("api/","");
			//         let materialData =yield fetch(materialurl+"appembed-findText.jhtml", {
			//             "headers":{
			//                 "content-type":"application/x-www-form-urlencoded; charset=UTF-8"
			//             },
			//             "body":"search.id="+article.materialId+"&search.target=1",
			//             "method":"POST"
			//         });
			//         const meterialJson = yield materialData.json();
			//         article.materialUrl = meterialJson.content;
			//     }
			//     this.articledata = article;
			//     //this.articledata.materialUrl为富文本
			//     let imgs = this.articledata.materialUrl.match(/<img[^>]+>/g)
			//     let script = this.articledata.materialUrl.match(/<script[^>]+>/g);
			//     let scriptUrl =HTTPCnst.shopguide_url.replace('/api/','/h5') + '/imgEditor/imgEditor/js/preview.js'
			//     if(script){
			//         let scriptTag = document.createElement('script');
			//         scriptTag.type = 'text/javascript';
			//         scriptTag.src = scriptUrl;
			//         document.body.appendChild(scriptTag);
			//     }
			//     let arrImg = []
			//     if(imgs){
			//         for( let i=0; i<imgs.length; i++ ){
			//             // 正则匹配，摘出img标签下的src里的内容
			//             imgs[i].replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
			//                 arrImg.push(capture)
			//             })
			//         }
			//         this.arrImg = arrImg
			//     }
			//     if(article.shareFlag==='1'){
			//         Platform.config(window.location.href,['showMenuItems','previewImage','onMenuShareAppMessage','onMenuShareWechat','onMenuShareTimeline']).then((res)=>{
			//             Platform.showMenuItems(['menuItem:share:appMessage','menuItem:share:wechat','menuItem:favorite','menuItem:share:timeline'])
			//             Platform.onMenuShareAppMessage(article.title,article.intro,`http://${HTTPCnst.share_url}/h5-mb-collections/share/shop_article_qy.html?articleId=${articleId}`,article.pic+'?imageView2/1/w/50/h/50')
			//         })
			//     }
			// }else{
			//     appStore.Snackbar.handleClick('获取文章详情失败');
			// }

			ArticledetailStore.lastReqTime = Date.now()
		} catch (err) {
			ArticledetailStore.err = err;
			//alert(err)
			appStore.Snackbar.handleClick(err);
		}
		ArticledetailStore.isLoading = false;
		this.open = false;
	})

	//富文本图片预览
	@action articlePreviewImage = (e) => {
		debugger
		let _this = this
		let nowImgurl = e.target.currentSrc
		//获取文章,排除非图片点击
		if (!nowImgurl) {
			return
		}
		// let index=_this.arrImg.indexOf(nowImgurl)
		if (nowImgurl && _this.arrImg.length > 0) {
			// appStore.ImageViewer.openViewer(_this.arrImg,index)
			//Platform.previewImage(nowImgurl, this.arrImg)
			// wx.imagePreview({current:nowImgurl,urls:this.arrImg})
		}
	}

	// 文章点赞列表
	@action initPraiseData = flow(async function* (articleId) {
		try {
			const praises = await getPraiseData({
				"praiseType": "article",
				"praiseTargetId": articleId,
				"pageSize": 10,
				"nowPage": 1,
				"accessToken": getQueryString("accessToken")
			});
			//console.log(praises)
			if (praises.list) {
				let praiseuserIds = [];
				praises.list.forEach((praiseitem, idx) => {
					praiseuserIds.push(praiseitem.createUser);
				});
				// 根据点赞人id拿到点赞者信息
				const praiseusers = await getUserByuserIds({
					"userIds": praiseuserIds.length > 0 ? praiseuserIds.join(',') : null,
					"accessToken": getQueryString("accessToken")
				})
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
			// let praiseUrl = `${HTTPCnst.H5_url}cms/praise?praiseType=article&praiseTargetId=${articleId}&pageSize=10&nowPage=1`;
			// let praiseresult = yield fetch(praiseUrl);
			// const praises = yield praiseresult.json();
			// if(praises.list){
			//     let praiseuserIds = [];
			//     praises.list.forEach((praiseitem,idx)=>{
			//         praiseuserIds.push(praiseitem.createUser);
			//     });
			// // 根据点赞人id拿到点赞者信息
			//     let userUrl = `${HTTPCnst.H5_url}user?userIds=${praiseuserIds.length>0?praiseuserIds.join(','):null}`;
			//     let praresult = yield fetch(userUrl);
			//     const praiseusers = yield praresult.json();
			//     praises.list.forEach((praiseitem,index) =>{
			//         praiseusers.forEach((user) =>{
			//             if(praiseitem.createUser===user.sysUserId){
			//                 praiseitem.headPic = user.headPic;
			//                 praiseitem.name = user.name;
			//                 praiseitem.nickName = user.nickName;
			//                 praiseitem.isShowNameToArticle = appStore.isShowNameToArticle;
			//             }
			//         })
			//     });
			//     this.praisedata = praises;
			// }else{
			//    this.praisedata.clear()
			// }
		} catch (err) {
			//alert(err)
			appStore.Snackbar.handleClick(err);
		}
	})
	// 文章评论列表
	@action initCommentData = flow(async function* (articleId) {
		try {
			// 获取帖子评论列表
			this.fetchMoreLoading = true;
			let accessToken=getQueryString("accessToken")
			let commentUrl = `${HTTPCnst.H5_url}cms/discuss?discussType=articleComment&discussTargetId=${articleId}&pageSize=${this.pageSize}&nowPage=${this.nowPage}&accessToken=${accessToken}`;
			let commentresult = yield fetch(commentUrl);
			const comments = yield commentresult.json();
			if(comments.list&&comments.list.length>0){
			    let commentuserIds = [];
			    // let commentIds = [];
			    _.map(comments.list,(item)=>{commentuserIds.push(item.createUser)});
			    let commentFilteruserId = new Set(commentuserIds);
			    // 根据评论人id拿到评论者信息
			    let comUrl = `${HTTPCnst.H5_url}user?userIds=${commentuserIds.length>0?[...commentFilteruserId].join(','):null}&accessToken=${accessToken}`;
			    let comresult = yield fetch(comUrl);
			    const commentusers = yield comresult.json();
			    comments.list.forEach((commentitem,index) =>{
			        commentusers.forEach((user) =>{
			            if(commentitem.createUser===user.sysUserId){
			                commentitem.headPic = user.headPic;
			                commentitem.name = user.name;
			                commentitem.nickName = user.nickName;
			                commentitem.isShowNameToArticle = appStore.isShowNameToArticle;
			            }
			        })
			    });
			    if(this.nowPage===1){
			        this.discussdata = comments.list;
			    }else{
			       this.discussdata = this.discussdata.slice().concat(comments.list);
			    }
			    this.commentNum = comments.totalCount;
			}
			this.fetchMoreLoading = false;
			this.open = false;
		} catch (err) {
			this.open = false;
			this.fetchMoreLoading = false;
			//alert(err)
			appStore.Snackbar.handleClick(err);
		}
	})

	//下拉默认请求第一页数据  (应该是取store数据）
	@action _onPullRefresh = flow(function* (store) {
		store.nowPage = 1;
		yield this.initCommentData(store.articleId);
	})

	//上滑加载更多  concat  page+1数据
	@action _onEndReached = flow(function* (store) {
		store.nowPage++;
		yield this.initCommentData(store.articleId);
	})

	//分享
	//分享
  postShape = (store) =>{
		let img=store.articledata.pic;
		let title=store.articledata.title;
		let intro=store.articledata.intro;
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
				callback:{}
			}
		}
	  communicationWithNative(msgIos,msgAndroid)
	}


	// 提交点赞文章
	postPraise = flow(async function* (store) {
		//try {
		// 	if (store.articledata.favourStatus) {
		// 		const praises = await delPraise({
		// 			"praiseType": "article",
		// 			"praiseTargetId": store.articleId,
		// 			"accessToken": getQueryString("accessToken")
		// 		})
		// 		if (!praises) {
		// 			appStore.Snackbar.handleClick("点赞失败");
		// 		}
		// 		store.articledata.favourStatus = !store.articledata.favourStatus
		// 		store.initPraiseData(store.articleId)
		// 	} else {
		// 		const praises = await addPraise({
		// 			"praiseType": "article",
		// 			"praiseTargetId": store.articleId,
		// 			"accessToken": getQueryString("accessToken")
		// 		})
		// 		console.log(praises)
		// 		if (!praises) {
		// 			appStore.Snackbar.handleClick("点赞失败");
		// 		}
		// 		store.articledata.favourStatus = !store.articledata.favourStatus
		// 		store.initPraiseData(store.articleId)
		// 	}

		// } catch (err) {
		// 	store.articledata.favourStatus = false;
		// 	appStore.Snackbar.handleClick(err);
		// }


		let praise='praise'
		if(store.articledata.favourStatus){
		    praise='praise/del'
		}
		try {
			 let accessToken = getQueryString("accessToken")
		    let praiseUrl = `${HTTPCnst.H5_url}cms/${praise}?praiseType=article&praiseTargetId=${store.articleId}&accessToken=${accessToken}`;
		    let praiseresult = yield fetch(praiseUrl,{method:"POST"});
		    const praises = yield praiseresult.json();
		    if(!praises){
		        appStore.Snackbar.handleClick("点赞失败");
		    }
		    store.articledata.favourStatus=!store.articledata.favourStatus
		    store.initPraiseData(store.articleId)
		 } catch (err) {
		    store.articledata.favourStatus = false;
		    appStore.Snackbar.handleClick(err);
		}
	})
	// 提交收藏文章
	postFavorite = flow(async function* (store) {
		if (ArticledetailStore.isLoading)
			return
		ArticledetailStore.isLoading = true;
		let favoriteFlag = store.articledata.favoriteStatus === true ? 1 : 0;
		try {
			const favorites = await addFavorite({
				"targetId": store.articleId,
				"targetIntro": store.articledata.intro,
				"favoritePic": store.articledata.pic,
				"favoriteTitle": store.articledata.title,
				"targetType": "article",
				"delFlag": favoriteFlag,
				"accessToken": getQueryString("accessToken")
			})
			if (favorites) {
				store.articledata.favoriteStatus = !store.articledata.favoriteStatus;
			} else {
				appStore.Snackbar.handleClick("操作失败");
			}
			ArticledetailStore.isLoading = false;

			// let favoriteUrl = `${HTTPCnst.H5_url}game/favorite?targetId=${store.articleId}&targetIntro=${store.articledata.intro}&favoritePic=${store.articledata.pic}&favoriteTitle=${store.articledata.title}&targetType=article&delFlag=${favoriteFlag}`;
			// let favoriteresult = yield fetch(favoriteUrl,{method:"POST"});
			// const favorites = yield favoriteresult.json();
			// if(favorites){
			//     store.articledata.favoriteStatus = !store.articledata.favoriteStatus;
			// }else{
			//     appStore.Snackbar.handleClick("操作失败");
			// }
			// ArticledetailStore.isLoading = false;

		} catch (err) {
			ArticledetailStore.isLoading = false;
			appStore.Snackbar.handleClick(err);
		}
	})

	// 提交点赞活动评论
	postSecondPraise = flow(async function* (store, targetId, str = 'add') {
		try {
			// if (store.articledata.favourStatus) {
			// 	const praises = await delPraise({
			// 		"praiseType":"articleComment",
			// 		"praiseTargetId":targetId,
			// 		"superId":store.articleId,
			// 		"accessToken": getQueryString("accessToken")
			// 	})
			// 	if (praises) {} else {
			// 		appStore.Snackbar.handleClick("点赞失败");
			// 		store.nowPage = 1;
			// 		store.initCommentData(store.articleId)
			// 	}
			// } else {
			// 	const praises = await addPraise({
			// 		"praiseType": "articleComment",
			// 		"praiseTargetId": targetId,
			// 		"superId": store.articleId,
			// 		"accessToken": getQueryString("accessToken")
			// 	})
			// 	if (praises) {} else {
			// 		appStore.Snackbar.handleClick("点赞失败");
			// 		store.nowPage = 1;
			// 		store.initCommentData(store.articleId)
			// 	}
			// }


			let praise='praise'
			if(str==='del'){
			    praise='praise/del'
			}
			let accessToken=getQueryString("accessToken")
			let praiseUrl = `${HTTPCnst.H5_url}cms/${praise}?praiseType=articleComment&praiseTargetId=${targetId}&superId=${store.articleId}&accessToken=${accessToken}`;
			let praiseresult = yield fetch(praiseUrl,{method:"POST"});
			const praises = yield praiseresult.json();
			if(praises){
			}else{
			    appStore.Snackbar.handleClick("点赞失败");
			    store.nowPage = 1;
			    store.initCommentData(store.articleId)
			}
		} catch (err) {
			store.nowPage = 1;
			store.initCommentData(store.articleId)
			appStore.Snackbar.handleClick(err);
		}
	})
	// 提交评论
	postComment = flow(async function* (store, content) {
		if (!content || (content.length > 0 && content.trim().length === 0)) {
			appStore.Snackbar.handleClick("评论内容不能为空");
			return
		}
		store.submitFlag = true;
		let formData = {
			'content': content,
			"taskId":0,
			'discussTargetId': store.articleId
		};
		try {

			// let json = await articleDiscuss(formData);
			// if (json) {
			// 	// 清空评论输入框
			// 	store.commentText = '';
			// 	// 刷新评论信息
			// 	store.nowPage = 1;
			// 	store.initCommentData(store.articleId);
			// } else {
			// 	appStore.Snackbar.handleClick("点赞失败");
			// }
			// appStore.Mask.hidden()

			let commentUrl = `${HTTPCnst.H5_url}cms/discuss?discussType=articleComment&accessToken=${getQueryString("accessToken")}`;
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
				store.initCommentData(store.articleId);
			} else {
				appStore.Snackbar.handleClick("点赞失败");
			}
			// store.submitFlag = true;
			appStore.Mask.hidden()
		} catch (err) {
			store.submitFlag = true;
			appStore.Mask.hidden()
			appStore.Snackbar.handleClick(err);
		};
	});

	//判断是否显示发送按钮
	switchover(store, n) {
		if (n === 1) {
			store.submitFlag = false;
			appStore.Mask.show()
			// setTimeout(()=>{alert(window.innerHeight)})
		}
		if (n === 2 && !store.commentText) {
			appStore.Mask.hidden()
			setTimeout(function () {
				store.submitFlag = true;
			}, 300)
		}
	}
	getText = (event) => {
		this.commentText = event.target.value;
	};

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
		//console.log(window.webkit)
    let method = iosObj.method,
			sendData = iosObj.args || null;
			//console.log(sendData)
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
