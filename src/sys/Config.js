// const config_env=process.env.REACT_APP_CONFIG_ENV?process.env.REACT_APP_CONFIG_ENV:null;
// import * as dd from "dingtalk-jsapi";
import {Platform} from "./Platform";
import {HTTPCnst} from "../service/httpCnst"

const Config = {openPlatformType: 'ent_wechat'};

Config.init = (query, dd) => {
  if (Config.unionId) {
    return new Promise((res) => {
      res(Config);
    })
  } else if (Platform.name === 'dd') {
    Config.openPlatformType = 'dingtalk';
    let appId = query.get("appId");
    return new Promise((res, rej) => {
      let url = `${HTTPCnst.H5_url}dd/config?appId=${appId}`;
      return fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json) {
            Object.assign(Config, json);
            dd.ready(() => {
              dd.runtime.permission.requestAuthCode({
                corpId: Config.corpId,
                onSuccess: function (info) {
                  if (info) {
                    Object.assign(Config, info);
                    let url = `${HTTPCnst.H5_url}dd/user?appId=${appId}&code=${Config.code}`;
                    fetch(url)
                      .then(res => res.json())
                      .then(json => {
                        if (json) {
                          let userData = json;
                          Object.assign(Config, userData);
                          res(Config)
                        } else {
                          rej(new Error('获取钉钉免登录失败。'))
                        }
                      })
                  }
                },
                onFail: function (err) {
                  rej(new Error('钉钉' + err.errorMessage))
                }
              })
            })
          } else {
            rej(new Error('获取钉钉超导认证失败。'))
          }
        })
    })
  } else if (Platform.name === 'wx') {
    Config.openPlatformType = 'ent_wechat';
    let wxkey = query.get('key');
    return new Promise((res, rej) => {
      let url = `${HTTPCnst.H5_url}wx/config/user_info?key=${wxkey}`;
      return fetch(url)
        .then(res => res.json())
        .then(json => {
          if (json.errmsg === 'ok') {
            try {
              let user_info = json;
              let userId = `${json.corpid}_${json.userid}`;
              Object.assign(Config, user_info, {unionid: userId});
              res(Config)
            } catch (error) {
              rej(new Error('获取微信端用户信息失败'))
            }
          } else {
            rej(new Error('微信获取失败'))
          }
        }).catch(e => rej(new Error('获取微信端用户信息失败。')))
    })
  } else {
    return new Promise((res, rej) => {
      res('unknown');
    })
  }
};


export {Config};
