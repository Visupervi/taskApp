import {observable, flow} from "mobx";
import {HTTPCnst} from "../../service/httpCnst.js"
import appStore from "../../sys/AppStore"
import {getQueryString} from "../../utils/getToken";
import {getExamQuestionInfoByExamId, getUserId} from "../../apis/Api";
// import {bindAppStore} from "../common_method/BindAppStore";
// import Shopguidehttp from '../service/ShopGuidehttp'
// import PositionedSnackbar from '../../components/snackbar/Snackbar'
// @bindAppStore

export default class TaskStore {
  constructor(appStore) {
    this.taskList = (appStore && appStore.taskList) || [];
    this.taskDetailMap = (appStore && appStore.taskDetailMap) || new Map();
    appStore.taskList = this.taskList;
    appStore.taskDetailMap = this.taskDetailMap;
    this.confirm = this.confirm.bind(this);
    this.sortTaskList = this.sortTaskList.bind(this);
    this.cache = TaskStore.taskMap
    /*this.cache.set('selectStyle',[{name:'全部类型',value:0}])*/
    this.isHistoryProps = {}
    this.isFinishValue = 0
    this.isShowHistory = false
  }
  @observable isShowHistory = false
  @observable isFinishValue = 0
  @observable static taskMap = new Map()
  @observable infoData = {};  //弹出确认信息
  @observable taskList = []; //任务列表
  @observable orderByData = new order();//排序方式
  @observable taskResult = {}; //任务结果 [得分，对数，错数，多久看答案(秒)，金币数，tid]
  @observable cache = new Map();
  @observable isHistoryProps = {}
  @observable taskDetailMap = new Map(); //任务详情
  @observable isLoading = false;
  @observable static err = undefined;
  @observable static lastReqTime = 0;//@fixme
  @observable savetime = new Date();  //记录时间
  @observable pageData = {maxPage: 1, nowPage: 1, pageSize: 10, totalCount: 0};  //初始化页数
  sortTaskList = (obj) => {
    switch (obj.value) {
      case 1:
        this.orderByData.orderBy = 'null';
        break
      case 2:
        this.orderByData.orderBy = 'pubTimeDesc';
        break
      case 3:
        this.orderByData.orderBy = 'pubTimeAsc';
        break
      default:
        this.orderByData.orderBy = 'null';
    }
    this.loadTaskList()
  }
  getStyleList = flow(function* (n = 0) {
    /*flag:0: 首页， 1： 已完成 ， 2：未完成*/
    let url = `${HTTPCnst.shopguide_url}newTask/category?flag=${n}&accessToken=${getQueryString("accessToken")}`
    let result = yield fetch(url);
    const list = yield result.json()
    let temp = [];
    let historyTask = [{name: '历史任务', value: 4}]
    /*临时过滤陈列任务和巡店任务,同时去除数量*/
    list.dataObject.forEach((item) => {
      if (item.taskTypeId !== 48 && item.taskTypeId !== -2 && item.taskTypeId !== -1) {
        // let arr=new Object();
        let arr = {};
        // arr.name=item.taskTypeId===-3?item.taskTypeName:item.taskTypeName+"("+item.count+")"
        arr.name = item.taskTypeName;
        arr.value = item.taskTypeId
        temp.unshift(arr)
      }
    })
    if (n !== 0) {
      this.cache.set('selectStyle', temp)
    } else {
      let tempAll = temp.concat(historyTask)
      this.cache.set('selectStyle', tempAll)
    }
  })
  chooseType = (obj) => {
    /*转换抓到的数据*/
    switch (obj.value) {
      case -3:
        this.orderByData.taskType = 3;
        break
      case 13:
        this.orderByData.taskType = 4;
        break
      case 11:
        this.orderByData.taskType = 5;
        break
      case -2:
        this.orderByData.taskType = 7;
        break
      case -1:
        this.orderByData.taskType = 8;
        break
      case 4:
        this.toHistory();
        break
      default:
        this.orderByData.taskType = 3;
    }
    if (obj.value !== 4) {
      this.loadTaskList()
    }
  }
  toHistory = async () => {
    this.isHistoryProps = this.cache.get('isHistory')
    this.isHistoryProps.history.push(`/taskTabs?accessToken=${getQueryString("accessToken")}`);
    this.orderByData.isFinished = true;
    this.orderByData.isExpired = null;
    await this.getStyleList(1)
    await this.loadTaskList();
  }
  //历史任务中完成与未完成点击事件
  handleChangeFinish = (value) => {
    this.isFinishValue = value
    this.tabChange(value)
  }
  tabChange = async (value) => {
    this.orderByData.isExpired = value === 1 ? true : null;
    this.orderByData.isFinished = value === 1 ? false : true;
    await this.loadTaskList()
    // await this.getStyleList(value===1?2:1)
    await this.getStyleList(1)
  }
  /*获取任务列表*/
  loadTaskList = flow(function* (n = 0) {
    if (n === 1) {  //执行下拉加载
      this.pageData.nowPage++
    } else { //执行上拉刷新，默认第一页，数据清空
      this.pageData.nowPage = 1
      this.taskList.clear()
    }
    //添加参数
    let url = `${HTTPCnst.H5_url}user/task?pageSize=10&nowPage=${this.pageData.nowPage}&isFinished=${this.orderByData.isFinished}&isExpired=${this.orderByData.isExpired}&orderBy=${this.orderByData.orderBy}&taskType=${this.orderByData.taskType}&accessToken=${getQueryString("accessToken")}`
    //30sec
    this.isLoading = true;
    //TODO refactor http transform layer, to remove catch statement
    try {
      let result = yield fetch(url);
      const task = yield result.json()
      this.pageData.nowPage = task.nowPage;
      this.pageData.maxPage = task.maxPage;
      if (task && task.list && task.list.length > 0) {
        //应该复制数据到store中定义的详细字段
        this.isLoading = false;
        //this.taskList.clear()
        this.taskList.push(...task.list)
      } else {
        this.isLoading = false;
        if (this.taskList !== 0) {
          appStore.Snackbar.handleClick('没有更多数据')
        } else {
          // appStore.Snackbar.handleClick('暂无数据')
        }
      }
      this.lastReqTime = Date.now()

    } catch (err) {
      this.err = err;
      this.isLoading = false;
    }
    this.isLoading = false;
  })

