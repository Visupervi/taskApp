import React from 'react';
import {HTTPCnst} from "../../service/httpCnst.js"
import './UserInfo.css'
import appStore from "../../sys/AppStore"
import {getQueryString} from '../../utils/getToken';

class HeadPic extends React.Component {
  constructor(props) {
    super(props)
    this.getUserInfo(props.match.params.userId)
    this.state = {
      userInfo: {}
    };
  }

  async getUserInfo(id) {
    let postResult = await fetch(`${HTTPCnst.H5_url}user/position?accessToken=${getQueryString("accessToken")}`)
    let post = await postResult.json()
    let url = `${HTTPCnst.H5_url}user?accessToken=${getQueryString("accessToken")}&pageSize=10&userIds=${id}`
    let result = await fetch(url);
    let user = await result.json()
    if (user.length > 0) {
      user = user[0];
    } else {
      appStore.Snackbar.handleClick('未注册用户')
    }
    if (post.length > 0) {
      post.forEach((item) => {
        if (item.type === user.userPost) {
          user.postName = item.postName
        }
      })
    }
    this.setState({userInfo: user})
  }

  callNum(num) {
    window.location.href = 'tel://' + num;
  }

  render() {
    let userInfo = this.state.userInfo
    return (
      <div id="userInfo">
        <div className={'info'}>
          <div className={'head'}>
            <img src={userInfo.headPic || 'http://supershoper.xxynet.com/vsvz1553752667436'} alt=" "/>
          </div>
          <div className={'detail'}>
            <span className={'name'}>{userInfo.name} <i
              className={(userInfo.gender === '1' || userInfo.gender === 1) ? 'nan' : 'nv'}><em
              className={(userInfo.gender === '1' || userInfo.gender === 1) ? 'iconfont icon-nan' : 'iconfont icon-nv'}></em></i></span>
            <span className={'nickName'}>昵称: &nbsp;{userInfo.nickName || '无'}</span>
          </div>
        </div>
        <ul className={'list'}>
          <li onClick={this.callNum.bind(this, userInfo.tel)}>
            <span>电话</span>
            <b>{userInfo.tel || '暂无'}<em className={'iconfont icon-dianhua1'}></em></b>

          </li>
          <li>
            <span>店铺</span>
            <b>{userInfo.shopName || '暂无'}</b>
          </li>
          <li>
            <span>职位</span>
            <b>{userInfo.postName || '暂无'}</b>
          </li>
        </ul>
      </div>
    );
  }
}

export default HeadPic;
