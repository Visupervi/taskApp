import React, {Component} from 'react'
import './message.css'

export default class Message extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  show(clickL, clickR, content, btnTitleR, btnTitleL, title = '') {
    this.setState({
      data: {
        title: title || '信息提示',
        content: content || '是否确认删除此条信息?',
        btnTitleR: btnTitleR || '取消',
        btnTitleL: btnTitleL || '确认',
        clickR: (e) => {
          e.preventDefault()
          clickR && clickR();
          this.noShow()
        },
        clickL: (e) => {
          e.preventDefault()
          clickL && clickL();
          this.noShow()
        }
      }
    })
  }

  noShow() {
    this.setState({
      data: {}
    })
  }

  render() {
    /*支持换行*/
    let data = JSON.stringify(this.state.data) !== '{}' ? this.state.data.content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ') : ''
    return (
      <div
        className={JSON.stringify(this.state.data) !== '{}' ? `${this.state.data.title !== 'none' ? 'messageInfosInfo' : 'messageInfosInfo noTitle'}` : 'none'}
        onClick={() => this.noShow()}>
        <div className={'displayFlex'}>
          <div className={'infoContent'} onClick={(e) => {
            e.stopPropagation();
          }}>
            {this.state.data.title !== 'none' && <span className={'title'}>{this.state.data.title}</span>}
            <p dangerouslySetInnerHTML={{__html: data}}></p>
            <div>
              <span onClick={(event) => this.state.data.clickL(event)}
                    className={this.state.data.btnTitleL === 'none' ? 'none' : ''}>{this.state.data.btnTitleL || ''}</span>
              <span onClick={(event) => this.state.data.clickR(event)}>{this.state.data.btnTitleR || ''}</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
