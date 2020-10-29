import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './commentdetail.css';
// import {HashRouter as Router} from "react-router-dom";
import ListStatus from "../../component/listStatus/listStatus";
import PraiseBlock from "../../component/praiseblock/PraiseBlock";
import ReplyBlock from "../../component/replyblock/ReplyBlock";
import appStore, {HeadPic} from "../../sys/AppStore"
import CommentStore from "./CommentStore"
import {hot} from 'react-hot-loader'
import {observer} from "mobx-react";
import {CommonInterface} from "../../utils/CommonInterface";
import Common from '../../utils/GeneralMethod';
import ListView from '../../component/listview/listview';

const common = new Common();

@observer
class CommentDetail extends Component {
  constructor(props, context) {
    super(props, context);
    CommonInterface.setTitle("评论详情");
    this.store = new CommentStore(appStore);
    this.store.discussId = this.props.match.params.articleId;
    this.store.initData(this.store.discussId)
    this.store.initPraiseData(this.store.discussId);
    this.store.initCommentData(this.store.discussId);
  }

  // 提交评论回复
  setReplyId = (replyId, userId) => {
    this.store.replyId = replyId;
    this.store.replyuserId = userId;
    this.surname.focus();
  };
  focus = () => {
    let count = 5;
    var timer = setInterval(() => {
      if (count === 0) {
        clearInterval(timer)
      } else {
        count--;
        this.surname.scrollIntoView()
      }
    }, 100);
  }
  _renderItem = (item, index) => {
    return (
      <ReplyBlock
        setReply={this.setReplyId}
        content={item}
        key={index}
        history={this.props.history}
      />
    )
  }

  render() {
    return (
      <div className="comment-content">
        <div className="article-detail">
          {/*评论信息详情*/}
          <GraphicContent item={this.store.data} history={this.props.history}/>
          {/*评论点赞信息*/}
          <PraiseBlock content={this.store.praisedata} praiseType="articleComment" videoId={this.store.discussId}/>
          {/*评论回复列表*/}
          <div className="replybg">
            {this.store.discussdata.length !== 0 && <p className="comstitle">{this.store.commentNum}人回复</p>}
            {this.store.discussdata.length === 0 && <ListStatus status="discussEmpty" tips="还没人回复，赶紧抢沙发~"/>}
            {this.store.discussdata.length > 0 && <ul className="comlists">
              <ListView
                listViewStyle={{'height': document.body.clientHeight - 264 + 'px'}}
                sysListId={'commentDetails'}
                // onPullRefresh={()=>this.store._onPullRefresh(this.store)}   //下拉刷新回调   重新请求更新store数据
                onEndReached={() => this.store._onEndReached(this.store)}     //上滑加载回调  原数据concat(请求的page+1数据)
                fetchMoreLoading={this.store.fetchMoreLoading}   //是否显示加载loading
                enablePullRefreshEvent={false}         //是否开启下拉刷新
                enableOnEndReachedEvent={true}        //是否开启上滑加载  无更多数据设为false
                renderItem={this._renderItem}
                data={this.store.discussdata || []}
              />
            </ul>}
          </div>
        </div>
        {/*底部操作按钮*/}
        <HandleBar
          inputRef={el => this.surname = el}
          praiseState={this.store.data && this.store.data.favourStatus}
          comment={this.store.commentText}
          setPraise={this.store.postPraise}
          setComment={this.store.postComment}
          inputText={this.store.getText}
          submitFlag={this.store.submitFlag}
          focus={this.focus}
          store={this.store}
        />
      </div>
    );
  }
}

export default observer(hot(module)(CommentDetail))
// 评论信息comlists
const GraphicContent = (props) => (
  props.item && (<div className="whitebg paddbottom">
    <div className="rightcom1 marbottom">
      <HeadPic src={props.item.headPic} history={props.history} userId={props.item.createUser}
               headDivStyle={{height: '30px', width: '30px', marginRight: '10px'}}/>
      <div className="comdetail">
        <p className="names">
          <span>{props.item.isShowNameToArticle === '1' ? props.item.nickName || props.item.name || '无名氏' : props.item.name || props.item.nickName || '无名氏'}</span><span></span>
        </p>
        <p className="comtime">{common.dateFormat(props.item.commentTime, 'MM-dd hh:mm', "show")}</p>
      </div>
    </div>
    <p className="comcontent">{props.item.cont}</p>
  </div>)
)
// 底部操作 点赞、评论、转发
const HandleBar = (props) => (
  <div className="editcom">
    <div id='inputSubmit'>
      {/* <input type='text' className='similarInput' placeholder={"说点什么吧…"} onFocus={()=>props.store.switchover(props.store,1)} /> */}
      <label className={props.store.submitFlag ? 'similarInput' : 'none'} style={props.innerStyle} htmlFor="inputText"
             onClick={() => props.store.switchover(props.store, 1)}>{"说点什么吧…"}</label>
      <div className={props.store.submitFlag ? 'none' : 'showSubmit'}>
        <input id='inputText' placeholder={"说点什么吧…"} value={props.store.commentText} onChange={props.inputText}
               onBlur={() => props.store.switchover(props.store, 2)}/>
        <i className={props.store.commentText ? 'sendbtn red' : 'sendbtn'} onClick={() => {
          props.setComment(props.store, props.comment)
        }}>发送</i>
      </div>
    </div>
    {props.store.submitFlag &&
    <i className={props.praiseState === true ? "iconred iconfont icon-dianzan3" : "iconfont icon-dianzan"}
       onClick={() => {
         props.setPraise(props.store)
       }}></i>}

  </div>
)
