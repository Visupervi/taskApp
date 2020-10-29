import React, {Component} from 'react';
import {observer} from "mobx-react";
import {action} from "mobx";
import "./onlineExamPaper.scss"
import TaskStore from '../../../service/TaskStore';
import appStore from "../../../sys/AppStore";
import MessageInfo from '../../../component/messageInfo/messageInfo'
import {CommonInterface} from "../../../utils/CommonInterface";
import {Platform} from "../../../sys/Platform";
import {getQueryString} from "../../../utils/getToken";
import Header from "../../../component/header/header";

/*分页考试*/
@observer
class OnlineExamPaper extends Component {
  constructor(props) {
    super(props)
    let ts = new TaskStore(appStore)
    let detail = ts.taskDetailMap.get(props.match.params.taskId);
    let history = ts.taskDetailMap.get('history')  //true历史试卷还是任务试卷
    let taskResult = {
      examPassScore: detail.examPassScore, //通过分数
      closed: detail.closed, //是否闭卷 封闭考试：0，否；1，是
      showtype: detail.showType,  //每页显示一条还是显示多条1:单条展示
      hasExam: detail.hasExam, //是否已经进入过考试（封闭考试）1已经考过了
      examType: detail.examType, //试卷类型
      isAnswer: detail.isAnswer, //是否每题必选1是
      examTime: detail.examTime,  //考试时间
      examId: detail.examId,  //考试id
      showAnswer: detail.showAnswer //还有多久显示答案
    }
    /*showanswer0：只显示答题结果 1：显示答案解析 2: 只显示答题对错(不显示解析)*/
    this.state = {
      taskStore: ts,
      taskId: props.match.params.taskId,
      isShowRight: history ? true : false,
      pass: ts.taskResult.pass,
      detail,
      taskResult,
      pageIndex: 0,  /*用于每页显示一条时想，记录页数*/
      remainTime: null,  //考试剩余时间
      history,
      activeN: 1,//选择是否查看错题，默认查看全部
      errorQuestions: [],
    }
    if (!history) {
      this.pushHistory();
      this.resetTime(taskResult.examTime * 60 * 1000)
      if (this.state.detail.closed === 1) { //是闭卷考试,不查询答案
        window.addEventListener("popstate", function (e) {  //回调函数中实现需要的功能
          ts.infoData = {
            content: '提示: 本次考试不允许中途退出！',
            btnTitle1: '暂不退出',
            btnTitle2: '确认提交',
            no: 'cancel',
            yes: 'sumbit'
          }
          /*self.pushHistory()*/
        }, false);
      } else {
        window.addEventListener("popstate", function (e) {  //回调函数中实现需要的功能
          ts.infoData = {
            content: '提示: 是否确认退出！',
            btnTitle1: '暂不退出',
            btnTitle2: '确认退出',
            no: 'cancel',
            yes: 'examList'
          }
          /*self.pushHistory()*/
        }, false);
      }
    }
    if (!this.state.detail.questions || this.state.detail.questions < 1) { //当题目数量为0 时，给提示，返回任务页
      if (this.state.taskStore.taskDetailMap.get('isGrowPath')) {
        /*let currentPathData=JSON.parse(sessionStorage.currentPathData)
        this.props.history.replace(`/pathDetail/${currentPathData.pathId}&&${currentPathData.checkpointId}&&exam`)*/
        this.props.history.go(-2);
      } else if (this.state.taskStore.taskDetailMap.get('isOnline')) {
        /*this.props.history.replace(`/onlineexamlist`)*/
        if (this.state.history) {
          this.props.history.go(-1);
        } else {
          this.props.history.go(-2);
        }
      } else {
        //this.props.history.replace('/task')
        this.props.history.go(-2);
      }
      return
    }
    CommonInterface.setTitle(this.state.detail.examTitle || '正在考试');
  }

  time = sessionStorage.time; //初始化时间
  componentDidMount() {
    this.chooseErr()
  }

  chooseErr() {
    console.log("1212121");
    let tempQues = this.state.detail ? this.state.detail.questions.filter(item => !item.right) : [];
    console.log("tempQues",tempQues);
    this.setState({errorQuestions: tempQues})
  }

