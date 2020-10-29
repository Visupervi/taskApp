import React, {Component} from 'react';
import {observer} from "mobx-react";
import './Contents.css'
import Common from '../../common_method/GeneralMethod';

const common = new Common()
const Contents = observer(class Contents extends Component {
  // constructor(props) {
  //     super(props);
  // }
  /*课程状态(1.看完 浅色显示 2.推荐 黑色加小红点 3. 还没与看 黑色，4上锁) */
  render() {
    return (
      <div className={this.props.data ? "examList" : 'none'}>
        {this.props.data && this.props.data.map((exam, exam_index) => (
          <div className='exam' key={exam_index}>
            <p className='examTitle'>{`第${common.toChinesNum(exam_index + 1)}章`}&nbsp;&nbsp;
              <span>{`${exam.name}`}</span></p>
            <em className={exam.newFlag === 1 ? 'iconfont icon-new' : 'none'}></em>
            <div className='examContent'>
              {exam.chapter_list && exam.chapter_list.map((chapter, chapter_index) => (
                <div className='chapter' key={chapter_index}>
                  <p className='chapterTitle'>{`第${chapter_index + 1}节`}&nbsp;&nbsp;<span>{`${chapter.name}`}</span></p>
                  <ChapterContent chapter={chapter} status={chapter.status} goExamList={this.props.goExamList}
                                  toDetail={this.props.toDetail} toDefault={this.props.toDefault}/>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
})
const ChapterContent = (props) => {
  if (props.chapter && !props.chapter.exam_id) {
    return (
      <div className='chapterContent'>
        {props.chapter && props.chapter.courseList && props.chapter.courseList.map((course, course_index) => (
          <p onClick={() => {
            props.toDetail(course, props.status)
          }} className={course.status === 1 ? 'haveRead' : ''} key={course_index}>
            <em className={props.status === 4 ? 'iconfont icon-shangsuo' : 'iconfont icon-bofang'}></em>
            <span className={props.status === 4 ? 'shangsuo' : 'bofang'}>{course.course_name}</span>
            <em className={course.newFlag === 1 ? 'iconfont icon-new' : 'none'}></em>
          </p>
        ))}
      </div>
    )
  } else {
    return (
      <div className='chapterContent'>
        <p className={props.chapter.status === 1 ? 'haveRead' : ''} onClick={() => {
          (props.chapter && props.chapter.status !== 4) && props.goExamList(`${props.chapter && props.chapter.exam_id}`)
        }}>
          <em
            className={props.chapter && props.chapter.status !== 4 ? 'iconfont  icon-bofang' : 'iconfont icon-shangsuo'}></em>
          {props.chapter && props.chapter.name}
        </p>
      </div>
    )
  }

}
export {Contents}
