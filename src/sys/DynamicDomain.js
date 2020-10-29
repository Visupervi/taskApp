/*根据超导token，动态获取域名*/
import {GetHttp, HTTPCnst} from "../service/httpCnst";
import {Config} from "./Config";
import appStore from "./AppStore";
import {observable} from "mobx";

const DynamicDomain={}
 DynamicDomain.GetDomain=async (accessToken,code)=>{
        let url = `${HTTPCnst.shopguide_url}sysparam/search?accessToken=${accessToken}&cate=6005${code?('&code='+code):''}`;
        const result = await fetch(url,{'delAuthorization':true})
        let jsonResult=await result.json()
        if(jsonResult.code===102){
         let data=jsonResult.dataObject || [];
         let domainArr={};
         data.map((item)=>{
             domainArr[item.paramCode]=item.paramValue
         })
         sessionStorage.Domains=JSON.stringify(domainArr)
         GetHttp();  //修改http内部缓存
     }else{
            appStore.Snackbar.handleClick(jsonResult.dataObject.value || '获取列表失败，请重新登录')
        }
    }
DynamicDomain.Domains=JSON.parse(sessionStorage.Domains || '{}');
DynamicDomain.Domain=(code)=>{
    if(!sessionStorage.Domains){return}
    let domainArr=JSON.parse(sessionStorage.Domains);
    let CurrentDomain=domainArr[code];
    return CurrentDomain;
}
export default DynamicDomain