  /*确认界面选择时的结果*/
  confirm(n, self) {
    let taskId = this.taskDetailMap.get('id'); //获取当前的ID//开始更新此条信息状态
    if (n === 'startexam') {
      this.updateExamTask(taskId, self); //提供跳转，去更新考试状态
    } else if (n === 'endExam') {
      this.infoData = {};  //关闭确认
      this.taskSubmit();  //去提交考试
    } else if (n === 'sumbit') { //提交考试
      this.infoData = {};  //关闭确认
      this.taskSubmit();  //去提交考试
    } else if (n === 'examList') { //返回考试列表
      this.infoData = {};  //关闭确认
      if (this.taskDetailMap.get('isOnline')) {
        // self.props.history.push(`/onlineexamlist`)
        self.props.history.go(-1);
      } else if (this.taskDetailMap.get('isGrowPath')) {
        /*let currentPathData=JSON.parse(sessionStorage.currentPathData)
        self.props.history.push(`/pathDetail/${currentPathData.pathId}&&${currentPathData.checkpointId}&&exam`)*/
        self.props.history.go(-1);
      } else {
        //self.props.history.push('/task'); //返回考试列表
        self.props.history.go(-2);
      }

    } else {
      this.infoData = {};//关闭确认页面
      this.pushHistory();
      this.isLoading = false;
    }
  }

  pushHistory() {
    let state = {
      title: "title",
      url: `__SELF__?accessToken=${getQueryString("accessToken")}`
    };
    window.history.pushState(state, state.title, state.url);
  }

