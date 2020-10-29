import React, {Component} from 'react';
import appStore from "../../sys/AppStore"
export default class Testmodule extends Component {
    constructor(props) {
        super(props);
        document.title = appStore.store.get('moduleName') || '其他模块'
        this.state={
            value:'',
            obj:[],
            json:null
        }
    }
    Fetch(url, options, method = 'GET',prams=null,header='application/json') {
        let initObj = {};
        if (method === 'GET') { // 如果是GET请求，拼接url
            initObj = {
                method: method,
                credentials: 'include',
                // headers: new Headers({
                //     "Authorization":Config.accessToken,
                // })
            }
        } else {
            // const urlStr = this.obj2String(prams);
            url += '?' + prams;
            initObj = {
                method: method,
                credentials: 'include',
                headers: {
                    'Accept': header,
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify(options)
            }
        }
        return fetch(`${url}`, initObj).then((res) => {
            return res.json()
        }).catch((error)=>{
            console.error(error);
        });
    }
    /**
     * @param url 请求地址
     * @param options 请求参数
     */
    GET(url,options) {
        return this.Fetch(url,options,'GET')
    }
    POST(url,prams,options,header='application/json') {
        return this.Fetch(url, options, 'POST',prams,header)
    }
    // obj2String(obj, arr = '', idx = 0) {
    //     for (let item in obj) {
    //         arr+= `&${item}=${obj[item]}`
    //     }
    //     return arr.toString()
    // }
    async getData(n){
       if(n===2){
           this.POST(this.state.value,this.state.obj)
       }else{
           this.GET(this.state.value)
       }
    }
    handleChange1(event){
        this.setState({ value:event.target.value });
    }
    handleChange2(event){
        this.setState({ obj:event.target.value });
    }
    render() {
        return (
            <div>
                <textarea style={{width:'90%'}} value={this.state.value} onChange={this.handleChange1.bind(this)} placeholder="搜索你需要的URL" ></textarea>
                <input style={{width:'90%'}} value={this.state.obj} onChange={this.handleChange2.bind(this)} placeholder="输入你所要的字符串对象"/>
                <button onClick={()=>this.getData(1)}>
                    get调用
                </button>
                <button onClick={()=>this.getData(2)}>
                    post调用
                </button>
                <div>{this.state.json}</div>
            </div>
        );
    }
}

