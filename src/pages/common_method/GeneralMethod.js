export default class Common {
  /*时间格式转化，输出时间字符串*/
  dateFormat(obj, format, show) {
    if (!obj) return null;
    let istype = this.isType(obj);
    let returnVal = null;
    let temp = null;
    switch (istype) {
      case 0:
        returnVal = obj;
        break;
      case 1:
        temp = (obj.slice(0, 19));
        temp = temp.replace(/-/g, "/").replace(/T/g, " ");
        returnVal = new Date(Date.parse(temp) + 8 * 1000 * 60 * 60);
        break;
      case 2:
        temp = (obj.slice(0, 19));
        temp = temp.replace(/-/g, "/");
        returnVal = new Date(Date.parse(temp));
        break;
      case 3:
        returnVal = new Date(Number(obj));
        break;
      case 4:
        returnVal = new Date(obj.time);
        break;
      default:
        returnVal = obj;
        break;
    }
    /*如果是 不足一小时 显示多少分钟前
   如果 不足24小时 显示 多少小时前
   如果 48小时 > time ＞ 24小时 显示1天前*/
    if (show) {
      let now = new Date()  //获取当前时间
      let showTime = ''
      let surplusTime = now.getTime() - returnVal.getTime();
      if (surplusTime < 1000 * 60) {
        showTime = `刚刚`
      } else if (surplusTime < 1000 * 60 * 60) {
        showTime = `${Math.floor(surplusTime / (1000 * 60))}分钟前`
      } else if (surplusTime < 1000 * 24 * 60 * 60) {
        showTime = `${Math.floor(surplusTime / (1000 * 60 * 60))}小时前`
      } else if (1000 * 24 * 60 * 60 < surplusTime && surplusTime < 1000 * 48 * 60 * 60) {
        showTime = `1天前`
      } else {
        if (format) {
          showTime = this.timeJoin(returnVal, format)
        } else {
          showTime = returnVal
        }
      }
      return showTime
    } else if (format) {
      return this.timeJoin(returnVal, format);
    } else {
      return returnVal;
    }

  }

  isType(value) {
    if (typeof value === "string") {
      if (value.indexOf('T') > -1) {  /*1888-09-10T10:11*/
        return 1;
      } else if (value.indexOf('-') > -1) { /*1888-09-10 10:11*/
        return 2;
      } else if (value.indexOf('/') > -1) { /*1888/09/10 10:11*/
        return 2;
      } else {
        return 3
      }
    } else if (typeof value === "object") {
      if (value.time) {
        return 4;
      } else {
        return 5;
      }
    } else if (typeof value === "number") {
      return 3;
    } else {
      return 0;
    }
  }

  timeJoin(str, format) {
    let s = str;
    let n = new Date();
    let time = s.getFullYear() + '-' + ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '-' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + ' ' + (s.getHours() > 9 ? s.getHours() : ('0' + s.getHours())) + ':' + (s.getMinutes() > 9 ? s.getMinutes() : ('0' + s.getMinutes())) + ':' + (s.getSeconds() > 9 ? s.getSeconds() : ('0' + s.getSeconds()));
    if (format === 'yyyy-MM-dd') {
      time = s.getFullYear() + '-' + ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '-' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate()));
    }
    if (format === '年月日') {
      time = s.getFullYear() + '年' + ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '月' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + '日';
    }
    if (format === 'MM-dd hh:mm') {
      time = ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '-' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + ' ' + (s.getHours() > 9 ? s.getHours() : ('0' + s.getHours())) + ':' + (s.getMinutes() > 9 ? s.getMinutes() : ('0' + s.getMinutes()));
      if (s.getFullYear() !== n.getFullYear()) {
        time = s.getFullYear() + '-' + time
      }
    }
    if (format === 'MM-dd') {
      time = ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '.' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate()));
      if (s.getFullYear() !== n.getFullYear()) {
        time = s.getFullYear() + '.' + time
      }
    }
    if (format === '年月日时') {
      time = ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '月' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + '日 ' + (s.getHours() > 9 ? s.getHours() : ('0' + s.getHours())) + ':' + (s.getMinutes() > 9 ? s.getMinutes() : ('0' + s.getMinutes()));
      if (s.getFullYear() !== n.getFullYear()) {
        time = s.getFullYear() + '年' + time
      }
    }
    if (format === 'yy.MM.dd hh:mm') {
      let year = s.getFullYear().toString().slice(2)
      time = year + '.' + ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '.' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + ' ' + (s.getHours() > 9 ? s.getHours() : ('0' + s.getHours())) + ':' + (s.getMinutes() > 9 ? s.getMinutes() : ('0' + s.getMinutes()));
    }

    if (format === 'yyyy.MM.dd hh:mm') {
      let year = s.getFullYear().toString()
      time = year + '.' + ((s.getMonth() + 1) > 9 ? (s.getMonth() + 1) : ('0' + (s.getMonth() + 1))) + '.' + (s.getDate() > 9 ? s.getDate() : ('0' + s.getDate())) + ' ' + (s.getHours() > 9 ? s.getHours() : ('0' + s.getHours())) + ':' + (s.getMinutes() > 9 ? s.getMinutes() : ('0' + s.getMinutes()));
    }
    return time;
  }

  /*千位分类*/
  toThousands(num) {
    if (num) {
      if (num && num.toString().indexOf('.') == -1) { //如果是整数
        return (parseInt(num, 10) || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
      } else {//如果是小数
        let nums = num.toString().split('.');
        let num1 = nums[0];
        let num2 = nums[1];
        return num1.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + num2;
      }
    }
  }

  // 可以将数字转换成中文大写的表示，处理到万级别
  toChinesNum(num) {
    let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']; //changeNum[0] = "零"
    let unit = ["", "十", "百", "千", "万"];
    num = parseInt(num, 10);
    let getWan = (temp) => {
      let strArr = temp.toString().split("").reverse();
      let newNum = "";
      for (var i = 0; i < strArr.length; i++) {
        newNum = (i === 0 && parseInt(strArr[i], 10) === 0 ? "" : (i > 0 && parseInt(strArr[i], 10) === 0 && parseInt(strArr[i - 1], 10) === 0 ? "" : changeNum[strArr[i]] + (parseInt(strArr[i], 10) === 0 ? unit[0] : unit[i]))) + newNum;
      }
      return newNum;
    }
    let overWan = Math.floor(num / 10000);
    let noWan = num % 10000;
    if (noWan.toString().length < 4) noWan = "0" + noWan;
    return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
  }

  //倒计时转换
  TimeDown(id, endDateStr) {
    //结束时间
    let endDate = new Date(endDateStr);
    //当前时间
    let nowDate = new Date();
    //相差的总秒数
    let totalSeconds = endDate - nowDate > 0 ? parseInt((endDate - nowDate) / 1000) : 0;
    //天数
    let days = Math.floor(totalSeconds / (60 * 60 * 24));
    //取模（余数）
    let modulo = totalSeconds % (60 * 60 * 24);
    //小时数
    let hours = Math.floor(modulo / (60 * 60));
    modulo = modulo % (60 * 60);
    //分钟
    let minutes = Math.floor(modulo / 60);
    //秒
    let seconds = modulo % 60;
    // //延迟一秒执行自己
    // setTimeout(function () {
    //     this.TimeDown(id, endDateStr);
    //     console.log(endDateStr)
    // }, 1000)
    //输出到页面
    return (`${days ? days + '天' : ''}${hours}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`);
  }

  //金币快捷展示
  godNum(num) {
    let n = num - 0;
    if (n < 0) {
      return 0
    }
    if (n <= 999999) {
      return n
    }
    if (n > 1000000) {
      return Math.floor(n / 10) / 100 + 'k'
    }
  }

  //评论快捷展示
  discussNum(num) {
    let n = num - 0;
    if (n < 0) {
      return 0
    }
    if (n <= 9999) {
      return n
    }
    if (n <= 99999) {
      return Math.floor(n / 1000) / 10 + '万'
    }
    if (n >= 100000) {
      return '10万+'
    }
  }
}
