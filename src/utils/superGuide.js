/**
 * @Author Visupervi
 * @Date 2019/12/24 22:10
 * @Name
 * @Param
 * @Return
 * @Description 与原生交互模块
 */
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
    let arr2 = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
};
// 判断平台
const browser = {
  versions: function () {
    let u = navigator.userAgent;
    return {
      //移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1,
      //IE内核
      presto: u.indexOf('Presto') > -1,
      //opera内核
      webKit: u.indexOf('AppleWebKit') > -1,
      //苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
      //火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/),
      //是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      //ios终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
      //android终端或者uc浏览器
      iPhone: u.indexOf('iPhone') > -1,
      //是否为iPhone或者QQHD浏览器
      iPad: u.indexOf('iPad') > -1,
      //是否iPad
      webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
      wechat: u.indexOf('wxwork') > -1,
    };
  }(),
  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};
// js与原生通用调用方法
export const communicationWithNative = (iosObj, androidObj, webObj) => {
  if (browser.versions.wechat) {
    window.postMessage(webObj, '*');
  } else if (browser.versions.android) {
    let _android;
    let method = androidObj.method,
      sendData = androidObj.args;
    (_android = window.android)[method].apply(_android, _toConsumableArray(sendData));
  } else {
    let method = iosObj.method,
      sendData = iosObj.args || null;
    window.webkit.messageHandlers[method].postMessage(sendData);
  }
};
// 获取token
export const getQueryString = (str) => {
  let url = window.location.toString();
  let arrObj = url.split("?");
  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split("&");
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      if (arr != null && arr[0] === str) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
};
// 判断设备信息
export const getDeviceInfo = () => {
  let ua = navigator.userAgent;
  if (ua.indexOf("Android") > -1) {
    return true;
  } else if (ua.indexOf("iPhone") > -1) {
    return false;
  } else {
    return false;
  }
};
export const overscroll = (el) => {
  el.addEventListener('touchstart', function () {
    var top = el.scrollTop;
    var totalScroll = el.scrollHeight;
    var currentScroll = top + el.offsetHeight;
    if (top === 0) {
      el.scrollTop = 1;
    } else if (currentScroll === totalScroll) {
      el.scrollTop = top - 1;
    }
  });
  el.addEventListener('touchmove', function (evt) {
    if (el.offsetHeight < el.scrollHeight) {
      evt._isScroller = true;
    }
  });
};
//日期格式化函数
export const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

// 初始化数字
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n
}

// 节流函数
export const throttle = (fn, delay, mustRun) => {
  let timer = null,
    previous = null;
  return function () {
    clearTimeout(timer);
    let now = +new Date(),
      context = this,
      args = arguments;
    if (!previous) previous = now;
    let remaining = now - previous;
    if (mustRun && remaining >= mustRun) {
      fn.apply(context, args);
      previous = now;
    } else {
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    }
  }
}