  componentWillUnmount() {
    let self = this
    window.removeEventListener('popstate', function (e) {
      self.pushHistory()
    }, false);
  }

  pushHistory() {
    // debugger
    if (window.location.href.indexOf('onlineExamPaper') < 0) {
      return
    }
    let state = {
      title: "title",
      url: `__SELF__?accessToken=${getQueryString("accessToken")}`
    };
    window.history.pushState(state, state.title, state.url);
  }

  @action
  single = (item, curDate) => {  //保存选中数据
    if (this.state.history) return
    curDate.answers.map(qs => qs.checked = false)
    item.checked = true;
    item.isRight === '0' ? curDate.right = true : curDate.right = false;
    // this.state.detail.questions.forEach((items)=>{
    //     if(items.answerId.indexOf(curDate.answerId)>=0)
    //         items.answers.forEach((item)=>{
    //             if(curDate.answerId===item.answerId){
    //                 item.checked=true;
    //                 item.isRight==='0'?items.right=true:items.right=false
    //             }else{
    //                 item.checked=false;
    //             }
    //         })
    // })
    this.forceUpdate()
  };

  mul(item, curDate) { //多个选择
    if (this.state.history) return;
    item.checked = !item.checked;
    let ErrorNumber = 0
    curDate.answers.map(qs => {
      !((qs.isRight === '0' && qs.checked === true) || (qs.isRight === '1' && qs.checked === false)) && ErrorNumber++
    })
    ErrorNumber === 0 ? curDate.right = true : curDate.right = false
    this.forceUpdate()
  }

  async showError(n) {
    console.log("1212121",n);

    if (n === 1) {
      window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
      // if (this.state.taskStore.taskDetailMap.get('isOnline')) {
      //   //this.props.history.replace(`/onlineexamlist`)
      //   if (sessionStorage.isNotification === '1') {
      //     Platform.config(window.location.href, ['closeWindow']).then((res) => {
      //       Platform.close()
      //     })
      //   }
      //   if (this.state.history) {
      //     this.props.history.go(-1);
      //   } else {
      //     this.props.history.go(-2);
      //   }
      //
      // } else {
      //   // this.props.history.replace('/task')
      //   if (this.state.history) {
      //     this.props.history.go(-1);
      //   } else {
      //     this.props.history.go(-2);
      //   }
      // }
    }
    if (n === 2) {
      if (this.state.taskStore.taskDetailMap.get('isOnline')) {
        /*正式考试期间无法查看答案*/
        if (this.state.detail && this.state.detail.examSpecies === 1 && ((new Date()).getTime() < this.state.detail.endTime.time)) {
          appStore.Snackbar.handleClick('答案保护期，无法查看答案')
          return
        }
        this.chooseErr()
        if (this.state.detail.showAnswer !== 1) {
          this.state.isShowRight = true
        }
        this.state.taskStore.taskResult.showDetail = false;
        // this.state.isShowRight = true
        this.state.pageIndex = 0;
        this.state.history = true;
        this.forceUpdate();
        let doc = document.querySelector('#onlineExamPaper');
        doc.scrollTop = 0
      } else {
        if (this.state.detail && this.state.detail.showAnswer > 1) {
          appStore.Snackbar.handleClick('答案保护期，无法查看答案')
          /*setTimeout(()=>{self.props.history.replace('/task')},3000)*/
          return
        }
        this.state.taskStore.taskResult.showDetail = false;
        await this.state.taskStore.getAfterExamTask(this.state.taskId);
        this.state.pageIndex = 0;
        let detail = await this.state.taskStore.taskDetailMap.get(this.state.taskId);
        this.setState({detail: detail});
        /*this.setState({'isShowRight':true});*/
      }

    }
    if (n === 3) {
      if (this.state.taskStore.taskDetailMap.get('isOnline')) {
        //this.props.history.replace(`/onlineexamlist`)
        // if (sessionStorage.isNotification === '1') {
        //   Platform.config(window.location.href, ['closeWindow']).then((res) => {
        //     Platform.close()
        //   })
        // }
        if (this.state.history) {
          window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
          //this.props.history.go(-1);
        } else {
          window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
          //this.props.history.go(-1);
        }
      } else {
        if (this.state.history === true) {
          // this.props.history.replace('/taskTabs')
          // this.props.history.go(-2);
          window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
        } else {
          // this.props.history.replace('/task')
          window.location.replace('http://ektest.chaojidaogou.com/index/course/#/study/task?accessToken='+getQueryString("accessToken"));
        }
      }
    }
  }

