import React, {Component} from 'react';

import Common from '../../utils/GeneralMethod'
import './articledetail.css';
import PraiseBlock from "../../component/praiseblock/PraiseBlock";
import CommentBlock from "../../component/commentblock/CommentBlock";
import {HTTPCnst} from "../../service/httpCnst.js";
import Loading from "../../utils/Loading";
import {CommonInterface} from "../../utils/CommonInterface";
import ArticledetailStore from "./ArticledetailStore"
import appStore from "../../sys/AppStore"
import Video from '../../component/video/Video'
import MessageInfo from "../../component/messageInfo/messageInfo"
import ListView from '../../component/listview/listview'
import {observer} from "mobx-react";
import ListStatus from "../../component/listStatus/listStatus";
import {ShowBackHome} from "../../utils/jsTools";
import { getQueryString } from '../../utils/getToken';
import Header from "../../component/header/header";

const common = new Common();
const imgWidth = Math.round(window.innerWidth);
const imgHeight = Math.round(imgWidth * 9 / 16);

@observer
class ArticleDetail extends Component {
  constructor(props) {
    super(props);
    CommonInterface.setTitle("文章详情");
    this.store = new ArticledetailStore(appStore);
    let temp;
    if (props.match) {
      temp = props.match.params.articleId
    } else {
      temp = '40940'
    }
    let self = this
    temp = temp.split('&&')
    this.store.articleId = temp[0]
    this.store.cache.set('isTask', false)
    if (temp.length > 1) {
      this.store.cache.set('taskId', temp[1])
      this.store.cache.set('isTask', true)
      this.store.cache.set('isHistory', temp[2])
      // if (temp[2] !== '1') {
      //   window.addEventListener("popstate", self.addBack.bind(self), false);
      //   if (sessionStorage.goBack !== '1') this.pushHistory();
      //   sessionStorage.goBack = 1;
      // }
    }
    this.store.initArticleData(this.store.articleId);
    this.store.initPraiseData(this.store.articleId);
    this.store.initCommentData(this.store.articleId);
    ShowBackHome(appStore.BackHome, this)
  }

  addBack(e) {  //回调函数中实现需要的功能
    if (sessionStorage.toALink === '1') {
      sessionStorage.toALink = null
      return
    }
    this.store.newsData = {
      content: '任务尚未提交完成，确定要离开吗?',
      btnTitleR: '继续任务',
      btnTitleL: '确认离开',
      clickR: () => {
        this.store.newsData = {}
        this.pushHistory()
      },
      clickL: () => {
        this.store.newsData = {}
        this.props.history.go(-1)
      }
    }
    e.preventDefault(); //backbutton事件的默认行为是回退历史记录，如果你想阻止默认的回退行为，那么可以通过preventDefault()实现
  }

  pushHistory() {
    let baseUrl = HTTPCnst.baseUrl;
    baseUrl = baseUrl.substr(0, baseUrl.length - 1)
    let state = {
      title: "title",
      url: baseUrl + this.props.match.url+'?accessToken='+getQueryString("accessToken")
    };
    window.history.pushState(state, state.title, state.url);
  }

  _renderItem = (item, index) => {
    return (
      <div key={item.articleId + index} className={'whitebgs'}>
        <CommentBlock
          setPraise={this.store.postSecondPraise}
          content={item}
          num={this.store.commentNum}
          store={this.store}
          key={index}
          history={this.props.history}
        />
      </div>
    )
  }

  toALink(url) {
    if (this.store.cache.get('isTask')) {
      sessionStorage.toALink = 1;
    }
    window.location.href = url
  }

