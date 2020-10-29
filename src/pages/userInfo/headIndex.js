import React from 'react';
import './headIndex.css'
import appStore from "../../sys/AppStore"
import {getQueryString} from '../../utils/getToken';

class HeadPic extends React.Component {

  componentDidMount() {
    /*this.props.onRef(this)*/

  }

  click(event) {
    event.preventDefault();
    event.stopPropagation()
    if (!this.props.userId) {
      appStore.Snackbar.handleClick('未知用户')
      return
    }
    if (this.props.isOtherClick) { // 是否执行组件自身click
      return
    }
    this.props.history.push("/UserInfo/" + this.props.userId + '?accessToken=' + getQueryString("accessToken"))

  }

  render() {
    return (
      <p id="headDiv" style={this.props.headDivStyle || null} onClick={this.click.bind(this)}>
        <img className="headPic" style={this.props.headPic || null}
             src={this.props.src || 'http://supershoper.xxynet.com/vsvz1553752667436'} alt="头像"/>
      </p>
    );
  }
}

export default HeadPic;
