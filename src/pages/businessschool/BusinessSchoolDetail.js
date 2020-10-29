import React, {Component} from 'react';
import {observer} from "mobx-react";
import '../businessschool/BusinessSchoolDetail.css'
import Video from '../../component/video/Video'
import SchoolStore from './SchoolStore'
import {HeadPic} from '../../sys/AppStore';
import MessageInfo from "../../component/messageInfo/messageInfo"
import {HTTPCnst} from "../../service/httpCnst.js"
import PraiseBlock from "./praiseblock/PraiseBlock";
import InputSubmit from '../../component/inputSumbit/inputSubmit'
import ListView from "../../component/listview/listview";
import {Link} from "react-router-dom";
import ListStatus from "../../component/listStatus/listStatus";
import {getQueryString} from '../../utils/getToken';
import Header from "../../component/header/header";
import {toJS} from "mobx";

@observer
class BusinnessSchoolDetail extends Component {
  constructor(props) {
    super(props);
    this.store = new SchoolStore();
    console.log(this.store)
    const obj = this.store.choosedData;
    for (let key in toJS(this.store)) {
      console.log("key",key,toJS(this.store)[key])
    }
    console.log("this.store")
    // this.GrowthPathStore=new GrowthPathStore(); //引入Store
    /*只有从任务处和课程过来，才有清除指令*/
    let self = this
    if (props.location.query === 'clear') {
      this.store.cache.set('isPlay', false)
      this.store.cache.set('isSumbit', false)
      sessionStorage.taskN = null
    }
    sessionStorage.bookInfo = props.match.params.bookId;  //暂存书本信息
    let accept = decodeURIComponent(props.match.params.bookId).split('&&');
    if (accept[1] && accept[1] === 'single') {
      /*传过来的是courseId,跳转*/
      sessionStorage.courseId = accept[0]
      this.store.cache.set('courseId', accept[0])
      this.store.cache.set('lessonId', accept[0])
      this.store.cache.set('isTask', false)
      this.store.cache.set('type', 'single')
    } else if (accept[1] && accept[1] === 'task') {
      /*传过来的是courseId，课程提交*/
      sessionStorage.courseId = accept[0]
      this.store.cache.set('courseId', accept[0])
      this.store.courseId = accept[0]
      this.store.cache.set('lessonId', accept[0])
      this.store.cache.set('taskId', accept[2])
      this.store.cache.set('isTask', true)
      this.store.cache.set('isHistory', accept[3])
      this.store.cache.set('type', 'task')
      // if (accept[3] !== '1') {
      //   window.addEventListener("popstate", self.addBack.bind(this), false);
      //   if (sessionStorage.goBack !== '1') {
      //     this.pushHistory();
      //     sessionStorage.goBack = 1
      //   }
      // }
    } else if (accept[1] && accept[1] === 'pathGrow') {
      /*模仿任务提交模式，只是将任务id换成课程id。提交按钮隐藏，初始化时检测是否通过，提交*/
      sessionStorage.courseId = accept[0]
      this.store.cache.set('courseId', accept[0])
      this.store.cache.set('lessonId', accept[0])
      this.store.cache.set('isTask', true)  //假装我是个任务
      this.store.cache.set('isHistory', 2)  //假装我不是历史任务
      this.store.cache.set('type', 'pathGrow')
    } else {
      this.store.cache.set('isTask', false)
      this.store.cache.set('courseId', accept[0])
      this.store.courseId = accept[0]
    }
    /*如果存在courseId时,自动获取详情*/
    let courseId = this.store.cache.get('courseId') || sessionStorage.courseId
    if (courseId) {
      let temp = {};
      temp.lesson_id = this.store.cache.get('lessonId') || sessionStorage.lessonId
      temp.course_id = courseId;
      temp.checkpoints = '1';
      this.store.toDetail(courseId);
    } else {
      this.store.choosedData = null
    }
    /*判断是否存在闯关,以及提交1：link存在闯关2:不存在3:不是任务中，且存在闯关*/
    let taskN = sessionStorage.taskN
    if (taskN === '1') {
      /*this.store.isPlay=true*/
      this.store.cache.set('isPlay', true)
    } else if (taskN === '2') {
      this.store.cache.set('isSumbit', true)
      this.store.updateCourseLearningStatus()
    } else if (taskN === '3') {
      /* this.store.isPlay=true*/
      this.store.cache.set('isPlay', true)
    }
    if (this.store.cache.get('type') === 'pathGrow') {
      if (this.store.cache.get('isSumbit') === (true || 0)) {  //可以提交显示，代表我们通过了测试
        //this.GrowthPathStore.saveRecord(accept[0]);
        // if(this.store.cache.get('isSumbit')===0){ //0是不通过，1是通过
        //     this.GrowthPathStore.commit(accept[0],0)
        // }else{
        //     this.GrowthPathStore.commit(accept[0],1)
        // }
      }
    }
  }

