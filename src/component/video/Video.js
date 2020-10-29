import React, {Component} from 'react'
import {Platform} from '../../sys/Platform'
import './video.css'

export default class Video extends Component {
  constructor(props) {
    super(props)
    this.state = {
      courseImg: props.courseImg,
      play: props.play || false,

      videoUrl: props.videoUrl,
      browsnum: props.browsnum || 0,
      times: props.times || null,
      paused: true,
      coverImg: true,
      stopFlag: sessionStorage.stopFlag || true,//非wifi是否暂停
      netType: ''//网络状态类型
    }
  }

  componentDidMount() {
    this.myVideo = this.refs.myVideo;
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.videoUrl !== nextProps.videoUrl) {
      if (!this.myVideo.paused) {
        this.myVideo.pause();
      }
      this.myVideo.src = nextProps.videoUrl;
      this.setState({
        courseImg: nextProps.courseImg,
        play: nextProps.play || false,
        videoUrl: nextProps.videoUrl
      });
    }
    this.setState({paused: this.myVideo.paused});
  };

  clickEvent(e) {
    // this.changeState()
    e.preventDefault();
    // if (typeof window.WeixinJSBridge === "undefined") {
    //   if (document.addEventListener) {
    //     document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
    //   } else if (document.attachEvent) {
    //     document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady);
    //     document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
    //   }
    // } else {
    //   this.onBridgeReady();
    // }
    this.onBridgeReady();
    // if (navigator.onLine) {//网络
    //     // 1、源生API 可以直接获取网络状态 但目前尚在开发中，只有谷歌浏览器支持
    //     var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    // }else{
    // }
  }

  onBridgeReady() {
    let that = this;
    // if (Platform.OS === 'ios' && (typeof window.WeixinJSBridge !== "undefined")) {
    // if (Platform.OS === 'ios') {
    //   window.WeixinJSBridge.invoke('getNetworkType', {},
    //     function (e) {
    //       // 在这里拿到e.err_msg，这里面就包含了所有的网络类型
    //       // alert('1',e.err_msg.split(':')[1]) //network_type:1、wifi wifi网络 2、edge 非wifi,包含3G/2G 3、fail 网络断开连接  4、wwan（2g或者3g）
    //       that.setState({
    //         netType: e.err_msg.split(':')[1],
    //         stopFlag: sessionStorage.stopFlag === undefined ? true : sessionStorage.stopFlag
    //       });
    //       if (that.state.netType === 'fail') {//网络断开
    //         return
    //       }
    //       if (that.state.netType === 'edge' && that.state.stopFlag === true) {// 非wifi,包含3G/2G
    //         return
    //       }
    //       that.changeState();
    //     }
    //   );
    // } else {
      that.changeState();
    // }
  };

  changeState() {
    let that = this;
    that.setState({coverImg: false});
    if (that.myVideo.paused) {
      that.myVideo.play();
      if (that.props.hasOwnProperty('playPause')) {
        that.props.playPause();
      }
      that.setState({play: true, paused: that.myVideo.paused});
    } else {
      that.myVideo.pause();
      that.setState({play: false, paused: that.myVideo.paused});
    }
  }

  stopEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState({netType: ''})
  }

  goingEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.stopFlag = false;
    this.setState({netType: '', stopFlag: false})
    this.onBridgeReady()
  }

  clickPause(e) {
    e.preventDefault();
    if (this.myVideo.paused) {
      this.myVideo.play()
    } else {
      this.myVideo.pause()
    }
    this.setState({paused: this.myVideo.paused});
  }

  render() {
    let singleImg = this.props.videoWidth || window.innerWidth
    let broadcast = {
      'width': singleImg + 'px',
      'height': singleImg * 9 / 16 + 'px'
    }
    let broadcastH = {
      'height': singleImg * 9 / 16 + 'px'
    }
    let playIcon = this.state.netType !== 'fail' && !(this.state.netType === 'edge' && this.state.stopFlag === true) && this.state.paused
    return (
      <div className='video' style={broadcastH}>
        <div onClick={(e) => this.clickEvent(e)} className={this.state.paused ? 'coverImg' : 'discover'}>
          <div style={broadcastH} className="contentdiv">
            <div style={{'display': this.state.netType === 'fail' ? 'block' : 'none'}} className="offline">
              <p>网络连接失败，请检查网络设置</p>
              <span>刷新重试</span>
            </div>
            <div style={{'display': (this.state.netType === 'edge' && this.state.stopFlag === true) ? 'block' : 'none'}}
                 className="offline">
              <p>当前为非wifi环境，已为您暂停播放</p>
              <span className="nobg" onClick={(e) => this.stopEvent(e)}>暂停播放</span><span
              onClick={(e) => this.goingEvent(e)}>继续播放</span>
            </div>
            <img src={this.state.courseImg} style={broadcastH} className={playIcon ? 'cover' : 'none'} alt={''}/>
            <img src="http://supershoper.xxynet.com/vsvz1535523360798" className={playIcon ? 'icon' : 'none'} alt={''}/>
          </div>
          <div className="likep" style={{'display': this.state.browsnum === 0 ? 'none' : 'block'}}><p>
            <span>{this.state.browsnum}次播放</span><span>{this.state.times}</span></p></div>
        </div>
        <video id='video' ref="myVideo" style={broadcast} onClick={(e) => this.clickPause(e)} webkit-playsinline="true"
               playsInline={true} x5-playsinline="true" controls='controls' className='video-vi'>
          <source src={this.state.videoUrl} type="video/mp4"/>
        </video>
      </div>
    )
  }
}