  resetTime(times) {  //使用分钟作为参数
    let self = this;
    var timer = null;
    let setTime = ((new Date()).getTime()) + times
    timer = setInterval(function () {
      let hour = 0,
        minute = 0,
        second = 0;//时间默认值
      let extraTime = Math.floor((setTime - ((new Date()).getTime())) / (1000))
      if (extraTime > 0) {
        hour = Math.floor(extraTime / (60 * 60));
        minute = Math.floor(extraTime / 60) - (hour * 60);
        second = Math.floor(extraTime) - (hour * 60 * 60) - (minute * 60);
      }
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      // console.log(day+"天:"+hour+"小时："+minute+"分钟："+second+"秒");
      self.setState({remainTime: `${hour}:${minute}:${second}`})
      //如果时间耗尽，自动提交考试
      if (self.state.isShowRight || self.state.taskStore.taskResult.pass === 0 || self.state.taskStore.taskResult.pass === 1) {
        clearInterval(timer);
        return false
      }
      if (extraTime <= 0) {
        self.state.taskStore.taskSubmit(true)
        clearInterval(timer);
      }
      /*extraTime--;*/
    }, 1000);
  }

  queslist = (item, index) => {
    return (
      <div className={this.state.taskResult.showtype === '1' ? 'mulBtn' : 'btn'} key={item.questionId}>
        <Topic showtype={this.state.taskResult.showtype} currentData={item}
               index={this.state.taskResult.showtype === '1' ? this.state.pageIndex : index}
               articlePreviewImage={this.articlePreviewImage}/>
        <Options showtype={this.state.taskResult.showtype}
                 isShow={(index + 1) !== this.state.detail.questions.length} currentData={item}
                 single={this.single.bind(this)} mul={this.mul.bind(this)}
                 showAnswer={this.state.detail.showAnswer}
                 fillChange={this.fillChange.bind(this)}
                 history={this.state.history || this.state.taskStore.taskResult.pass === 0 || this.state.taskStore.taskResult.pass === 1}
                 articlePreviewImage={this.articlePreviewImage}/>
        <Analysis currentData={item} showAnswer={this.state.detail.showAnswer}
                  isShowRight={this.state.isShowRight}/>
      </div>
    )
  };
  fillChange(event,item){
    item.content=event.target.value;
    this.forceUpdate()
  }
  goTo = (n) => {  //跳转
    if (n > 0 && (this.state.pageIndex !== (this.state.detail.questions.length - 1))) {
      this.setState({pageIndex: this.state.pageIndex + n})
    }
    if (n < 0 && this.state.pageIndex !== 0) {
      this.setState({pageIndex: this.state.pageIndex + n})
    }
    this.forceUpdate();
  };

  clickClose() {
    let data = this.state.taskStore;
    data.taskResult.gold = '0';
    this.setState({taskStore: data})
  }

