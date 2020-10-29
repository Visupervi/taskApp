import React, {Component} from 'react'
import './listStatus.css'
import net_error from '../../img/net_error.png'

export default class ListStatus extends Component {
  constructor(props) {
    super(props)
    this.state = {
      waitTime: 1000
    }
  }

  componentDidMount() {
    setTimeout(() => this.setState({waitTime: 0}), this.state.waitTime)
  }

  render() {
    if (this.state.waitTime) {
      return (
        <div className="nodata">
          {'加载中.....'}
        </div>
      )
    } else {
      return (
        <div className="nodata">
          {this.props.status === 'empty' && <div className={'statusDiv'}>
            <img src="http://supershoper.xxynet.com/vsvz1558669514901" alt=""/>
            <p>{this.props.tips}</p>
          </div>}
          {this.props.status === 'offline' && <div className={'statusDiv'}>
            <img src={net_error} alt=""/>
            <p>{this.props.tips}</p>
          </div>}
          {this.props.status === 'error' && <div className={'statusDiv'}>
            <img src="http://supershoper.xxynet.com/vsvz1558678333951" alt=""/>
            <p>{this.props.tips}</p>
          </div>}
          {this.props.status === 'courseEmpty' && <div className={'statusDiv'}>
            <img src="http://supershoper.xxynet.com/vsvz1560998912937" alt=""/>
            <p>{this.props.tips}</p>
          </div>}
          {this.props.status === 'discussEmpty' && <div className={'statusDiv statusDiscuss'}>
            <img src="http://supershoper.xxynet.com/vsvz1565869559736" alt=""/>
            <p>{this.props.tips}</p>
          </div>}
        </div>
      )
    }

  }
}