  _otherItem() {
    return (
      <div className={'other'} style={{'background': '#efefef'}}>
        {/*文章视频类型*/}
        {this.store.articledata && this.store.articledata.contentType === "0" ? (
          <VideoContent item={this.store.articledata}/>) : null}
        {/*文章图文类型*/}
        {this.store.articledata && this.store.articledata.contentType === "1" ? (
          <GraphicContent onload={this.store.onload} iframeWidth={this.store.iframeWidth} item={this.store.articledata}
                          articlePreviewImage={this.store.articlePreviewImage}/>) : null}
        {/*文章外部链接类型*/}
        {this.store.articledata && this.store.articledata.contentType === "2" ? (
          <OuterChain onload={this.onload} item={this.store.articledata} toALink={this.toALink.bind(this)}/>) : null}
        {/*文章点赞列表*/}
        <PraiseBlock content={this.store.praisedata} praiseType="article"
                     videoId={this.store.articledata && this.store.articledata.articleId}/>
        {/*文章评论列表*/}

        {this.store.discussdata.length !== 0 && <p className="comstitle" id='comstitle'
                                                   style={{'paddingBottom': this.store.commentNum > 0 ? 0 : '15px'}}>{this.store.commentNum}人评论</p>}
        {this.store.discussdata.length === 0 && <ListStatus status="discussEmpty" tips="还没人回复，赶紧抢沙发~"/>}
      </div>
    )
  }

  render() {
    console.log("this.store.articledata",this.store.articledata.title)
    return (
      <div className="article-content" id="article-content">
        {
          this.store.articledata.title ?
            <Header headerTilte={ this.store.articledata.title}/> : ""

        }
        <Loading loading={{open: this.store.open, msg: this.store.meg}}/>
        <MessageInfo data={this.store.newsData}/>
        <div className="article-detail">
          <ul className="comlist">
            <ListView
              listViewStyle={{'height': window.innerHeight - 50 + 'px'}}
              sysListId={'ArticleDetailId' + this.store.articleId}
              onPullRefresh={() => this.store._onPullRefresh(this.store)}   //下拉刷新回调   重新请求更新store数据
              onEndReached={() => this.store._onEndReached(this.store)}     //上滑加载回调  原数据concat(请求的page+1数据)
              fetchMoreLoading={this.store.fetchMoreLoading}   //是否显示加载loading
              enablePullRefreshEvent={true}         //是否开启下拉刷新
              enableOnEndReachedEvent={true}        //是否开启上滑加载  无更多数据设为false
              renderItem={this._renderItem}
              otherItem={this._otherItem.bind(this)}
              data={this.store.discussdata || []}
            />
          </ul>
        </div>
        {/*底部操作*/}
        <HandleBar
          shareState={this.store.articledata && this.store.articledata.shareFlag==1}
          setShape={this.store.postShape}
          praiseState={this.store.articledata && this.store.articledata.favourStatus}
          favoriteState={this.store.articledata && this.store.articledata.favoriteStatus}
          comment={this.store.commentText}
          setPraise={this.store.postPraise}
          setFavorite={this.store.postFavorite}
          setComment={this.store.postComment}
          inputText={this.store.getText}
          submitFlag={this.store.submitFlag}
          isTask={this.store.cache.get('isTask')}
          pinglun={this.store.pinglun}
          store={this.store}
          sumbitTask={this.store.sumbitTask.bind(this)}
          isHistory={this.store.cache.get('isHistory')}
          innerStyle={this.store.innerStyle}
          praisedata={this.store.praisedata}
        />
      </div>
    );
  }
}

