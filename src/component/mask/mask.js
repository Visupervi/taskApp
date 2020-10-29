import React, {Component} from 'react';
import './mask.css'

export default class Mask extends Component {
  constructor() {
    super()
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    let self = this
    window.addEventListener("popstate", function (e) {  //回调函数中实现需要的功能
      if (self.state.loading === true) {
        self.hidden()
      }
    }, false);
  }

  // componentWillUnmount(){
  //     document.body.removeEventListener('touchmove',this.stopTouch , {passive: false})
  //     console.log(`%c--11-- `, 'color:blue;', '移除监听')
  // }
  show() {
    let self = this
    self.setState({loading: true})
    document.body.addEventListener('touchmove', this.stopTouch, {passive: false})
  }

  stopTouch(e) {
    // alert(th
    e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
    console.log(`%c--11-- `, 'color:blue;', 'stop')
  }

  hidden() {
    this.setState({loading: false})
    document.body.removeEventListener('touchmove', this.stopTouch, {passive: false})
  }

  render() {
    return (
      <div className={this.state.loading ? 'masking' : 'none'}>
      </div>
    )
  }
}


