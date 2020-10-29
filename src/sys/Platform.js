import * as dd from 'dingtalk-jsapi';
import * as wx from'weixin-js-sdk'
import {HTTPCnst} from "../service/httpCnst.js"
const Platform = {};
const un = navigator.userAgent.toLowerCase();
Platform.name = (() => {
    if (dd.android || dd.ios) {//判断当前应用是否在钉钉环境内
        return "dd";
    }else if(un.includes('wxwork')||un.includes("micromessenger")){//判断当前应用是否在企业微信或者微信环境内
        return 'wx'
    }else {
        return  "other"
    }
})();
Platform.OS= (()=>{
    if (dd.android || dd.ios) {
        return dd.env.platform;
    }
    /*.........................获取使用钉钉的平台类型............................*/
    if(un.includes('micromessenger')&&un.includes("iphone")){
        return "ios";
    }
    if(un.includes('micromessenger')&&un.includes("android")){
        return "android";
    }
    /* ........................判断使用微信的平台类型...........................*/
})();
Platform.config =async (url,jsApiArr=['previewImage'])=>{
    /*config接口注入权限验证配置*/
    // // 判断是否是微信环境
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    let shareUrl=`${HTTPCnst.H5_url}wx/config/getWeixinShareSignature?encodeURIComponentUrl=${encodeURIComponent(url)}&secret=8F7TJHpB9eKJMaocmk7AAzdDaNILkMmovfh6hthbleo&appId=${JSON.parse(sessionStorage.userInfo).appId}`
    let result = await fetch(shareUrl);
    const data = await result.json();
    return new Promise((resolve, reject)=>{
        wx.config({
            beta: true,// 必须这么写，否则wx.invoke调用形式的jsapi会有问题
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appid, // 必填，企业微信的corpID
            timestamp:data.ts, // 必填，生成签名的时间戳
            nonceStr: "123456789", // 必填，生成签名的随机串
            signature:data.gensignature,// 必填，签名，见 附录-JS-SDK使用权限签名算法
            jsApiList: jsApiArr // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(resolve('success'));
        wx.error(reject);
    })
};
Platform.previewImage=(img,imgs)=>{
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    wx.previewImage({current:img,urls:imgs});
}
/*隐藏所有非基础按钮接口*/
Platform.hideAllNonBaseMenuItem=()=>{
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    wx.hideAllNonBaseMenuItem();
    console.log('隐藏生效')
}
/*批量显示功能按钮接口*/
Platform.showMenuItems=(arr)=>{
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    wx.showMenuItems({
        menuList: arr // 要显示的菜单项
    });
}
/*获取“转发”按钮点击状态及自定义分享内容接口*/
Platform.onMenuShareAppMessage=(title,desc,link,imgUrl)=>{
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    console.log('显示生效')
    wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareWechat({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareTimeline({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接；在微信上分享时，该链接的域名必须与企业某个应用的可信域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
}
/*关闭当前页面*/
Platform.close=()=>{
    if(!(un.includes('wxwork')||un.includes("micromessenger"))){
        return false
    }
    wx.closeWindow();
}
export {Platform}