// export default observer(hot(module)(ArticleDetail))
// 视频类型
const VideoContent = (props) => (
  props.item && (<div className="linksdiv">
    <div className="videobg">
      <Video videoUrl={'http://video.xxynet.com/' + props.item.videoUrl}
             courseImg={"http://insight-video.qiniudn.com/" + props.item.videoUrl + "?vframe/png/offset/0"}/>
    </div>
    <div className="whitebg links marbottom">
      <p className="title">{props.item.title}</p>
      {/*<div className="viewnum">
                            <p><span>{props.item.browsNum}</span>浏览</p>
                            <img src={require('../img/download.png')} alt="图片" />
                        </div>*/}
      <div className="viewnum">
        <p className="times"><span>{props.item.name}</span><span className="dian">·</span><span
          className="browsnum">{props.item.browsNum}</span> <span>浏览</span> <span>·</span>
          <span>{common.dateFormat(props.item.createTime, 'MM-dd hh:mm', 'show')}</span></p>
        {/*<PageView number={props.item.browsNum} />*/}
      </div>
      {props.item.intro ? <p className="details">{props.item.intro}</p> : null}
    </div>
  </div>)
);
// 图文类型
const GraphicContent = (props) => (
  props.item && (<div className="whitebg">
    <p className="title">{props.item.title}</p>
    <div className="viewnum">
      <p className="times"><span>{props.item.name}</span><span className="dian">·</span><span
        className="browsnum">{props.item.browsNum}</span> <span>浏览</span> <span>·</span>
        <span>{common.dateFormat(props.item.createTime, 'MM-dd hh:mm', 'show')}</span></p>
    </div>
    {props.item.intro ? <p className="introl">{props.item.intro}</p> : null}
    <div className="con" onClick={props.articlePreviewImage}
         dangerouslySetInnerHTML={{__html: props.item.materialUrl}}></div>
  </div>)
);
// 外部链接类型
const OuterChain = (props) => (
  props.item && (<div className="linksdiv">
    <div className={'alink'} onClick={() => props.toALink(props.item.materialUrl)}>
      <img className="link-img"
           src={(props.item.pic || "http://supershoper.xxynet.com/vsvz1539226691342") + "?imageView2/1/w/" + imgWidth + "/h/" + imgHeight}
           alt="link-img"/>
      <img className="link-icon" src="http://supershoper.xxynet.com/vsvz1539226782820" alt="link-icon"/>
    </div>
    <div className="whitebg links marbottom">
      <p className="title">{props.item.title}</p>
      <div className="viewnum">
        <p className="times"><span>{props.item.name}</span><span className="dian">·</span><span
          className="browsnum">{props.item.browsNum}</span> <span>浏览</span> <span>·</span>
          <span>{common.dateFormat(props.item.createTime, 'MM-dd hh:mm', 'show')}</span></p>
      </div>
      {props.item.intro ? <p className="details">{props.item.intro}</p> : null}
    </div>
  </div>)
);
// 底部操作 点赞、评论、转发
const HandleBar = (props) => (
  <div className={props.isTask ? "editcom taskButton" : "editcom"}>
    <div id='inputSubmit'>
      <label className={props.store.submitFlag ? 'similarInput' : 'none'} htmlFor="inputText"
             onClick={() => props.store.switchover(props.store, 1)}>{"说点什么吧…"}</label>
      <div className={props.store.submitFlag ? 'none' : 'showSubmit'}>
        <input id='inputText' placeholder={"说点什么吧…"} value={props.store.commentText} onChange={props.inputText}
               onBlur={() => props.store.switchover(props.store, 2)}/>
        <i className={props.store.commentText ? 'sendbtn red' : 'sendbtn'} onClick={() => {
          props.setComment(props.store, props.comment)
        }}>发送</i>
      </div>
    </div>
    {props.store.articledata && props.store.articledata.contentType === "1" && props.store.submitFlag &&
    <i className={`iconfont icon-pinglun ${props.store.commentNum > 999 ? 'bigWidth' : ''}`} onClick={() => {
      props.pinglun()
    }}>
      {props.store.commentNum > 0 && <em>{common.discussNum(props.store.commentNum)}</em>}
    </i>}
    {props.store.submitFlag && <i
      className={props.praiseState === true ? `iconred iconfont icon-dianzan3 ${props.praisedata.totalCount > 999 ? 'bigWidth' : ''}` : `iconfont icon-dianzan ${props.praisedata.totalCount > 999 ? 'bigWidth' : ''}`}
      onClick={() => {
        props.setPraise(props.store)
      }}>
      {props.praisedata.totalCount > 0 && <em>{common.discussNum(props.praisedata.totalCount)}</em>}
    </i>}
    {props.store.submitFlag &&
    <i className={props.favoriteState === true ? "iconyellow iconfont icon-shoucang1" : "iconfont icon-shoucang"}
       onClick={() => {
         props.setFavorite(props.store)
       }}></i>}

    {
      props.store.submitFlag && props.shareState &&
      <i className={props.shareState === true ? "iconfont icon-fenxiang1" : ""}
       onClick={() => {
         props.setShape(props.store)
       }}></i>
    }
    {props.isTask && <b className={props.isHistory !== '1' ? "submitButton enable" : "submitButton disable"}
                        onClick={props.isHistory !== '1' && props.sumbitTask}>{props.isHistory !== '1' ? '提交' : '已完成'}</b>}
  </div>
)

export default ArticleDetail;
