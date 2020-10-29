/**
 * @Author: visupervi
 * @Date: 2020-07-20 13:48
 * @return:
 * @Description 获取token
*/
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
