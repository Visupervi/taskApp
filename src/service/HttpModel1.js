import {HTTPCnst} from './httpCnst'
// import {Config} from "../../sys/Config";
export default class HttpModel {
	common=HTTPCnst.H5_url;
	/* common='http://172.16.0.233:7080/thanos/api/';*/
	common='http://172.16.1.74/thanos/api/';//签到测试
	/**
	 * @param url 请求地址
	 * @param options 请求参数
	 * @param method 请求方式
	 */
	Fetch(url, options, method = 'GET',prams=null,header='application/json') {
		const searchStr = this.obj2String(options);
		let initObj = {};
		if (method === 'GET') { // 如果是GET请求，拼接url
			url += '?' + searchStr;
			initObj = {
				method: method,
				credentials: 'include',
				// headers: new Headers({
				//     "Authorization":Config.accessToken,
				// })
			}
		} else {
			const urlStr = this.obj2String(prams);
			url += '' + urlStr;
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
		return fetch(`${this.common}${url}`, initObj).then((res) => {
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
	obj2String(obj, arr = '', idx = 0) {
		for (let item in obj) {
			arr+= `&${item}=${obj[item]}`
		}
		return arr.toString()
	}
}