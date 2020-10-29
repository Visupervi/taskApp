import React, {Component} from 'react'
import './share.css'
// import * as wx from'weixin-js-sdk'

export default class Share extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false,
      title: '', // 分享标题
      desc: '', // 分享描述
      link: '', // 分享链接
      imgUrl: '', // 分享图标
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  openShare(link, title, desc, imgUrl) {
    this.setState({
      open: true,
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: imgUrl, // 分享图标
    })
  }

  clickOpen(e) {
    e.preventDefault();

  }

  clickClose() {
    this.setState({
      open: false,
    })
  }

  render() {
    return (
      <div className={this.state.open ? 'sharePage' : 'none'} onClick={this.clickClose.bind(this)}>
        <div className={'shareContent'}>
          <span onClick={this.clickOpen.bind(this)}>微信</span>
        </div>
      </div>
    )
  }
}
