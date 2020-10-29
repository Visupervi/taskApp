import {Platform} from "../sys/Platform";
import * as dd from 'dingtalk-jsapi';

const CommonInterface = {};

CommonInterface.setTitle = (title = "超级伙伴", succCallback) => {
  if (Platform.name === "dingding") {
    dd.biz.navigation.setTitle({
      title: title,//控制标题文本，空字符串表示显示默认文本
      onSuccess: function (result) {
      },
      onFail: function (err) {
      }
    });
  } else {
    return document.title = title;
  }
}


export {CommonInterface}
