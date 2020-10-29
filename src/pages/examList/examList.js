import React, {Component} from 'react';
// import {Link} from "react-router-dom";
import { observable,decorate,action} from "mobx";
import {observer} from "mobx-react";
import './examList.scss';
import {Shopguidehttp} from '../businessschool/Shopguidehttp';
import Header from "../../component/header/header";
// import Common from '../../common_method/GeneralMethod';
import SchoolStore from '../businessschool/SchoolStore'

import { getQuestionByCourseId }from '../../apis/Api'
import { getQueryString } from '../../utils/getToken';
class Store{
    data=null; /*整个考试内容*/
    currentData=null; /*当前页内容*/
    courseId=0; /*章节id*/
    pageIndex=0;  /*页数*/
    isShow=''; //是否显示
    isShowRight=false;
    getDate(){
        // getQuestionByCourseId({'courseId':this.courseId}).then((json)=>{
        //     if(json.dataObject){
        //         this.data=json.dataObject;
        //         this.currentData=json.dataObject[this.pageIndex];
        //     }else{}
        // }).catch((error)=>{
        //     console.warn(error);
        // });
        Http.GET('game/getQuestionByCourseId',{'courseId':this.courseId,'accessToken':getQueryString("accessToken"),"version":'1.0'}).then((json)=>{
            if(json.dataObject){
                this.data=json.dataObject;
                this.currentData=json.dataObject[this.pageIndex];
            }else{
            }
        }).catch((error)=>{
            console.warn(error);
        });
    }
    single(answerId){  //保存选中数据
        this.currentData.choosedAnswerIds=answerId+',';
        this.currentData.answers && this.currentData.answers.forEach((item)=>{
            if(item.answerId===answerId){
                item.choosed='0'
            }else{
                item.choosed='1'
            }
        })
        let tempArr=this.data.splice(0);
        tempArr[this.pageIndex]=this.currentData;
        this.data=tempArr;
        //this.data=this.copy(this.data)
    }
    mul(answerId){ //多个选择
        if(!this.currentData.choosedAnswerIds){
            this.currentData.choosedAnswerIds='';
        }
        if(this.currentData.choosedAnswerIds.indexOf(answerId)>-1){
            this.currentData.choosedAnswerIds=this.currentData.choosedAnswerIds.replace(new RegExp(answerId+','),'');
            this.currentData.answers && this.currentData.answers.forEach((item)=>{
                if(item.answerId===answerId){
                    item.choosed='1'
                }
            })
        }else{
            this.currentData.choosedAnswerIds=this.currentData.choosedAnswerIds+(answerId+',');
            this.currentData.answers && this.currentData.answers.forEach((item)=>{
                if(item.answerId===answerId){
                    item.choosed='0'
                }
            })
        }
        //mobx array转js array
        let tempArr=this.data.splice(0);
        tempArr[this.pageIndex]=this.currentData;
        this.data=tempArr;
    }
    copy(obj1) {
        let obj2 = {};
        for (let i in obj1) {
            obj2[i] = obj1[i];
        }
        return obj2;
    }
}
decorate(Store, {
    isShowRight:observable,
    isShow:observable,
    currentData:observable,
    pageIndex:observable,
    data: observable,
    courseId: observable,
    single:action,
    getDate: action,
    copy: action
});
const Http = new Shopguidehttp();
const ExamList=observer(class ExamList extends Component {
    constructor(props) {
        super(props);
        this.store = new Store();
        this.schoolStore=new SchoolStore()
        this.store.courseId=this.props.match.params.courseId;
        this.store.getDate();
    }
    single=(answerId)=>{ //单选
        this.store.single(answerId);
        this.store.copy(this.store.data)
    }
    mul=(answerId)=>{  //多选
        this.store.mul(answerId);
        this.store.copy(this.store.data)
    }
    goTo=(n)=>{  //跳转
        if(n>0 && (this.store.pageIndex!==(this.store.data.length-1))){
            this.store.pageIndex+=n;
        }
        if(n<0 && this.store.pageIndex!==0){
            this.store.pageIndex+=n;
        }
        this.store.currentData=this.store.data[this.store.pageIndex];
    }
    submit=()=>{  //提交判断是否错误
        let pass='';
        console.log("121212",this.store);
        this.store.data && this.store.data.forEach((item)=>{

            if(item.choosedAnswerIds){
                let aa=item.choosedAnswerIds.split(',');
                let bb=item.rights.split(',');
                if(aa.sort().toString()!==bb.sort().toString()){
                    pass=pass+'0';
                }else{
                    pass=pass+'1';
                }
            }else{
                pass=pass+'0';
            }
        })
        if(pass.indexOf('0')<0){
            this.store.isShow='pass';
            this.schoolStore.cache.set('isSumbit',true)
            if(this.schoolStore.cache.get('status')!==1){
                this.schoolStore.updateCourseLearningStatus()
            }
        }else{
            this.store.isShow='fail'
            this.schoolStore.cache.set('isSumbit',0)
        }
    }
    showError=(n)=>{ //显示错对后的操作
        if(n===1){
            // this.props.history.push({ pathname : `/businnessSchoolDetail/${sessionStorage.bookInfo}`});
            this.props.history.goBack();
        }
        if(n===2){
            this.store.isShowRight=true;
            this.store.isShow='';
            this.store.pageIndex=0;
            this.store.currentData=this.store.data[this.store.pageIndex];
        }
    }
    render() {
        let header = "" ;
        if(this.store.data){
            console.log("this.store.data",this.store.data);
            header = this.store.data[0].courseName;
            console.log("header",header)
        }

        return (

            <div className='testList'>
                {
                    header !== "" ? <Header headerTilte = {header}/> :""
                }

                <div className={'bottomMar'}>
                    <Topic data={this.store.data} currentData={this.store.currentData}/>
                    <Options data={this.store.data} currentData={this.store.currentData} single={this.single} mul={this.mul} isShowRight={this.store.isShowRight}/>
                    <Analysis data={this.store.data} currentData={this.store.currentData} isShowRight={this.store.isShowRight}/>
                </div>
                <Controlbar data={this.store.data} pageIndex={this.store.pageIndex} goTo={this.goTo} submit={this.submit.bind(this)} isShowRight={this.store.isShowRight} showError={this.showError}/>
                <DisplayResults isShow={this.store.isShow} showError={this.showError}/>
            </div>
        );
    }
})
const Topic=(props)=>{
        return (
            <div className='singleChoose'>
                <p className='title'>
                    {props.currentData&&props.currentData.title}
                    <em className={props.currentData&&props.currentData.questionType===0?'single':'none'}>单选</em>
                    <em className={props.currentData&&props.currentData.questionType===1?'mul':'none'}>多选</em>
                    <em className={props.currentData&&props.currentData.questionType===2?'choose':'none'}>判断</em>
                </p>
                <div className={props.currentData&&props.currentData.questionPic?'img':'none'}><img src={props.currentData&&props.currentData.questionPic} alt="图片"/></div>
            </div>
        );
}
const Options=(props)=>{
    if (props.currentData && props.currentData.questionType===0) {
        return (
            <div className='chooseBdoy singleChooseBody'>
                {props.currentData && props.currentData.answers && props.currentData.answers.map((item,index)=>{
                    return (
                        <div className='item' key={index} onClick={()=>{props.single(item.answerId)}}>
                            {/*<span className={props.isShowRight?'':'none'}><b className={item.isRight==='0'?'iconfont icon-duihao':'iconfont icon-chahao'}></b></span>*/}
                            <em className={item.choosed==='0'?'iconfont icon-xuanzhong':'iconfont icon-weixuan'}></em>
                            <span className='itemContent'>{item.content}</span>
                            <span className={props.isShowRight?'showRW':'none'}>
                                <img className={item.isRight==='0'?'iconfont icon-duihao':'none'} src={'http://supershoper.xxynet.com/vsvz1582294674352'} />
                            </span>
                            <img className={item.answerPic?'itemImg':'none'} src={item.answerPic} alt={' '}/>
                        </div>
                    )
                })}
            </div>
        );
    } else if(props.currentData && props.currentData.questionType===1){
        return (
            <div className='chooseBdoy mulChooseBody'>
                {props.currentData && props.currentData.answers && props.currentData.answers.map((item,index)=>{
                    return (
                        <div className='item' key={index} onClick={()=>{props.mul(item.answerId)}}>
                            {/*<span className={props.isShowRight?'':'none'}><b className={item.isRight==='0'?'iconfont icon-duihao':'iconfont icon-chahao'}></b></span>*/}
                            <em className={item.choosed==='0'?'iconfont icon-dianzhong':'iconfont icon-fang'}></em>
                            <span className='itemContent'>{item.content}</span>
                            <span className={props.isShowRight?'showRW':'none'}>
                                <img className={item.isRight==='0'?'iconfont icon-duihao':'none'} src={'http://supershoper.xxynet.com/vsvz1582294674352'} />
                            </span>
                            <img className={item.answerPic?'itemImg':'none'} src={item.answerPic} alt={' '}/>
                        </div>
                    )
                })}
            </div>
        );
    } else {
        return (
            <div className='chooseBdoy estimateBody'>
                {props.currentData && props.currentData.answers && props.currentData.answers.map((item,index)=>{
                    return (
                        <div className='item' key={index} onClick={()=>{props.single(item.answerId)}}>
                            {/*<span className={props.isShowRight?'':'none'}><b className={item.isRight==='0'?'iconfont icon-duihao':'iconfont icon-chahao'}></b></span>*/}
                            <em className={item.choosed==='0'?'iconfont icon-xuanzhong':'iconfont icon-weixuan'}></em>
                            <span className='itemContent'>{item.content}</span>
                            <span className={props.isShowRight?'showRW':'none'}>
                                <img className={item.isRight==='0'?'iconfont icon-duihao':'none'} src={'http://supershoper.xxynet.com/vsvz1582294674352'} />
                            </span>
                            <img className={item.answerPic?'itemImg':'none'} src={item.answerPic} alt={' '}/>
                        </div>
                    )
                })}
            </div>
        );
    }
}
const Analysis=(props)=>{
    return (
        <div className={props.isShowRight?'analysis':'none'}>
            {/*<div className={'row'}>*/}
            {/*    <div className='title'>回答:</div>*/}
            {/*    <em className={props.currentData&&props.currentData.right?'iconfont icon-duihao':'iconfont icon-chahao'}></em>*/}
            {/*</div>*/}
            <div className={'row'}>
                <div className='title'>解析:</div>
                <div className='analysisContent'>
                    {props.currentData&&props.currentData.questionDescription}
                </div>
            </div>
        </div>
    )
}
const Controlbar=(props)=>{
    return (
        <div className='controlbar'>
            <span onClick={()=>props.goTo(-1)} className={props.pageIndex===0?'noClick':'goBack'}>上一题</span>
            <span className='footBar'><b>{props.pageIndex+1}</b>/{props.data&&props.data.length}</span>
            <span onClick={()=>props.goTo(1)} className={props.pageIndex===(props.data&&props.data.length-1)?'none':'goTo'}>下一题</span>
            <span onClick={()=>props.submit()} className={props.pageIndex===(props.data&&props.data.length-1) && !props.isShowRight?'goTo':'none'}>提交</span>
            <span onClick={()=>props.showError(1)} className={props.pageIndex===(props.data&&props.data.length-1) && props.isShowRight?'goTo':'none'}>结束</span>
        </div>
    )
}
const DisplayResults=(props)=>{
    return(
        <div className={props.isShow?'DisplayResult':'none'}>
            <div>
                <div className={props.isShow==='pass'?'showBlock pass':'showBlock fail'}>
                    <div className='empty'></div>
                    <div>
                    </div>
                    <div className={props.isShow==='pass'?'none':''}>
                        <span onClick={()=>props.showError(1)} className='tryOne'><b>重新学习</b></span>
                        <span onClick={()=>props.showError(2)} className='details'><b>查看错题</b></span>
                    </div>
                    <div className={props.isShow==='pass'?'':'none'}>
                        <span onClick={()=>props.showError(1)} className='tryOne'><b>重新学习</b></span>
                        <span onClick={()=>props.showError(1)} className='details'><b>返回课程</b></span>
                    </div>
                    <img className='shanchu' onClick={()=>props.showError(1)} src="http://supershoper.xxynet.com/vsvz1557976581096" alt="X"/>
                </div>

            </div>
        </div>
    )
}
export {ExamList}
