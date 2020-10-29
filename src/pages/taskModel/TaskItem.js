import React, {Component} from 'react';
import {observer} from "mobx-react";
import {computed,} from "mobx";
import Common from "../../utils/GeneralMethod";

const common=new Common();
@observer
class TaskItem extends Component{
    // @observable price = 0;
    @computed get aliveDays() {
        let task = this.props.task
        let showTime=''
        if(!task.endTime){
            return `<b>永久</b>`
        }
        let now = new Date(),end = common.dateFormat(task.endTime)
        let surplusTime=end.getTime()-now.getTime();
        if(surplusTime<1000*60*60){
            showTime=`<i>${Math.floor(surplusTime/(1000*60))}</i>分钟`
        }else if(surplusTime<1000*24*60*60){
            showTime=`<i>${Math.floor(surplusTime/(1000*60*60))}</i>小时`
        }else if(1000*24*60*60<surplusTime && surplusTime<1000*48*60*60){
            showTime=`<i>1</i>天<i>${Math.floor((surplusTime-1000*24*60*60)/(1000*60*60))}</i>小时`
        }else{
            showTime=`<i>${Math.floor(surplusTime/(1000*60*60*24))}</i>天`
        }
        return showTime
    }

    render() {
        let task = this.props.task
       /* 1是history*/
        return(
            <li onClick={()=>this.props.taskDetails(task,this)}>
                <div className='img'>
                    {displayTypeImage(task.templateFlag,task)}
                </div>
                <div className='detail'>
                    <p>{task.taskName}</p>
                    {/*<div><img src='http://supershoper.xxynet.com/vsvz1557380907024' alt={''} />+{task.gold}金币奖励 · { displayTypeName(task.templateFlag) }<span className={this.props.isHistory?'none':''}>仅剩<em dangerouslySetInnerHTML={{__html: this.aliveDays}}></em></span></div>*/}
                    <div>+{task.gold}金币 <span className={this.props.isHistory?'none':''}>仅剩<em dangerouslySetInnerHTML={{__html: this.aliveDays}}></em></span></div>
                </div>
            </li>
        )
    }
}

//@TODO 不同类型对应不同的图片
const displayTypeImage = (type,item)=>{
    let html=''
    switch (type) {
        case '5': //考试
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1557380808787'} alt={''}/>
            break;
        case '3':  //陈列任务
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1557380697064'} alt={''}/>
            break;
        case '17': //会议任务
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1543903426905'} alt={''}/>
            break;
        case '6': //课程任务
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1557380828098'} alt={''}/>
            break;
        case '10'://文章任务
        // case '53'://分享文章
            html= <img src={item.icon+'?imageView2/1/w/45/h/45' || 'http://supershoper.xxynet.com/vsvz1557380846699'} alt={''}/>
            break;
        case '44': //调研任务
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1557380866713'} alt={''}/>
            break;
        case '12': //巡店
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1557380886415'} alt={''}/>
            break;
        default:
            html= <img src={item.icon+'?imageView2/1/w/90/h/90' || 'http://supershoper.xxynet.com/vsvz1543921829104'} alt={''}/>
            break;
    }
    return html;
}

//@TODO 不同类型对应类型明
// const displayTypeName= (type)=>{
//     let html=''
//     switch (type) {
//         case '5': //考试
//             html= '考试任务'
//             break;
//         case '3':  //陈列任务
//             html= '陈列任务'
//             break;
//         case '17': //会议任务
//             html= '会议任务'
//             break;
//         case '6': //课程任务
//             html= '课程任务'
//             break;
//         case '10'://文章任务
//         case '53'://分享文章
//             html= '文章任务'
//             break;
//         case '44': //调研任务
//             html= '调研任务'
//             break;
//         case '12': //巡店
//             html= '巡店任务'
//             break;
//         default:
//             html= 'ren'
//             break;
//     }
//     return html;
// }


export default TaskItem