  addBack() {  //回调函数中实现需要的功能
    if (sessionStorage.toALink === '1') {
      sessionStorage.toALink = null;
      return
    }
    this.store.newsData = {
      content: '任务尚未提交完成，确定要离开吗?',
      btnTitle1: '继续任务',
      btnTitle2: '确认离开',
      clickR: () => {
        this.store.newsData = {};
        window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
			  this.props.history.go(-1);
        // this.props.history.go(-1)
      },
      clickL: () => {
        this.store.newsData = {};
        this.pushHistory()

      }
      // no:'cancel',
      // yes:'endExam'
    }
    /*e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现*/
  }


  pushHistory() {
    let baseUrl = HTTPCnst.baseUrl;
    baseUrl = baseUrl.substr(0, baseUrl.length - 1)
    let state = {
      title: "title",
      url: baseUrl + this.props.match.url
    };
    window.history.pushState(state, state.title, state.url);
  }

  // componentDidMount(){
  //     let isVideo=document.getElementById('video');
  //     if(isVideo && isVideo.paused){
  //         console.log(isVideo.paused);
  //     }
  // }
  /*存在退出该页面时，提交log已经点击切换时,提交log,两种可能*/

  componentWillUnmount() {
    this.store.addLearningLog();
  }

  toDetail = async (course, status) => {
    let isVideo = document.getElementById('video');
    if (isVideo && isVideo.paused) {
      await isVideo.pause();
    }
    await this.store.toDetail(course, status);
  }
  postShape = () => {
    //debugger
    this.store.postShape(this.store);
  };
  postPraise = (id) => {
    this.store.postPraise(id);
  };
  postComment = (content) => {
    this.store.postComment(content);
  };
  getText = (event) => {
    this.store.getText(event);
  }
  goExamList = (id) => {
    this.props.history.push({pathname: `/examNormalList/${id}`});
  }
  commentLIst = (courseId, commentId, n) => {
    this.store.commentLIst(courseId, commentId, n)
  }
  sumbitTask = () => {
    this.store.sumbitTask(this)
  }
  collect = () => {
    // if(this.store.lastReqTime&&Date.now()-this.store.lastReqTime < 1000*2){
    //     appStore.Snackbar.handleClick("操作太过频繁");
    //     return
    // }
    // this.store.lastReqTime=Date.now()
    if (parseInt(this.store.choosedData.isFavouroite) === 1) {
      this.store.choosedData.isFavouroite = 0;
      this.store.delFavouroite()
    } else {
      this.store.choosedData.isFavouroite = 1;
      this.store.collect()
    }

  }

  toALink(url) {
    // debugger
    /*this.cache.set('isPlay',true)*/
    /*判断是否存在闯关,以及提交1：link存在闯关2:不存在3:不是任务中，且存在闯关*/
    if (this.store.cache.get('isTask')) {
      sessionStorage.toALink = 1;
      if (this.store.choosedData.checkpoints === '1') {
        /*this.store.isPlay=true*/
        this.store.cache.set('isPlay', true)
        sessionStorage.taskN = '1'
      } else {
        this.store.cache.set('isSumbit', true)
        sessionStorage.taskN = '2'
      }
    } else {
      if (this.store.choosedData.checkpoints === '1') {
        /*this.store.isPlay=true*/
        this.store.cache.set('isPlay', true)
        sessionStorage.taskN = '3'
      } else {
        sessionStorage.taskN = '2'
      }
    }
    window.location.href = url
  }

