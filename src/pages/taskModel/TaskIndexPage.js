import React, {Component} from 'react';
import {observer} from "mobx-react";
import TaskItem from './TaskItem';
import TaskStore from './TaskStore'
import "./Task.scss"
import appStore from '../../sys/AppStore';
import {hot} from 'react-hot-loader'
import Select from '../../component/select/select'
import ListView from '../../component/listview/listview';
import {CommonInterface} from "../../utils/CommonInterface";
import {getQueryString} from "../../utils/getToken";

@observer
class TaskIndexPage extends Component {
  constructor(props) {
    super(props)
    //清除掉记录
    sessionStorage.goBack = null
    this.store = new TaskStore(appStore);
    this.store.cache.set('isHistory', this.props)
    CommonInterface.setTitle(props.isShow ? "历史任务" : '任务');
    if (props.orderByData) {
      this.store.orderByData.isFinished = props.orderByData.isFinished;
      this.store.orderByData.isExpired = props.orderByData.isExpired;
    }
    if (!props.isShow) {
      this.store.loadTaskList();
      this.store.getStyleList()
    }
  }

  /*临时过滤陈列任务和巡店任务*/
  renderItem(task) {
    return (task.templateFlag !== '3' && task.templateFlag !== '12' && task.templateFlag !== '53') &&
      <TaskItem key={task.taskId} taskDetails={this.store.taskDetails.bind(this)} task={task}
                isHistory={this.props.isShow}/>
  }

  toHistory = async (e) => {
    await this.store.toHistory();
    this.props.history.push(`/taskTabs?accessToken=${getQueryString("accessToken")}`);
    e.preventDefault();
  }

  render() {
    let selectData1 = [{name: '综合排序', value: 1}, {name: '最新任务', value: 2}]
    let selectData2 = this.store.cache.get('selectStyle')
    return (
      <div id="TaskIndex">
        <div id="searchBar">
          <Select selectData1={selectData1} selectData2={selectData2} changeData1={this.store.sortTaskList}
                  changeData2={this.store.chooseType.bind(this)}/>
        </div>
        {
          this.props.isShow ? <div className='isFinish'>
            <div className='finished' onClick={() => this.store.handleChangeFinish(0)}><span
              className={this.store.isFinishValue === 0 ? 'red' : ''}>已完成</span></div>
            <div className='unfinished' onClick={() => this.store.handleChangeFinish(1)}><span
              className={this.store.isFinishValue === 1 ? 'red' : ''}>未完成</span></div>
          </div> : null
        }
        <div id="list">
          <ul>
            <ListView
              sysListId={'TaskIndexPages'}
              listViewStyle={{'height': this.props.isShow ? `${document.body.clientHeight - 132}px` : `${document.body.clientHeight - 88}px`}}
              enablePullRefreshEvent={true}           //是否开启下拉刷新
              enableOnEndReachedEvent={true}           //是否开启上滑加载  无更多数据设为false
              fetchMoreLoading={this.store.isLoading}   //是否显示加载loading
              onPullRefresh={() => this.store.loadTaskList()}   //下拉刷新回调 	重新请求更新store数据
              onEndReached={() => this.store.loadTaskList(1)}   //上滑加载回调  原数据concat(请求的page+1数据)
              renderItem={this.renderItem.bind(this)}     //children
              data={this.store.taskList || []}/>
          </ul>
        </div>
        {/* 浮动的历史任务按钮，现移到下拉列表内 */}
        {/* <div className={this.props.isShow?'none':'history'} onClick={this.toHistory}>
                    <i className={'iconfont icon-shijian'}></i>
                </div> */}
      </div>
    )
  }
}

export default observer(hot(module)(TaskIndexPage));