  handleChange = (n) => {
    if (this.state.errorQuestions && this.state.errorQuestions.length === 0) {
      return
    }
    this.setState({activeN: n, pageIndex: 0})
  };
  //预览图片
  articlePreviewImage = (e) => {
    let nowImgurl = e.target.currentSrc;
    //获取文章,排除非图片点击
    if (!nowImgurl) {
      return
    }
    if (nowImgurl) {
      Platform.previewImage(nowImgurl, [nowImgurl])
    }
    e.stopPropagation()
  };
  render() {
    let showtype = this.state.taskResult.showtype;
    let questions = this.state.activeN === 1 ? this.state.detail.questions : this.state.errorQuestions;   //默认是每页显示多条
    let currentData = questions && questions[this.state.pageIndex];  //如果是单条类型，每页显示一条
    let showButton = this.state.history ? true : this.state.taskStore.taskResult.hasSumbit
    return (
      <div id='onlineExamPaper' className={this.state.taskResult.showtype === '1' ? 'mul' : 'single'}>
        <Header headerTilte={this.state.detail.examTitle}/>
        <div className={(this.state.history) ? 'none' : 'remainTime'}><span>剩余时间({this.state.remainTime})</span></div>
        <div className={this.state.history ? 'tabHeader' : 'none'}>
          <span onClick={this.handleChange.bind(this, 1)}
                className={this.state.activeN === 1 ? 'active' : 'lose'}><b>全部</b></span>
          <span onClick={this.handleChange.bind(this, 2)}
                className={this.state.activeN === 2 ? 'active' : 'lose'}><b>只看错题</b></span>
        </div>
        <div className={(this.state.history) ? '' : 'bottomMar'}>
          <div>
            {showtype === '1' ? this.queslist(currentData) : questions.map(this.queslist.bind(this))}
            {showtype === '1' ?
              <Controlbar questions={questions} pageIndex={this.state.pageIndex} goTo={this.goTo}
                          submit={this.state.taskStore.checkSumbit} self={this}
                          history={this.state.history ? true : this.state.taskStore.taskResult.hasSumbit}
                          showError={this.showError.bind(this)}/>
              : <div className={'button'}
                     onClick={showButton ? () => this.showError(3) : this.state.taskStore.checkSumbit}>{showButton ? '返回列表' : '提交'}</div>

            }
          </div>

        </div>
        <DisplayResults clickClose={this.clickClose.bind(this)} result={this.state.taskStore.taskResult}
                        showError={this.showError.bind(this)} detail={this.state.detail}/>

        <MessageInfo data={this.state.taskStore.infoData} btn={this.state.taskStore.confirm} self={this}/>
      </div>
    )
  }
}

