import React, {Component} from 'react';
import './LalaLoading.css'

export default class LalaLoading extends Component {
  constructor() {
    super()
    this.state = {
      loading: false
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  show(time = 10000) {
    let self = this
    self.setState({loading: true})
    /*若不执行时间，10秒自动关闭*/
    setTimeout(() => {
      self.setState({loading: false})
    }, time)
  }

  hidden() {
    this.setState({loading: false})
  }

  render() {
    return (
      <div className={this.state.loading ? 'lalaLoading' : 'none'}>
        <img src="http://supershoper.xxynet.com/vsvz1539855699953" alt={'拉拉跑'}/>
      </div>
    )
  }
}


