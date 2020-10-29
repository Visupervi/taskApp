import React, {Component} from 'react'
import './backhome.css'

export default class BackHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      self: ''
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  show = (self) => {
    this.setState({show: true, self: self})
  }
  hide = (self) => {
    this.setState({
      show: false
    })
  }
  backHome = () => {
    this.setState({
      show: false
    })
    sessionStorage.removeItem('messageroute');
    this.state.self.props.history.replace(`/home`)
    // let local = window.location.href.split(sessionStorage.messageroute)[0];
    // sessionStorage.removeItem('messageroute');
    // console.log(window.location.hash)
    // window.location.replace(local+'home')
  }

  render() {
    return (
      <div className={this.state.show ? 'backhome' : 'none'} onClick={() => {
        this.backHome()
      }}>
        <i className="iconfont icon-zhuye"></i>
      </div>
    )
  }
}