  player = () => {
    // debugger
    if (!this.store.choosedData) {
      return (
        <div className='cover'>
          <img className={this.store.loading ? 'loading' : 'show'} style={{'maxWidth': '100%'}}
               src={this.store.loading ? 'http://supershoper.xxynet.com/FsHFw3Zbdd9lKU7tb5nuPEQkoaYN' : this.store.coverImg}
               alt="封面"/>
        </div>
      );
    } else if (this.store.choosedData && this.store.choosedData.contentType === '2') {
      return (
        <div className='cover'>
          <div className={'alink'} onClick={() => this.toALink(this.store.choosedData.materialUrl)}>
            <img className={'show'} style={{width: '100%'}}
                 src={this.store.choosedData.courseImg || 'http://supershoper.xxynet.com/vsvz1532402774541?imageView2/1/w/120/h/90'}
                 alt={' '}/>
            <img className={this.store.choosedData.materialUrl ? "link-icon" : "none"}
                 src={'http://supershoper.xxynet.com/vsvz1536583376192'} alt="外链"/>
          </div>
        </div>
      );
    } else if (this.store.choosedData && this.store.choosedData.contentType === '1') {
      return (
        <div className='cover'>
          <div className={'alink'} onClick={() => this.toALink(this.store.choosedData.materialUrl)}>
            <img className={'show'} style={{width: '100%'}} src={this.store.choosedData.courseImg} alt={' '}/>
            <img className={this.store.choosedData.materialUrl ? "link-icon" : "none"}
                 src={'http://supershoper.xxynet.com/vsvz1536583376192'} alt="link-icon"/>
          </div>
        </div>
      );
    } else {
      let videoUrl = `http://video.xxynet.com/${this.store.choosedData.video}`
      let courseImg = this.store.choosedData.courseImg
      return (
        <Video videoUrl={videoUrl} courseImg={courseImg} playPause={this.store.playPause.bind(this)}/>
      )
    }
  }

  othrtItem() {
    return (
      <div className={'other'}>
        {this.player()}
        <CourseDetail data={this.store.choosedData} courseId={this.store.cache.get('courseId')}
                      toTest={this.store.toTest.bind(this)} isPlay={this.store.cache.get('isPlay')}/>
        <PraiseBlock content={this.store.choosedData} praiseType={this.store.courseId}/>
        {this.store.choosedData && this.store.choosedData.commentList !== 0 &&
        <p className="comstitle">{this.store.choosedData && this.store.choosedData.commentnums}人评论</p>}
        {(this.store.choosedData && this.store.choosedData.commentList && this.store.choosedData.commentList.length < 1) &&
        <ListStatus status="discussEmpty" tips="还没人回复，赶紧抢沙发~"/>}
      </div>
    )
  }

