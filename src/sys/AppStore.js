import { observable } from "mobx";
// import HeadPic from "../component/userHead/headIndex"
import HeadPic from "../pages/userInfo/headIndex"
const appStore = observable({})
appStore.store=new Map()
// window.app = appStore
// appStore.Loading.hidden= () =>{
//     console.log()
// }
// appStore.Loading.show= () =>{
//     console.log()
// }
// @TODO login user regist to app store
// class UserStore{
//     constructor(appStore) {
//         this.appStore = appStore
//     }
// }
export default appStore
export {HeadPic}
