/**
 * @Author: visupervi
 * @Date: 2020-07-07 16:29
 * @return:
 * @Description 对路由进行封装，实现类似于vue的路由
*/
import {getQueryString} from "../utils/getToken";

let routes = [];
const routerContext = require.context(
  // 其组件目录的相对路径
  '../pages',
  // 是否查询其子目录
  true,
  // 匹配基础组件文件名的正则表达式
  /\.router.js/
);
// console
routerContext.keys().forEach((router)=>{
  // console.log(router)
  if(router.startsWith("./myStudy") || router.startsWith("./mobileMap")) return;
  const routerModule = routerContext(router);
  // routerModule.default[0].path =`${routerModule.default[0].path}?accessToken=${getQueryString("accessToken")}`;
  // console.log("routerModule",routerModule)
  // console.log("routerModule",routerModule)
  routes = [...routes,...(routerModule.default||routerModule)]
});

export default routes;
