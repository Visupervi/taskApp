import React from 'react';
import './inputSubmit.css'
import appStore from "../../sys/AppStore"

export default class InputSubmit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      value: ''
    }
  }

  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this)
    }
  }

  //提交搜索
  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.value) {
      return
    }
    this.props.submit && this.props.submit(this.state.value);
    appStore.Mask.hidden()
    this.setState({value: '', isShow: false})
  }

  switchover(n) {
    let self = this
    if (n === 1) {
      appStore.Mask.show()
      this.setState({isShow: true})
    }
    if (n === 2 && !this.state.value) {
      setTimeout(function () {
        appStore.Mask.hidden()
        self.setState({isShow: false})
      }, 300)
    }
  }

  getText = (event) => {
    this.setState({value: event.target.value})
  }

  render() {
    return (
      <div id='inputSubmit'>
        {/*<input type='text' placeholder={this.props.placeholder || "说点什么吧…"} onClick={()=>this.switchover(1)} />*/}
        <label style={this.props.innerStyle} className={this.state.isShow ? 'none' : 'similarInput'} htmlFor="inputText"
               onClick={() => this.switchover(1)}>{this.props.placeholder || "说点什么吧…"}</label>
        {
          this.state.isShow && <div className={'floatDiv'}>
            <input id='inputText' placeholder={this.props.placeholder || "说点什么吧…"} autoFocus={'autoFocus'}
                   value={this.state.value} onChange={(event) => this.getText(event)}
                   onBlur={() => this.switchover(2)}/>
            <i className={this.state.value ? 'sendbtn red' : 'sendbtn'}
               onClick={(event) => this.handleSubmit(event)}>发送</i>
          </div>
        }
      </div>
    );
  }
}

