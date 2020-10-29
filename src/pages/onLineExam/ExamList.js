import React from "react"
import {observer} from "mobx-react";
import ListView from '../../component/listview/listview';
import ExamListStore from "./ExamListStore"
import Common from '../../utils/GeneralMethod'
import "./ExamList.scss"

import {getQueryString} from "../../utils/getToken";

@observer
class ExamList extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ExamListStore();
    this.store.toExam = this.store.toExam.bind(this);
    this.dateFmt = new Common();
    this.state = {
      currentIndex: 0
    }
    this.store.searchvalue = props.data
  }

  componentWillMount() {
    let nextIndex = this.props.type;
    let currentIndex = this.state.currentIndex;
    if (parseInt(nextIndex, 10) !== parseInt(currentIndex, 10)) {
      this.setState({currentIndex: nextIndex});
      this.store.type = nextIndex;
      this.store.reloadExamListDate();
    }
    // let data=this.store.cache.get('ArticleData')
    // if(data){
    //     this.store.articleDatas=data
    // }else{
    //     this.store.cache.set('ArticlePage',1)
    //     this.store.initArticleData();
    // }
  }

  componentDidMount() {
    this.store.initExamListDate()
  }

  componentWillReceiveProps(props) {
    this.store.getSearchList(props.data)
  }

  //点击测试用(因为用的原生软键盘的搜索)  可删除此方法
  handleClick() {
    return false;
  }

  //输入搜索关键词
  handleChange = (event) => {
    this.store.searchvalue = event.target.value;
  }

  //提交搜索
  handleSubmit(event) {
    event.preventDefault();
  }

  toRank(e, type, item) {
    e.stopPropagation()
    if (type === '1') {
      this.props.history.push('/examrank/' + encodeURIComponent(JSON.stringify(item))+'?accessToken='+getQueryString("accessToken"));
    } else {
      this.props.history.push('/examexplain/' + encodeURI(encodeURIComponent(JSON.stringify(item)))+'?accessToken='+getQueryString("accessToken"));
    }
  }

  renderItem(item) {
    let onlineTab = sessionStorage.onlineTab;
    let nowTime = new Date();
    let isStartExam = nowTime.getTime() - item.createTime.time;
    let isEndExam = nowTime.getTime() - item.endTime.time;
    // 考试结束剩余时间
    let endDaysNum = Math.floor((item.endTime.time - nowTime.getTime()) / (1000 * 3600 * 24));
    let endHourNum = Math.floor(((item.endTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) / (1000 * 3600));
    let endMinuteNum = Math.floor((((item.endTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) % (1000 * 3600)) / (1000 * 60));
    let endSecondNum = Math.floor(((((item.endTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) % (1000 * 3600)) % (1000 * 60)) / (1000));
    // 考试开始剩余时间
    let startDaysNum = Math.floor((item.createTime.time - nowTime.getTime()) / (1000 * 3600 * 24));
    let startHourNum = Math.floor(((item.createTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) / (1000 * 3600));
    let startMinuteNum = Math.floor((((item.createTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) % (1000 * 3600)) / (1000 * 60));
    let startSecondNum = Math.floor(((((item.createTime.time - nowTime.getTime()) % (1000 * 3600 * 24)) % (1000 * 3600)) % (1000 * 60)) / (1000));
    let showTime = (isStartExam < 0 ? ((startDaysNum < 1 ? startHourNum + '时' + startMinuteNum + '分' + startSecondNum + '秒' : startDaysNum + '天' + startHourNum + '时' + startMinuteNum + '分')) : ((endDaysNum < 1 ? endHourNum + '时' + endMinuteNum + '分' + endSecondNum + '秒' : endDaysNum + '天' + endHourNum + '时' + endMinuteNum + '分')))
    let showName = isStartExam < 0 ? '考试开始：' : '考试结束：'
    if (endDaysNum >= 7) {
      showTime = (this.dateFmt.dateFormat(item.createTime, 'MM-dd') + ' - ' + this.dateFmt.dateFormat(item.endTime, 'MM-dd'));
      showName = '考试时间：'
    }
    return (
      <div className='examItem_all' key={item.examId}>
        {/*<hr className='examItem_hr' />*/}
        <div className="exam_item" onClick={() => {
          this.store.toExam(this, item)
        }}>
          <div className="exam_pic">
            <img src={(item.examLogo || 'http://supershoper.xxynet.com/vsvz1539226691342') + '?imageView2/1/w/100/h/75'}
                 alt=""/>
          </div>
          <div className="exam_descript">
            <p className={'title'}>{item.examTitle}</p>
            <div>
              <span className="des">{this.store.examType(item.examSpecies)}</span>
              {/* <p><span>{item.num}</span>人参与考试</p> */}
              {/* { onlineTab==='1' ? <div onClick={(e)=>{this.toRank(e,onlineTab,item)}}>排行</div> : null } */}
              {/*<OperButton thiz={this} examId={item.examId} item={item} />*/}
            </div>
            <div className='exam_foot'>
              <p className={endDaysNum === 0 && onlineTab !== '1' ? 'cutoff_date cutoff_color' : 'cutoff_date'}>
                {onlineTab === '0' && <span className="normal">{showName}</span>}
                {onlineTab === '1' ? (isEndExam > 0 ? '考试已结束' : ('考试结束:' + (endDaysNum < 1 ? endHourNum + '时' + endMinuteNum + '分' + endSecondNum + '秒' : endDaysNum + '天' + endHourNum + '时' + endMinuteNum + '分'))) : showTime}
              </p>
              {onlineTab === '1' ? <div onClick={(e) => {
                this.toRank(e, onlineTab, item)
              }}>排行</div> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  otherItem() {
    return (
      <div className="exam_search">
        {this.store.noneFlag ? <div className="none-style">
            <img src="http://supershoper.xxynet.com/vsvz1559701211464" alt="noContent"/>
          </div>
          : ""}
      </div>
    )
  }

  render() {
    return (
      <ul className="exam-ul">
        <ListView
          sysListId={'examUl'}
          listViewStyle={{'height': document.body.clientHeight - 50 + 'px',}}
          enablePullRefreshEvent={this.props.scroll ? false : true}           //是否开启下拉刷新
          enableOnEndReachedEvent={this.props.scroll ? false : true}           //是否开启上滑加载  无更多数据设为false
          fetchMoreLoading={this.store.isLoading}   //是否显示加载loading
          onPullRefresh={() => this.store.reloadExamListDate()}   //下拉刷新回调 	重新请求更新store数据
          onEndReached={() => this.store.pullExamListDate()}   //上滑加载回调  原数据concat(请求的page+1数据)
          renderItem={this.renderItem.bind(this)}     //children
          otherItem={this.otherItem.bind(this)}
          data={this.store.dataObject}
        />
      </ul>

    )
  }

}

export default ExamList;
/*
const OperButton = (props)=>{
	if(props.thiz.state.currentIndex==0){
		return(
			<Link to={{pathname:'/examexplain',query:props.item}} >

			</Link>
		)
	}else{
		return(
			<Link to={{pathname:'/examrank',query:props.item}} >
				<div>排行</div>
			</Link>
		)
	}
}*/