const Topic = (props) => {
  return (
    <div className='singleChoose'>
      <p className='title'>
        <i>{`${props.index + 1}.`}</i>
        <span dangerouslySetInnerHTML={{ __html: props.currentData.title }}></span>
        <em className={props.currentData && props.currentData.questionType === 0 ? 'single' : 'none'}>单选</em>
        <em className={props.currentData && props.currentData.questionType === 1 ? 'mul' : 'none'}>多选</em>
        <em className={props.currentData && props.currentData.questionType === 2 ? 'choose' : 'none'}>判断</em>
        <em className={props.currentData && props.currentData.questionType === 3 ? 'choose' : 'none'}>填空</em>
        <em className={props.currentData && props.currentData.questionType === 4 ? 'choose' : 'none'}>简答</em>
      </p>
      <div
        className={props.currentData && (props.currentData.question_pic || props.currentData.questionPic) ? 'img' : 'none'}>
        <img src={props.currentData && (props.currentData.question_pic || props.currentData.questionPic)}
             onClick={props.articlePreviewImage}
             alt="图片"/>
      </div>
    </div>
  );
}
function changeFont(font) {
  switch (font) {
    case 0: return '填空项①:';break;
    case 1: return '填空项②:';break;
    case 2: return '填空项③:';break;
    case 3: return '填空项④:';break;
    case 4: return '填空项⑤:';break;
    default:return null;
  }
}
const Options = (props) => {
  /*0:单选,1:多选,2:判断题,3: 填空题,4:简答题*/
  if (props.currentData && props.currentData.questionType === 0) {
    return (
      <div className='chooseBdoy singleChooseBody'>
        {props.currentData && props.currentData.answers && props.currentData.answers.map((item, index) => {
          return (
            <div className='item' key={index} onClick={() => props.single(item, props.currentData)}>
              <em className={item.checked ? 'iconfont icon-xuanzhong' : 'iconfont icon-weixuan'}></em>
              <span className='itemContent'>{item.content}</span>
              <span className={props.showAnswer === 1 && props.history ? 'showRW' : 'none'}><img
                className={item.isRight === '0' ? 'iconfont icon-duihao' : 'none'}
                src={'http://supershoper.xxynet.com/vsvz1582294674352'}/></span>
              <div className='item_img'>
                <img className={(item.anwserPic || item.answerPic) ? 'itemImg' : 'none'}
                     onClick={props.articlePreviewImage}
                     src={item.anwserPic || item.answerPic} alt='pic'/>
              </div>
            </div>
          )
        })}
        {/*{(props.showtype==='0'&& props.isShow) ? <hr className='onlineExamPaper_hr' /> : null}*/}
      </div>
    );
  }
  if (props.currentData && props.currentData.questionType === 1) {
    return (
      <div className='chooseBdoy mulChooseBody'>
        {props.currentData && props.currentData.answers && props.currentData.answers.map((item, index) => {
          return (
            <div className='item' key={index} onClick={() => props.mul(item, props.currentData)}>
              <em className={item.checked ? 'iconfont icon-dianzhong' : 'iconfont icon-fang'}></em>
              <span className='itemContent'>{item.content}</span>
              <span className={props.showAnswer === 1 && props.history ? 'showRW' : 'none'}><img
                className={item.isRight === '0' ? 'iconfont icon-duihao' : 'none'}
                src={'http://supershoper.xxynet.com/vsvz1582294674352'}/></span>
              <img className={(item.anwserPic || item.answerPic) ? 'itemImg' : 'none'}
                   onClick={props.articlePreviewImage}
                   src={item.anwserPic || item.answerPic} alt='pic'/>
            </div>
          )
        })}
        {/*{(props.showtype==='0'&& props.isShow) ? <hr className='onlineExamPaper_hr' /> : null}*/}
      </div>
    );
  }
  if(props.currentData && props.currentData.questionType === 2) {
    return (
      <div className='chooseBdoy estimateBody'>
        {props.currentData && props.currentData.answers && props.currentData.answers.map((item, index) => {
          return (
            <div className='item' key={index} onClick={() => {
              props.single(item, props.currentData)
            }}>
              <em className={item.checked ? 'iconfont icon-xuanzhong' : 'iconfont icon-weixuan'}></em>
              <span className='itemContent'>{item.content}</span>
              <span className={props.showAnswer === 1 && props.history ? 'showRW' : 'none'}><img
                className={item.isRight === '0' ? 'iconfont icon-duihao' : 'none'}
                src={'http://supershoper.xxynet.com/vsvz1582294674352'}/></span>
              <img className={(item.anwserPic || item.answerPic) ? 'itemImg' : 'none'}
                   onClick={props.articlePreviewImage}
                   src={item.anwserPic || item.answerPic} alt='pic'/>
            </div>
          )
        })}
        {/*{(props.showtype==='0'&& props.isShow) ? <hr className='onlineExamPaper_hr' /> : null}*/}
      </div>
    );
  }
  if(props.currentData && props.currentData.questionType === 3) {
    return (
      <div className='chooseBdoy fillBody'>
        {props.currentData && props.currentData.answers && props.currentData.answers.map((item, index) => {
          return (
            <div className='item' key={index}>
              <i>{changeFont(index)}</i>
              {props.history?<p className={'simulationInput'}>{item.content}</p>:<textarea cols="10"
                                                                                           rows="1"
                                                                                           wrap="off"
                                                                                           maxLength={21}
                                                                                           type="text"
                                                                                           placeholder={'请输入答案'}
                                                                                           value={item.content}
                                                                                           style={{
                                                                                             overflowY:"hidden",
                                                                                             resize:"none",
                                                                                             width:"79%",
                                                                                             verticalAlign:"top",
                                                                                             // heigth:"30px",
                                                                                             // lineHight:"30px",
                                                                                             padding:"0px",
                                                                                             textIndent:"10px",
                                                                                             border:"transparent",
                                                                                             outline:"transparent"
                                                                                           }}
                                                                                           onChange={(event)=>props.fillChange(event,item)}/>}
            </div>
          )
        })}
        {/*{(props.showtype==='0'&& props.isShow) ? <hr className='onlineExamPaper_hr' /> : null}*/}
      </div>
    );
  }
  if(props.currentData && props.currentData.questionType === 4) {
    return (
      <div className='chooseBdoy answerBody'>
        {props.currentData && props.currentData.answers && props.currentData.answers.map((item, index) => {
          return (
            <div className='item' key={index}>
              <p>{'请回答:'}</p>
              {props.history?<p className={'simulation'}>{item.content}</p>:<textarea maxLength={100}  type="text" placeholder={'回答问题，不超过100字'} value={item.content} onChange={(event)=>props.fillChange(event,item)}/>}
            </div>

          )
        })}
        {/*{(props.showtype==='0'&& props.isShow) ? <hr className='onlineExamPaper_hr' /> : null}*/}
      </div>
    );
  }
};
const Analysis = (props) => {
  return (
    <div className={(props.showAnswer === 1 || props.showAnswer === 2) && props.isShowRight ? 'analysis' : 'none'}>
      <div className={'row'}>
        <div className='title'>回答:</div>
        <em
          className={props.currentData && props.currentData.right ? 'iconfont icon-duihao' : 'iconfont icon-chahao'}></em>
      </div>
      <div className={props.showAnswer === 1 ? 'row' : 'none'}>
        <div className='title'>解析:</div>
        <div className='analysisContent'>
          {props.currentData && props.currentData.questionDescription}
        </div>
      </div>
    </div>
  )
}
const Controlbar = (props) => {
  return (
    <div className='controlbar'>
      <span onClick={() => props.goTo(-1)} className={props.pageIndex === 0 ? 'noClick' : 'goBack'}>上一题</span>
      <span className='footBar'><span>{props.pageIndex + 1}</span>/{props.questions && props.questions.length}</span>
      <span onClick={() => props.goTo(1)}
            className={props.pageIndex === (props.questions && props.questions.length - 1) ? 'none' : 'goTo'}>下一题</span>
      <span onClick={() => props.submit(props.self)}
            className={props.pageIndex === (props.questions && props.questions.length - 1) && !props.history ? 'goTo' : 'none'}>提交试卷</span>
      <span onClick={() => props.showError(3)}
            className={props.pageIndex === (props.questions && props.questions.length - 1) && props.history ? 'goTo' : 'none'}>返回列表页</span>
    </div>
  )
}
const DisplayResults = (props) => {
  console.log("onlineExamprops",props);
  return (
    <div className={props.result && props.result.showDetail ? 'DisplayResult' : 'none'}>
      <div className={props.result && props.result.gold !== '0' ? 'gold' : 'none'} onClick={() => props.clickClose()}>
                <span>
                    <img src="http://supershoper.xxynet.com/vsvz1543215902308" alt="gold"/>
                    <i>{`+ ${props.result && props.result.gold}`}</i>
                </span>
      </div>
      <div>
        <div className={props.result && props.result.pass === 1 ? 'showBlock pass' : 'showBlock fail'}>
          <img className='shanchu' onClick={() => props.showError(1)}
               src="http://supershoper.xxynet.com/vsvz1533280028295" alt="X"/>
          <div className='empty'>
            {props.result && props.result.pass === 1 ? <img
              src={(props.detail && props.detail.footerKsPassLogo) ? (props.detail.footerKsPassLogo + '?imageView2/1/w/220/h/170') : "http://supershoper.xxynet.com/vsvz1539677267519?imageView2/1/w/220/h/170"}
              alt=""/> : <img
              src={(props.detail && props.detail.footerKsFailLogo) ? (props.detail.footerKsFailLogo + '?imageView2/1/w/220/h/170') : "http://supershoper.xxynet.com/vsvz1539677064167?imageView2/1/w/220/h/170"}
              alt=""/>}
          </div>
          <div>
            <p className='score'><em>{props.result && (~~props.result.score)}</em><span>得分数/分</span></p>
            <p className='error'><em>{props.result && props.result.error_num}</em><span>错题数/道</span></p>
          </div>
          <div>
            <span onClick={() => props.showError(1)} className='tryOne'><b>以后再说</b></span>
            <span onClick={() => props.showError(2)} className='details'><b>查看明细</b></span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default OnlineExamPaper;
