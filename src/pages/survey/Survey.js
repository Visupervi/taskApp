import React, {Component} from 'react';
import {observer} from "mobx-react";
import {CommonInterface} from "../../utils/CommonInterface";
import {hot} from 'react-hot-loader'
import {getQueryString} from '../../utils/getToken';

@observer
class Survey extends Component {
  constructor(props) {
    super(props);
    CommonInterface.setTitle("详情");
    let temp = props.match.params.taskId.split('&&')
    this.taskId = temp[0];
    this.height = document.querySelector('body').offsetHeight;
    var search = props.location.search;
    var urlStr = search.split("pageUrl=")[1];
    // console.log(search)
    // console.log(urlStr)
    // console.log(urlStr.replace('$access_token',getQueryString('accessToken')))  ${temp[1] === '1' ? '&unfinished=1' : ''}
    this.content = `${urlStr.replace('$access_token', getQueryString('accessToken'))}`;
    //console.log(this.content)
  }

  render() {
    return (
      <div>
        <iframe title={'任务'} width="100%" height={this.height}
                style={{'scrolling ': 'no', 'border': '0', 'overflowY': 'hidden'}} src={this.content}></iframe>
      </div>
    )
  }
}

export default observer(hot(module)(Survey));

