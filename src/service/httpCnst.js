import DynamicDomain from "../sys/DynamicDomain"

const NODE_ENV = process.env.REACT_APP_CONFIG_ENV;

//const isProdction = process.env.NODE_ENV;
function GetHttp() {
  let _HTTPCnst = {}
  switch (NODE_ENV) {
    case 'test':
      _HTTPCnst = {
        shopguide_url: "http://172.16.0.200:8000/shopguide/api/",		// 超导请求地址
        om_si_url: DynamicDomain.Domain('url_pk') ? DynamicDomain.Domain('url_pk') + '/' : 'http://172.16.0.200:8080/om-si/',// PK接口

        growup_url: DynamicDomain.Domain('url_growup') ? DynamicDomain.Domain('url_growup') + '/growup/' : 'http://172.16.0.200:18080/om-web/growup/',// 成长路径请求地址

        h5_mb_collections: 'http://172.16.0.200:9080/',

        H5_url: DynamicDomain.Domain('url_thanos') ? DynamicDomain.Domain('url_thanos') + '/api/' : 'http://172.16.0.233:7080/thanos/api/',// 嵌入式请求地址

        combine_url: 'http://172.16.0.200:8181/unify-operate/api/',

        share_url: '172.16.0.200:8000',
        appId: '',
        baseUrl: '/build/?/'
        // om_si_url : "http://172.16.0.200:8080/om-si/",		// PK接口
        //
        // growup_url : "http://172.16.0.200:18080/om-web/growup/",	// 成长路径请求地址
        //
        // H5_url : 'http://172.16.0.233:7080/thanos/api/',// 嵌入式请求地址

      };
      break
    // case 'pre':_HTTPCnst={
    //     shopguide_url : "http://pre.xxynet.com/shopguide/api/",		// 超导请求地址
    //     om_si_url : 'http://newv.xxynet.com/om-web/',// PK接口
    //
    //     growup_url : DynamicDomain.Domain('url_growup')?DynamicDomain.Domain('url_growup')+'/growup/':'http://172.16.0.200:18080/om-web/growup/',// 成长路径请求地址
    //
    //     H5_url : DynamicDomain.Domain('url_thanos')?DynamicDomain.Domain('url_thanos')+'/api/':'http://pre.xxynet.com/thanos/api/',// 嵌入式请求地址
    //
    //     baseUrl:'/build/?/'
    //     // growup_url : "http://172.16.0.200:18080/om-web/growup/",	// 成长路径请求地址
    //     //
    //     // om_si_url : "http://pre.xxynet.com/om-si/",		// PK接口
    //     //
    //     // H5_url : 'http://pre.xxynet.com/thanos/api/'// 嵌入式请求地址
    // };break
    case 'pre':
      _HTTPCnst = {
        user_Url:"http://it.xxynet.com/shopguide/api/",
        // shopguide_url: "http://newv.xxynet.com/shopguide/api/",		// 超导请求地址
        shopguide_url: "http://it.xxynet.com/shopguide/api/",		// 超导请求地址
        // shopguide_url: "http://172.16.1.38:8080/shopguide/api/",		// 超导请求地址

        om_si_url: DynamicDomain.Domain('url_pk') ? DynamicDomain.Domain('url_pk') + '/' : 'http://newv.xxynet.com/om-web/',// PK接口

        growup_url: DynamicDomain.Domain('url_growup') ? DynamicDomain.Domain('url_growup') + '/growup/' : 'http://139.129.204.152:801/om-web/growup/',// 成长路径请求地址

        // H5_url: DynamicDomain.Domain('url_thanos') ? DynamicDomain.Domain('url_thanos') + '/api/' : 'http://pre.xxynet.com/thanos/api/',// 嵌入式请求地址
        H5_url: DynamicDomain.Domain('url_thanos') ? DynamicDomain.Domain('url_thanos') + '/api/' : 'http://it.xxynet.com/thanos/api/',// 嵌入式请求地址

        // h5_mb_collections: 'http://newv.xxynet.com/',
        h5_mb_collections: 'http://it.xxynet.com/',

        // combine_url: 'http://newv.xxynet.com/unify-operate/api/',
        combine_url: 'http://it.xxynet.com/unify-operate/api/',

        appId: 'wxdd7de5895b020bc5',
        baseUrl: '/'
        // growup_url : "http://sub.chaojidaogou.cn/om-web/growup/",	// 成长路径请求地址
        //
        // om_si_url : "http://sub.chaojidaogou.com/om-web/",		// PK接口
        //
        // H5_url : 'http://client.chaojidaogou.com/thanos/api/'// 嵌入式请求地址
      };
      break
    case 'prod':
      _HTTPCnst = {
        shopguide_url: "https://bms.chaojidaogou.com/shopguide/api/",		// 超导请求地址
        om_si_url: DynamicDomain.Domain('url_pk') ? DynamicDomain.Domain('url_pk') + '/' : 'http://sub.chaojidaogou.com/om-web/',// PK接口

        growup_url: DynamicDomain.Domain('url_growup') ? DynamicDomain.Domain('url_growup') + '/growup/' : 'http://sub.chaojidaogou.com/om-web/growup/',// 成长路径请求地址

        H5_url: DynamicDomain.Domain('url_thanos') ? DynamicDomain.Domain('url_thanos') + '/api/' : 'https://client.chaojidaogou.com/thanos/api/',// 嵌入式请求地址

        h5_mb_collections: 'http://bms.chaojidaogou.com/',

        combine_url: 'http://sub.chaojidaogou.com/unify-operate/api/',

        share_url: 'bms.chaojidaogou.com',

        appId: 'wxbecb3df51c47c129',

        baseUrl: '/'
        // growup_url : "http://sub.chaojidaogou.cn/om-web/growup/",	// 成长路径请求地址
        //
        // om_si_url : "http://sub.chaojidaogou.com/om-web/",		// PK接口
        //
        // H5_url : 'http://client.chaojidaogou.com/thanos/api/'// 嵌入式请求地址
      };
      break

    default:_HTTPCnst={
        user_Url:"http://it.xxynet.com/shopguide/api/",
        shopguide_url : "http://newv.xxynet.com/shopguide/api/",		// 超导请求地址

        om_si_url : DynamicDomain.Domain('url_pk')?DynamicDomain.Domain('url_pk')+'/':'http://newv.xxynet.com/om-web/',// PK接口

        growup_url : DynamicDomain.Domain('url_growup')?DynamicDomain.Domain('url_growup')+'/growup/':'http://139.129.204.152:801/om-web/growup/',// 成长路径请求地址

        H5_url : DynamicDomain.Domain('url_thanos')?DynamicDomain.Domain('url_thanos')+'/api/':'http://pre.xxynet.com/thanos/api/',// 嵌入式请求地址

        h5_mb_collections:'http://49.234.132.146:8080/',

        combine_url: 'http://newv.xxynet.com/unify-operate/api/',

        share_url:'newv.xxynet.com',
        // shopguide_url : "http://172.16.0.200:8000/shopguide/api/",		// 超导请求地址
        // om_si_url : 'http://172.16.0.200:8080/om-si/',// PK接口

        // growup_url : 'http://172.16.0.200:18080/om-web/growup/',// 成长路径请求地址

        // h5_mb_collections:'http://172.16.0.200:9080/',

        // H5_url : 'http://172.16.0.233:7080/thanos/api/',// 嵌入式请求地址

        // combine_url: 'http://172.16.0.200:8181/unify-operate/api/',

        // share_url:'172.16.0.200:8000',
        appId:'',
        baseUrl:'/'
    };

  }

  return _HTTPCnst
}

export const HTTPCnst = GetHttp();
export {GetHttp}
