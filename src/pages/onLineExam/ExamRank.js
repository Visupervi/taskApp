import React from "react"
import {CommonInterface} from "../../utils/CommonInterface";
import {observer} from "mobx-react";
import ListView from '../../component/listview/listview';
import ExamListStore from "./ExamListStore"
import Common from '../../utils/GeneralMethod'
import "./examrank.scss"

import {getQueryString} from "../../utils/getToken";

@observer
class ExamRank extends React.Component {
  constructor(props) {
    super(props)
    CommonInterface.setTitle("考试排行榜");
    let data = JSON.parse(decodeURIComponent(props.match.params.examData));
    let {examId, examSpecies} = data;
    this.store = new ExamListStore();
    this.dateFmt = new Common()
    this.store.examId = examId;
    this.store.examtype = examSpecies;
  }

  componentWillMount() {
  }

  // componentWillReceiveProps(nextProps){
  // }
  componentDidMount() {
    this.store.initExamRankList()
  }

  renderItem(item, index) {
    let {userMsg, examtype} = this.store;
    return (
      <div className={userMsg.sysUserId === item.sysUserId ? 'exam_rank_item exam_rank_color' : "exam_rank_item"}
           key={index + item.sid}>
        <span className="nums">{examtype === 1 ? (item.rank < 10 ? '0' + item.rank : item.rank) : index + 4}</span>
        <div className="exam_rank_descript">
          <img src={item.headPic || 'http://supershoper.xxynet.com/vsvz1553752667436'} alt=""/>
          <div>
            <p><span>{item.name || (sessionStorage.userInfo && (JSON.parse(sessionStorage.userInfo).name))}<i
              className={parseInt(item.gender, 10) === 0 ? "iconfont icon-nv" : "iconfont icon-nan"}></i></span></p>
            <p>{this.dateFmt.dateFormat(item.sTime, 'MM-dd hh:mm')}</p>
          </div>
          <span className='exam_score'>{item.score}</span>
        </div>
      </div>
    )
  }

  otherItem() {
    let {examtype, oneObj, twoObj, threeObj, noneRankFlag, userMsg} = this.store;
    if (oneObj.sTime) {
      oneObj.name = oneObj.name || (sessionStorage.userInfo && (JSON.parse(sessionStorage.userInfo).name))
    }
    if (twoObj.sTime) {
      twoObj.name = twoObj.name || (sessionStorage.userInfo && (JSON.parse(sessionStorage.userInfo).name))
    }
    if (threeObj.sTime) {
      threeObj.name = threeObj.name || (sessionStorage.userInfo && (JSON.parse(sessionStorage.userInfo).name))
    }
    let oneTime = this.dateFmt.dateFormat(oneObj.sTime, 'MM-dd hh:mm');
    let twoTime = this.dateFmt.dateFormat(twoObj.sTime, 'MM-dd hh:mm');
    let threeTime = this.dateFmt.dateFormat(threeObj.sTime, 'MM-dd hh:mm');
    if (noneRankFlag === true) {
      return (
        <div className="none-style">暂无排行数据</div>
      )
    } else {
      return (
        <div className="rank-top" style={{'marginBottom': parseInt(examtype, 10) === 1 ? 80 + 'px' : 10 + 'px'}}>
          <div className="top-bg">
            <div className="top-img">
              <div className="numbg num2">
                <img src={(twoTime && twoObj.headPic) || 'http://supershoper.xxynet.com/vsvz1553752667436'}
                     className="photo" alt=""/>
              </div>
              <div className="numbg colorbg">
                <div>
                  <div>
                    <img src={(oneTime && oneObj.headPic) || 'http://supershoper.xxynet.com/vsvz1553752667436'}
                         className="photo" alt=""/>
                    <img className="bg"
                         src={'https://supershoper.xxynet.com/tmp/wxf0e5b1f6c8ed32bb.o6zAJsy6f5iGvKfJue-sSWm_KoOg.nApz3ydU6gmo44fd18aabcafd6ccbf0c5eb4956e08cc.png'}
                         alt=""/>
                  </div>
                </div>
              </div>
              <div className="numbg num3">
                <img src={(threeTime && threeObj.headPic) || 'http://supershoper.xxynet.com/vsvz1553752667436'}
                     className="photo" alt=""/>
              </div>
            </div>
            <div className="top-text">
              <div>
                <span>{twoObj.name || '无'}</span>
                <p>{twoTime && twoTime.slice(0, 5)}/{twoTime && (twoObj.score + '分')}</p>
              </div>
              <div>
                <span>{oneObj.name || '无'}</span>
                <p>{oneTime && oneTime.slice(0, 5)}/{oneTime && (oneObj.score + '分')}</p>
              </div>
              <div>
                <span>{threeObj.name || '无'}</span>
                <p>{threeTime && threeTime.slice(0, 5)}/{threeTime && (threeObj.score + '分')}</p>
              </div>

            </div>
          </div>
          {parseInt(examtype, 10) === 1 && <SelfItem self={userMsg} dateFmt={this.dateFmt}/>}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="ranks">
        <ul className="exam-ul">
          <ListView
            sysListId={'ExamRankList'}
            // listViewStyle={{'height':window.innerHeight-70+'px',}}
            enablePullRefreshEvent={this.props.scroll ? false : true}           //是否开启下拉刷新
            enableOnEndReachedEvent={this.props.scroll ? false : true}           //是否开启上滑加载  无更多数据设为false
            fetchMoreLoading={this.store.isLoading}   //是否显示加载loading
            onPullRefresh={() => this.store.reloadExamListDate()}   //下拉刷新回调 	重新请求更新store数据
            onEndReached={() => this.store.pullExamListDate()}   //上滑加载回调  原数据concat(请求的page+1数据)
            renderItem={this.renderItem.bind(this)}     //children
            otherItem={this.otherItem.bind(this)}
            data={this.store.rankList}
          />

        </ul>
      </div>
    )
  }
}

const SelfItem = (props) => {
  let item = props.self;
  return (
    <div className="selfitem">
      <div className="exam_rank_item">
        <span className="nums">{item.rank < 10 ? '0' + item.rank : item.rank}</span>
        <div className="exam_rank_descript">
          <img src={item.headPic || 'http://supershoper.xxynet.com/vsvz1553752667436'} alt=""/>
          <div>
            <p><span> 我 {/*{item.name}*/}<i
              className={parseInt(item.gender, 10) === 0 ? "iconfont icon-nv" : "iconfont icon-nan"}></i></span></p>
            <p>{props.dateFmt.dateFormat(item.sTime, 'MM-dd hh:mm')}</p>
          </div>
          <span className='exam_score'>{item.score}</span>
        </div>
      </div>
    </div>
  )
}
export default ExamRank;
