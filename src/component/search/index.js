import React from 'react';
import './index.css'
import search_icon from "../../img/askanswer_search.png";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      cancelBtn: false
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  //点击测试用(因为用的原生软键盘的搜索)  可删除此方法
  handleClick() {
    return false;
    // this.props.currentHistory.push({ pathname : `/searchQuestionResultList/${this.state.value}`});
  }

  //输入搜索关键词
  handleChange(event) {
    this.setState({
      value: event.target.value,
      cancelBtn: true
    });
    if (event.target.value.length === 0) {
      this.setState({
        cancelBtn: false
      });
    }
  }

  //提交搜索
  handleSubmit(event) {
    event.preventDefault();
    this.props.searchData && this.props.searchData(this.state.value);
    this.refs.inputText.blur()
  }

  // 清除内容
  clear() {
    this.setState({
      value: '',
      cancelBtn: false
    });
  }

  /**
   * 使用IOS原生软键盘搜索键（<input type="search">,同时在外面包裹一层<form action=''>)
   * @returns {*}
   */
  render() {
    return (
      <div className='searchItem'>
        <form action='' onSubmit={this.handleSubmit} onClick={this.handleClick}>
          <label>
            <img src={search_icon} alt=""/>
            <input type="search" value={this.state.value} onChange={this.handleChange} ref='inputText'
                   placeholder={this.props.searchPlaceholder || "请输入姓名、店铺名称关键字"}/>
            {this.state.cancelBtn ? <i className="iconfont icon-chahao" onClick={() => {
              this.clear()
            }}></i> : ''}
          </label>
        </form>
      </div>
    );
  }
}