  /*闭卷考试时，更新考试状态*/
  updateExamTask = async (taskID, self) => {
    let taskId = this.taskDetailMap.get('id'); //获取当前的ID
    let result = await fetch(`${HTTPCnst.shopguide_url}newTask/updateExamTask?newTaskId=${taskID}`);
    const task = await result.json();
    if (task.dataObject.value === '成功') {
      self.props.history.push('/examPaper/' + taskId + "?accessToken=" + getQueryString("accessToken"));
    } else {
      appStore.Snackbar.handleClick('更新状态失败!')
    }
  }
  /*是否跳转到考试界面,判断是否是闭卷考试*/
  examPaper = (self) => {
    let taskId = this.taskDetailMap.get('id'); //获取当前的ID
    let taskDetail = this.taskDetailMap.get(taskId);
    if (taskDetail.questions.length < 1) {
      appStore.Snackbar.handleClick('此任务中没有考题');
      setTimeout(function () {
        self.props.history.push(`/task?accessToken=${getQueryString("accessToken")}`);
      }, 3000);
      return
    }
    sessionStorage.time = (new Date()).getTime()
    if (taskDetail.closed === 1) {
      if (taskDetail.hasExam === 1) {
        this.infoData = {
          content: '您已经进入过考试，无法再次考试，请联系管理员！',
          btnTitle1: '取消',
          btnTitle2: '确定',
          no: 'cancel',
          yes: 'cancel'
        }
      } else {
        this.infoData = {
          content: '提示: 本次考试不允许中途退出！',
          btnTitle1: '稍后开始',
          btnTitle2: '立刻开始',
          no: 'cancel',
          yes: 'startexam'
        }
      }
    } else {
      self.props.history.push(`/examPaper/${taskId}?accessToken=${getQueryString("accessToken")}`);
    }

  }
  /*显示考试的详情*/
  detailPaper = async (self) => {
    let taskId = this.taskDetailMap.get('id'); //获取当前的ID
    await this.getAfterExamTask(taskId);  //获取有答案的详情
    if (this.taskDetailMap.get(taskId).hasOwnProperty('value')) {
      appStore.Snackbar.handleClick('任务没有数据!')
      setTimeout(() => {
        self.props.history.push(`/taskTabs?accessToken=${getQueryString("accessToken")}`)
      }, 2000)
    } else {
      self.props.history.push('/examPaper/' + taskId+"?accessToken=" + getQueryString("accessToken"));
    }

  }
  /*开始考试任务*/
  getExamTask = flow(function* (taskID) {
    /*if(!sessionStorage['accessToken']){
        this.getToken();
    }*/
    /* 判断taskid是否存在*/
    try {
      let result = yield fetch(`${HTTPCnst.shopguide_url}newTask/getExamList?newTaskId=${taskID}&accessToken=${getQueryString("accessToken")}&version=1.0`);
      const task = yield result.json();
      this.taskDetailMap.set(taskID, task.dataObject);
      this.taskDetailMap.set('id', taskID);
      this.taskDetailMap.set('history', false);  //1是未完成任务
      this.taskResult.isShowRight = this.taskResult.showAnswer > 0 ? false : true;  //是否显示答案
    } catch (err) {
      this.err = err;
    }
  })
  /*获取已完成的任务*/
  getAfterExamTask = flow(function* (taskID) {
    /*if(!sessionStorage['accessToken']){
        this.getToken();
    }*/
    try {
      let result = yield fetch(`${HTTPCnst.shopguide_url}newTask/getExamAfterList?newTaskId=${taskID}&accessToken=${getQueryString("accessToken")}`);
      const task = yield result.json();

      console.log("task",task);
      if(parseInt(task.code) === 102){
        this.taskDetailMap.set(taskID, task.dataObject);
        this.taskDetailMap.set('id', taskID);
        this.taskDetailMap.set('history', true);  //2是已经完成任务
        this.taskResult.isShowRight = this.taskResult.showAnswer > 0 ? false : true;  //是否显示答案

      } else {
        appStore.Snackbar.handleClick(task.dataObject.value);
        this.props.history.go(-1);
      }
    } catch (err) {
      this.err = err;
    }
  })
  /*确认是否提交,判断是否每题必填，如果isAnswer=1每题必填*/
  checkSumbit=(self)=>{
    if(this.isLoading){
      return false
    }else{
      this.isLoading=true
    }
    let taskId=this.taskDetailMap.get('id'); //获取当前的ID
    let taskDetail=this.taskDetailMap.get(taskId);
    if(taskDetail.isAnswer===1){ //需要判断，因为必答
      let allAnswer='';
      taskDetail.questions.forEach((items)=>{
        let oneAnswer=0;
        if(items.questionType===3 || items.questionType===4){
          oneAnswer=1;
          items.answers.forEach((item)=>{
            if(item.content.length>0){
              oneAnswer=oneAnswer+'1'
            }else{
              oneAnswer=oneAnswer+'0'
            }
          })
        }else {
          items.answers.forEach((item)=>{
            if(item.checked){
              oneAnswer=1
            }
          })
        }

        allAnswer=allAnswer+oneAnswer; //确定每题是否有选择，不存在被选中，则返回false
      })
      if(allAnswer.indexOf('0') !== -1){
        appStore.Snackbar.handleClick('存在未完成的考题!')
        this.isLoading=false;
        return false
      }
    }
    this.infoData={
      content:'确认提交试卷！',
      btnTitle1:'取消',
      btnTitle2:'确定',
      no:'cancel',
      yes:'endExam'
    };
  }
  /*提交任务*/
  taskSubmit = flow(function* (force = false) {
    if (!force) {
      if (this.lastReqTime && Date.now() - this.lastReqTime < 1000 * 30) {
        return
      }
    }
    let taskId = this.taskDetailMap.get('id'); //获取当前的ID
    let taskDetail = this.taskDetailMap.get(taskId);
    let examId = taskDetail.examId; //获取考试id
    let questions = [];
    /*遍历获取答案*/
    taskDetail.questions.forEach((items) => {
      let temp = {};
      temp.questionid = items.questionId;
      temp.answerids = [];
      items.answers.forEach((item) => {
        if (item.checked && items.questionType === 0) {
          temp.answerids.push({
            'answerId': item.answerId,
            'isRight': item.isRight
          })
        } else if(items.questionType === 3 || items.questionType===4){
          temp.answerids.push({
            "answerId":item.answerId,
            "content":item.content
          })
        }
      })
      questions.push(temp);
    })
    let curObject = {
      'examId': examId,
      'questionids': questions
    }
    let answer = {
      'curObject': encodeURIComponent(JSON.stringify(curObject)),
      'version': 4
    }
    if (this.taskDetailMap.get('isGrowPath')) {
      curObject.taskId = taskId
    } else if (this.taskDetailMap.get('isOnline')) {
      answer.examId = examId;
      curObject.taskId = 0
    } else {
      answer.newTaskId = taskId;
      curObject.taskId = 0
    }
    let url = '';
    for (let item in answer) {
      url += `&${item}=${answer[item]}`
    }
    try {
      if (this.taskDetailMap.get('isGrowPath')) {
        let pathResult = yield fetch(`${HTTPCnst.shopguide_url}bms/exam/result/growup/save?${url}&accessToken=${getQueryString("accessToken")}`);
        const pathTask = yield pathResult.json();
        let results = pathTask.dataObject;
        if (results) {
          this.taskResult = {
            ...this.taskResult,
            score: results[0],
            right_num: results[1],
            error_num: results[2],
            isShowAnswer: results[3], //
            gold: results[4],  //金币数
            isShowRight: false,  //是否显示答案
            showDetail: true,  //是否显示面板
            hasSumbit: true   //已经提交
          }
          this.taskResult.isShowRight = this.taskResult.isShowRight > 0 ? false : true;  //是否显示答案
          let id = this.taskDetailMap.get('id');
          this.taskResult.pass = parseInt(this.taskResult.score, 10) >= (this.taskDetailMap.get(id).examPassScore) ? 1 : 0;   //1显示通过0不通过
          this.infoData = {};  //关闭确认
          this.isLoading = false;
        }
        //记录结果信息
        let obj = JSON.parse(sessionStorage.currentPathData)
        obj.examId = this.taskDetailMap.get('id');
        obj.score = results[0];
        obj.time = (new Date()) - this.savetime;
        obj.accessToken = sessionStorage.accessToken
        delete obj.checkpointFlag;
        let objUrl = '';
        for (let ite in obj) {
          objUrl += `&${ite}=${obj[ite]}`
        }
        let saveResult = yield fetch(`${HTTPCnst.growup_url}user/exam/result.do?${objUrl}`, {'delAuthorization': true});
        const savePathResult = yield saveResult.json();
      } else if (this.taskDetailMap.get('isOnline')) {
        appStore.Loading.show()
        let pathResult = yield fetch(`${HTTPCnst.shopguide_url}exam/submit?accessToken=${getQueryString("accessToken")}`, {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          "body": url+"&useTime=151",
          "method": "POST"
        });
        const pathTask = yield pathResult.json();
        appStore.Loading.hidden()
        let results = pathTask.dataObject;
        if (pathTask.code !== 102) {
          appStore.Snackbar.handleClick(results.value)
          return false
        }
        if (results) {
          this.taskResult = {
            ...this.taskResult,
            score: results[0],
            right_num: results[1],
            error_num: results[2],
            isShowAnswer: results[3]=== 0 ? results[3] : 0, //
            gold: results[4],  //金币数
            isShowRight: false,  //是否显示答案
            showDetail: true,  //是否显示面板
            hasSumbit: true   //已经提交
          }
          this.taskResult.isShowRight = this.taskResult.isShowRight > 0 ? false : true;  //是否显示答案
          let id = this.taskDetailMap.get('id');
          this.taskResult.pass = parseInt(this.taskResult.score) >= (this.taskDetailMap.get(id).examPassScore) ? 1 : 0;   //1显示通过0不通过
          this.infoData = {};  //关闭确认
          this.isLoading = false;
        }
      } else {
        appStore.Loading.show();
        let taskResult = yield fetch(`${HTTPCnst.shopguide_url}newTask/addGameTaskStatistics?accessToken=${getQueryString("accessToken")}`, {
          "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          "body": url,
          "method": "POST"
        });
        const task = yield taskResult.json();
        appStore.Loading.hidden();
        let obj = yield this.getUserId();
        console.log("obj",obj.sysUserId);

        let result = task.dataObject;
        getExamQuestionInfoByExamId({
          "accessToken": getQueryString("accessToken"),
          "examId": examId,
          "sid": result[3],
          "userId": obj.sysUserId,
          "version":"1.0"

        });
        if (result) {
          this.taskResult = {
            ...this.taskResult,
            score: result[0],
            right_num: result[1],
            error_num: result[2],
            isShowAnswer: result[3], //
            gold: result[4],  //金币数
            isShowRight: false,  //是否显示答案
            showDetail: true,  //是否显示面板
            hasSumbit: true   //已经提交
          }
          this.taskResult.isShowRight = this.taskResult.isShowRight > 0 ? false : true;  //是否显示答案
          let id = this.taskDetailMap.get('id');
          this.taskResult.pass = this.taskResult.score >= (this.taskDetailMap.get(id).examPassScore) ? 1 : 0;   //1显示通过0不通过
          this.infoData = {};  //关闭确认
          this.isLoading = false;
        }
      }
    } catch (err) {
      this.err = err;
    }
  });

