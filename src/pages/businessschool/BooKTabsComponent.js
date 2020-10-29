import React, {Component} from 'react';
// import {Link} from "react-router-dom";
// import { observable, computed,decorate,action,extendObservable} from "mobx";
import {observer} from "mobx-react";
import './BooKTabsComponent.css';
import {Contents} from '../components/contents/Contents'
import PraiseBlock from "./praiseblock/PraiseBlock";
import CommentBlock from './commentblock/CommentBlock';
import SchoolStore from './SchoolStore';

const BooKTabsComponent = observer(class BooKTabsComponent extends Component {
  constructor(props) {
    super(props);
    this.store = new SchoolStore();
  }

  toDefault = () => {
    this.store.switch(1);
  }
  focus = () => {

  }

  render() {
    let isPlay = this.props.isPlay || this.store.cache.get('isPlay')
    return (
      <div className='tab'>
        <div className='tabHeader'>
          <span onClick={() => {
            if (!this.props.contentslist) {
              return
            }
            ;this.store.switch(0)
          }} className={this.store.switchValue === 0 ? 'active' : 'lose'}><b>目录</b></span>
          <span onClick={() => {
            if (!this.props.contentsDetail) {
              return
            }
            ;this.store.switch(1)
          }} className={this.store.switchValue === 1 ? 'active' : 'lose'}><b>详情</b></span>
        </div>
        {this.store.switchValue === 0 && <div className='tabContent'>
          <Contents data={this.props.contentslist} toDetail={this.props.toDetail} toDefault={this.toDefault}
                    goExamList={this.props.goExamList}/>
        </div>}
        {this.store.switchValue === 1 && <div className='tabContent'>
          <CourseDetail data={this.props.contentsDetail} courseId={this.props.courseId} toTest={this.props.toTest}
                        isPlay={isPlay}/>
          <PraiseBlock content={this.props.contentsDetail} praiseType="3"/>
          <CommentBlock history={this.props.history} courseId={this.props.courseId} setPraise={this.props.postPraise}
                        content={this.props.contentsDetail} commentLIst={this.props.commentLIst}/>
          <HandleBar
            praiseState={this.props.contentsDetail && this.props.contentsDetail.isLike}
            isFavouroite={this.props.contentsDetail && this.props.contentsDetail.isFavouroite}
            getText={this.props.getText}
            comment={this.props.commentText}
            setPraise={this.props.postPraise}
            setComment={this.props.postComment}
            collect={this.props.collect}
            isTask={this.props.isTask}
            focus={this.focus}
            sumbitTask={this.props.sumbitTask}
            inputRef={el => this.surname = el}
            isSumbit={this.props.isSumbit}
            isHistory={this.store.cache.get('isHistory')}
            type={this.store.cache.get('type')}
          />
        </div>}
      </div>
    );
  }
})
// 底部操作 点赞、评论、转发
const HandleBar = (props) => (
  <div className={(props.isTask && props.type === 'task') ? "editcom taskButton" : "editcom"}>
    <input placeholder="说点什么吧…" value={props.comment} onChange={props.getText} onFocus={props.focus}
           ref={props.inputRef}/>
    {/* <i className="sendbtn" onClick={() => {props.setComment(props.comment)}}>发送</i> */}
    <i className={props.praiseState === 1 ? "iconred iconfont icon-dianzan1" : "iconfont icon-dianzan1"}
       onClick={() => {
         props.setPraise()
       }}></i>
    <i className={props.isFavouroite === '1' ? "iconfont icon-wode_shoucang iconred" : "iconfont icon-wode_shoucang"}
       onClick={() => {
         props.collect()
       }}></i>
    {/* {(props.isTask && props.type=== 'task') && <b className={(props.isSumbit && props.isHistory!=='1')?"submitButton enable":"submitButton disable"} onClick={()=> {(props.isSumbit && props.isHistory!=='1') && props.sumbitTask()}}>提交</b>} */}
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
export {BooKTabsComponent}