  renderItem(item, index) {
    let courseId = this.store.cache.get('courseId')
    return (
      <Link className='myComlist'
            to={"/oldCommentdetail/" + item.commentId + '&&' + courseId + '&&' + item.commentScore + '&&' + item.likeNum + '&&' + item.comNum + '?accessToken=' + getQueryString("accessToken")}
            key={index}>
        <li className="rightcom">
          {/*<img className="art-img"  src={item.headPic||"http://supershoper.xxynet.com/vsvz1536118304165"} alt=""/>*/}
          <HeadPic src={item.headPic} history={this.props.history} userId={item.commentUser}
                   headDivStyle={{height: '40px', width: '40px', marginRight: '10px'}}/>
          <div className="comdetail">
            <p className="names">
              <span>{item.name}</span>
              <span>
                                <i
                                  className={item.isCheckLike === 0 ? "iconfont icon-dianzan" : "iconfont icon-dianzan3 red"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    this.postPraise(item.commentId)
                                  }}></i>
                {item.likeNum || '赞'}<i className="iconfont icon-pinglun"></i>{item.comNum || '评论'}
                            </span>
            </p>
            <p className="comtime">{item.commentTime}</p>
            <p className="comcontent">{item.commentContent}</p>
          </div>
        </li>
      </Link>
    )
  }

  render() {
    let commentLists = this.store.choosedData && this.store.choosedData.commentList
    return (
      <div className='detail'>
        {
          this.store.choosedData ?
          <Header headerTilte={ this.store.choosedData.courseName}/> : ""

        }
        <MessageInfo data={this.store.newsData} btn={this.confirm} self={this}/>
        <ListView
          sysListId={'BusinnessSchoolDetail' + this.store.cache.get('courseId')}
          listViewStyle={{'height': document.body.clientHeight - 50 + 'px'}}
          enablePullRefreshEvent={true}           //是否开启下拉刷新
          enableOnEndReachedEvent={true}           //是否开启上滑加载  无更多数据设为false
          fetchMoreLoading={false}   //是否显示加载loading
          onPullRefresh={() => this.commentLIst(this.store.cache.get('courseId'))}   //下拉刷新回调 	重新请求更新store数据
          onEndReached={() => this.commentLIst(this.store.cache.get('courseId'), null, 1)}   //上滑加载回调  原数据concat(请求的page+1数据)
          otherItem={this.othrtItem.bind(this)}
          renderItem={this.renderItem.bind(this)}     //children
          data={commentLists || []}/>
        <HandleBar
          // shareState={this.store.choosedData && this.store.choosedData.shareState}
          shareState={this.store.articledata && this.store.articledata.shareFlag===1}
          setShape={this.postShape}
          praiseState={this.store.choosedData && this.store.choosedData.isLike}
          isFavouroite={this.store.choosedData && this.store.choosedData.isFavouroite}
          getText={this.getText}
          comment={this.store.commentText}
          setPraise={this.postPraise}
          setComment={this.postComment}
          collect={this.collect}
          isTask={this.store.cache.get('isTask')}
          focus={this.focus}
          sumbitTask={this.sumbitTask}
          inputRef={el => this.surname = el}
          isSumbit={this.store.cache.get('isSumbit')}
          isHistory={this.store.cache.get('isHistory')}
          type={this.store.cache.get('type')}
        />
      </div>
    );
  }
}

// 底部操作 点赞、评论、转发
const HandleBar = (props) => (
  <div className={(props.isTask && props.type === 'task') ? "editcomTask taskButton" : "editcom"}>
    <InputSubmit submit={props.setComment}/>
    {/*<input placeholder="说点什么吧…" value={props.comment}  onChange={props.getText} onFocus={props.focus} ref={props.inputRef} />*/}
    {/*<i className="sendbtn" onClick={() => {props.setComment(props.comment)}}>发送</i>*/}
    <i className={props.praiseState === 1 ? "iconred iconfont icon-dianzan3" : "iconfont icon-dianzan"} onClick={() => {
      props.setPraise()
    }}></i>
    <i className={props.isFavouroite === '1' ? "iconfont icon-shoucang1 iconyellow" : "iconfont icon-shoucang"}
       onClick={() => {
         props.collect()
       }}></i>
   {props.shareState &&
      <i className={props.shareState === true ? "iconfont icon-fenxiang1" : ""}
       onClick={() => {
         props.setShape()
       }}></i>
    }
    {(props.isTask && props.type === 'task') &&
    <b className={(props.isSumbit && props.isHistory !== '1') ? "submitButton enable" : "submitButton disable"}
       onClick={() => {
         (props.isSumbit && props.isHistory !== '1') && props.sumbitTask()
       }}>{props.isHistory !== '1' ? '提交' : '已完成'}</b>}
  </div>
)
const CourseDetail = (props) => {
  if (!props.data) return null;
  return (
    <div className='courseDetail'>
      <div className='title'>{props.data.courseName}</div>
      <div className='middle'>
        <span className={'lookNumber'}><em>{props.data.browsNum}</em>浏览</span>
        <span className={'none'}><em className='iconfont icon-xiazai'></em>下载</span>
      </div>
      <div className='courseDescription' dangerouslySetInnerHTML={{__html: props.data.courseDescription}}>
      </div>
      <div onClick={() => props.toTest(props.courseId)} className={props.isPlay ? '' : 'click'}>
        <div className={props.data.checkpoints === '1' ? 'buttonClass' : 'none'}>
          <span>我要闯关</span>
        </div>
      </div>
    </div>
  )
}
export default BusinnessSchoolDetail