  async getUserId () {
    let res = await getUserId({
      "accessToken":getQueryString("accessToken")
    })
    return res;
  }

  /*详情*/
  taskDetails(task, self) {
    switch (task.templateFlag) {
      case '5':
        this.props.history.push("/examTask/" + task.taskId + '&&' + (self.props.isHistory ? '1' : '2')+'?accessToken='+getQueryString("accessToken"));
        break;   //考试任务2为历史
      case '6':
        this.props.history.push({
          pathname: '/businessSchoolDetail/' + encodeURI(encodeURIComponent(task.relElementIds + '&&task' + '&&' + task.taskId + '&&' + (self.props.isHistory ? '1' : '2')))+"?accessToken="+getQueryString("accessToken"),
          query: 'clear'
        })
        break;  //课程任务
      case '10':
        this.props.history.push('/articledetails/' + task.relElementIds + '&&' + task.taskId + '&&' + (self.props.isHistory ? '1' : '2'))
        break;  //文章任务
      // case '53': this.props.history.push('/sharearticle/'+task.relElementIds+'&&'+task.taskId+'&&'+(self.props.isHistory?'1':'2'))
      //     break; //分享
      case '44': //调研
        this.props.history.push('/survey/' + task.taskId + '&&' + (self.props.isHistory ? '1' : '2'+'?accessToken='+getQueryString("accessToken")+"&pageUrl="+task.pageUrl));
        sessionStorage.pageUrl = task.pageUrl;
        break;
      default:
        appStore.Snackbar.handleClick('暂未开发')
    }
  }
}

class order {
  isFinished = false;
  isExpired = false;
  orderBy = 'null';
  taskType = 3
}
