import React, {Component} from 'react';
import {observer} from "mobx-react";
import TaskStore from './TaskStore';
import appStore from "../../sys/AppStore"
import "./examTask.scss"
import {hot} from 'react-hot-loader'
import MessageInfo from '../../component/messageInfo/messageInfo'
import Loading from '../../utils/Loading'
import Header from "../../component/header/header";

// import PositionedSnackbar from '../../components/snackbar/Snackbar'

@observer
class ExamTask extends Component {
  constructor(props) {
    super(props);
    let por = props.match.params.taskId.split('&&');
    console.log("por",por);
    this.state = {
      taskStore: new TaskStore(appStore),
      taskId: por[0],
      ishistory: por[1]
    };
    if (this.state.ishistory === '2') this.state.taskStore.getExamTask(this.state.taskId); //开始考试，不显示详情
    if (this.state.ishistory === '1') this.state.taskStore.getAfterExamTask(this.state.taskId); //查看历史，显示详情
  }

  render() {
    let d = this.state.taskStore.taskDetailMap.get(this.state.taskId)
    /*由于考试内容中的金币得分和列表不一致，所以显示从列表获取*/
    let listTaskDetail = null;
    this.state.taskStore.taskList.forEach(item => {
      if (item.taskId.toString() === this.state.taskId.toString()) {
        listTaskDetail = item
      }
    })
    return d ? (
      <div style={{height:"100%",overflow:"hidden"}}>
        <Header headerTilte={"考试说明"} headerFlag={"examTask"}/>
        <div className='examDetail'>
          <p><img src="http://supershoper.xxynet.com/vsvz1534251902571" alt={'考试'}/></p>
          <Info taskDetail={d} listTaskDetail={listTaskDetail} ishistory={this.state.ishistory}/>
          <div className='btn'>
          <span className={this.state.ishistory === '2' ? '' : 'none'} style={{'display': 'block'}}
                onClick={() => this.state.taskStore.examPaper(this)}>开始考试</span>
            <span className={this.state.ishistory === '1' ? '' : 'none'} style={{'display': 'block'}}
                  onClick={() => this.state.taskStore.detailPaper(this)}>查看详情</span>
          </div>
          <MessageInfo data={this.state.taskStore.infoData} btn={this.state.taskStore.confirm} self={this}/>
          {/*<PositionedSnackbar onRef={(ref)=>{this.state.taskStore.snackbar = ref;}} />*/}
        </div>

      </div>
    ) : (<Loading/>)
  }
}

const Info = (props) => {
  console.log(props)
  let d = props.taskDetail;
  return (
    <div>
      {props.ishistory === '2' ? <p>本次考试时间<span>{(d.examTime || null) + '分钟'}</span></p> :
        <p className={'score'}>本次考试得分<span>{d.allScore}</span></p>}
      <div>
        {d.totalScore !== 0 && <span>满分</span>}
        {d.totalScore !== 0 && <span className='changeRed'>{d.totalScore}</span>}
        {d.totalScore !== 0 && <span>/</span>}
        <span>及格分</span>
        <span className='changeRed'>{d.examPassScore}</span>
      </div>
    </div>
  )
}
export default observer(hot(module)(ExamTask));
