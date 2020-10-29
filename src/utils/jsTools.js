// 一些常用的js方法
/*解析当前的url，map类型输出*/


var urlParse=(url)=>{
    let parser = document.createElement('a');
    parser.href = url;
    let query = new URLSearchParams((parser.search));
    return query
};
var showBackHome=(backhome,self)=>{
    if(sessionStorage.messageroute && window.location.href.indexOf(sessionStorage.messageroute)>-1){
        backhome.show(self)
    }else{
        //backhome.hide(self)
    }
};
module.exports={
    urlParse:urlParse,
    ShowBackHome:showBackHome
}