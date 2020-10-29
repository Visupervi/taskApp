import React, {Component} from 'react';
// import {Router, withRouter} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Avatar from '@material-ui/core/Avatar';
import bgImg from '../../../img/guidance_bg_1.png';
import topRightImg from '../../../img/guidance_rule_1.png';
import taskImg1 from '../../../img/guidance_task_list1.png';
import taskImg2 from '../../../img/guidance_task_list2.png';
import taskImg3 from '../../../img/guidance_list3.png';
import taskImg4 from '../../../img/guidance_list4.png'

import './signIn.css';
import HttpModel from "../../../service/HttpModel";


const topBannerStyle = {
    backgroundImage:'url('+bgImg+')'
}

const shadowNone = {
    color:'#FF5651',
    border:'1px solid #FF5651',
    width:'78px',
    height:'27px',
    minHeight:'27px',
    lineHeight:'27px',
    borderRadius: '50px',
    padding:'0'
}

const hasDone ={
    width:'78px',
    height:'27px',
    minHeight:'27px',
    lineHeight:'27px',
    color:'#9B9B9B',
    border:'1px solid #9B9B9B',
    borderRadius: '50px',
    padding:'0'
}
const styles = {
    backgroundColor:'#FF5651',
    color:'#fff',
    border:'1px solid #FF5651',
    width:'78px',
    height:'27px',
    minHeight:'27px',
    lineHeight:'27px',
    borderRadius: '50px',
    padding:'0'
}

const avatarStyle = {
    backgroundColor: '#fff',
    borderRadius:0
}

/**
 * 任务按钮状态
 * @param props
 * @returns {*}
 * @constructor
 */
function TaskButton(props) {
    let button;
    if(props.bool == '1'){
        button = <Button variant='outlined' color='primary' style={styles} onClick={() => props.toReceive(props.taskId)}>领取</Button>
    }else if(props.bool == '2'){
        button = <Button variant='outlined' color='default' style={shadowNone}>做任务</Button>
    }else if(props.bool == '3'){
        button = <Button variant='outlined' color='default' style={hasDone}>已领</Button>
    }
    return (
        <div>
            {button}
        </div>
    )
}

export default class Guidance extends Component{
    constructor(props){
        super(props);
        this.state = {
            coinCount:0,
            signDay:0,
            stateList:[],
            taskDegree:[],
            taskList:[
                {id:'1',headImg:taskImg1,text:'完成任务2次',state:'1'},
                {id:'2',headImg:taskImg2,text:'互动社区发帖1次',state:'2'},
                {id:'3',headImg:taskImg3,text:'文章中评论3次',state:'3'},
                {id:'4',headImg:taskImg4,text:'活动评论10次',state:'1'}
                ]
        };
        this.handleClick = this.handleClick.bind(this);
        this.Http = new HttpModel();
    }

    componentWillMount() {
        this.getTopData();
        this.setState({coinCount:320,signDay:2})
    }

    getTopData() {
        // 首页轮播
        this.Http.GET('landingPage/headline',{})
            .then((json) => {
                if(json){
                    console.log(json);
                    // this.setState({headlineDatas:json});
                }else{
                    alert("获取首页轮播失败");
                }
            });
    }

    toReceive(taskId) {
        alert('领取任务奖励'+taskId);
    }

    /*判断type值然后进行跳转*/
    goTo(index){
        if(!this.state.stateList[index]){
            if(index == 1){
                // this.props.history.push("/Management");/*最新动态*/
                alert('页面跳转');
            }
        }
        // switch (index){
        //     // case '3' : this.props.history.push({ pathname : `/news/${item.appModuleId}`});  break; /*最新动态*/
        //     // case '20' : this.props.history.push({ pathname : `/businnessSchool/${item.appModuleId}`});  break; /*商学院*/
        //     default : break;
        // }
    }

    handleClick() {
        // this.props.history.push("/guidance");
        alert('页面跳转');
    }

    render(){
        return (
            <div>
                <div className="topBanner" style={topBannerStyle}>
                    <div className="topMain mg10">
                        <div className="fs_12 l_24">当前金币</div>
                        <div className="fs_45">{this.state.coinCount}</div>
                        <div className="fs_14">您已连续签到{this.state.signDay}天</div>
                    </div>
                    <div className="topRight fs_12 cMain" onClick={this.handleClick}>
                        <img src={topRightImg} alt=""/>
                        <span>金币规则</span>
                    </div>
                </div>
                <div className="taskListCon">
                    <Title title="每日任务" />
                    <TaskList
                        taskList = {this.state.taskList}
                        goTo={(type)=>this.goTo(type)}
                        toReceive={(task)=>this.toReceive(task)}
                    />
                </div>
            </div>
        )
    }
}


function TaskList(props) {
    return (
        <List>
            {props.taskList.map((item,index) => (
                <ListItem key={index} onClick={()=>{props.goTo(index)}}>
                    <Avatar style={avatarStyle}>
                        <img src={item.headImg} alt="" className="taskHead"/>
                    </Avatar>
                    <ListItemTxt title={item.text} />
                    <TaskButton bool={item.state} taskId={item.id} toReceive={(task)=>props.toReceive(task)}/>
                </ListItem>
            ))}
        </List>
    )
}

const Title = (props) => (
    <div className='pTitle'>
        <span className='fs_14'>{props.title}</span>
    </div>
)


const ListItemTxt = (props) =>(
    <div className='listItemCon'>
        <div className='item_title'>{props.title}</div>
        <div className='item_secondary'>完成<span className='cMain'>1</span>/1</div>
    </div>
)




