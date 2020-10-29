import {HTTPCnst} from "../service/httpCnst";
import appStore from "/AppStore"
import {getQueryString} from "../utils/getToken";

export default function JumpFun(self, type, parms) {
  sessionStorage.isNotification = '1'
  const allJumpType = {
    'article_detail': async function () {
      let articleUrl = `${HTTPCnst.H5_url}cms/article/info?targetId=${parms.articleId}`;
      let articleresult = await fetch(articleUrl);
      const article = await articleresult.json()
      if (article) {
        if (parseInt(article.delFlag) === 1) {//判断是否已过期
          self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，当前内容不存在')}`)
          sessionStorage.messageroute = 'errorpage';
          return
        }
        if (article.endTime) {
          // let endTime = article.endTime.substr(0,19).replace('T',' ').replace(/-/g,'/')
          if ((new Date().getTime()) > (parseInt(article.endTime) * 1000)) {//判断是否已过期
            self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，内容已过期')}`)
            sessionStorage.messageroute = 'errorpage';
            return
          }
        }
        sessionStorage.messageroute = 'articledetails';
        self.props.history.replace(`/articledetails/${parms.id}`)
      } else {
        self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，当前内容不存在')}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
    },
    'pk_detail': async function () {
      let getPkInfo = `${HTTPCnst.om_si_url}storemanagement/pk/pk/queryDetaiRemind.do?accessToken=${sessionStorage.accessToken}&pkId=${parms.pkId}`;
      let pkInfoResult = await fetch(getPkInfo, {'delAuthorization': true});
      let pkInfo = await pkInfoResult.json();
      if (pkInfo && pkInfo.isSucceed && pkInfo.data) {
        let playerCountType = pkInfo.data.playerCountType;
        if (pkInfo.data.endDate) {//判断是否已过期
          if ((new Date().getTime()) > (new Date(pkInfo.data.endDate.replace(/-/g, '/')).getTime())) {
            self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，内容已过期')}`)
            sessionStorage.messageroute = 'errorpage';
            return
          }
        }
        if (pkInfo.data.deleteFlag) {//判断是否已删除
          self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，内容不存在')}`)
          sessionStorage.messageroute = 'errorpage';
          return
        }
        playerCountType === 0 ?// 0—— 排行榜 1—— 1V1
          (self.props.history.replace(`/ranklist/${parms.pkId}`))
          : (self.props.history.replace(`/singlePK/${parms.pkId}`))
      } else {
        self.props.history.replace(`/errorpage/${encodeURIComponent(pkInfo.message || '抱歉，该内容不存在')}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      // sessionStorage.messageroute = 'pk_detail';
    },
    'pk_list': function () {
      self.props.history.replace(`/pk`)
      // sessionStorage.messageroute = 'pk_list';
    },
    'activity_list': function () {
      self.props.history.replace(`/activity`)
    },
    'activity_detail': async function () {
      let getActivityInfo = `${HTTPCnst.shopguide_url}activity/byId?accessToken=${sessionStorage.accessToken}&activityId=${parms.actId}`;
      let ActivityInfoResult = await fetch(getActivityInfo);
      let activityInfo = await ActivityInfoResult.json();
      if (activityInfo && activityInfo.value) {//报错页面
        self.props.history.replace(`/errorpage/${encodeURIComponent(activityInfo.value)}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      if (activityInfo && activityInfo.dataObject) {
        if (activityInfo.dataObject.value) {//请求成功 无内容情况提醒
          self.props.history.replace(`/errorpage/${encodeURIComponent(activityInfo.dataObject.value)}`)
          sessionStorage.messageroute = 'errorpage';
          return
        }
        if (parseInt(activityInfo.dataObject.delFlag) === 1) {//内容已删除
          self.props.history.replace(`/errorpage/${encodeURIComponent('抱歉，内容不存在')}`)
          sessionStorage.messageroute = 'errorpage';
          return
        }
        let actType = activityInfo.dataObject.actType;
        let materialUrl = activityInfo.dataObject.materialUrl;
        actType === 0 ?// 0 活动 1专题活动
          (self.props.history.replace(`/activitydetails/${parms.actId}`))
          : (window.location.replace(materialUrl.replace(/\$userId/g, JSON.parse(sessionStorage.userInfo).sysUserId).replace(/\$access_token/g, sessionStorage.accessToken)))
      }
      // sessionStorage.messageroute = 'activity_detail';
    },
    'task_survey': async function () {
      let getTaskInfo = `${HTTPCnst.shopguide_url}task/info?accessToken=${getQueryString("accessToken")}&taskId=${parms.id}`;
      let taskInfoResult = await fetch(getTaskInfo);
      let taskInfo = await taskInfoResult.json();
      let taskdetailInfo = taskInfo.dataObject
      if (taskdetailInfo.value) {
        self.props.history.replace(`/errorpage/${encodeURIComponent(taskdetailInfo.value)}?accessToken=${getQueryString("accessToken")}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      /*finishFlag 0默认空,1进行中, 2未领奖,3已完成 4 错误,5(陈列任务待审核状态，等待指定的人审核是否合格，是否打回重新做)*/
      let isHistory = (taskdetailInfo.finishFlag === '2' || taskdetailInfo.finishFlag === '3' || taskdetailInfo.finishFlag === '5') ? '1' : '2'
      sessionStorage.pageUrl = taskdetailInfo.pageUrl;
      self.props.history.replace('/survey/' + taskdetailInfo.taskId + '&&' + isHistory+"accessToken="+getQueryString("accessToken"));
      // sessionStorage.messageroute = 'task_survey';
    },
    'task_study': async function () {
      let getTaskInfo = `${HTTPCnst.shopguide_url}task/info?accessToken=${getQueryString("accessToken")}&taskId=${parms.id}`;
      let taskInfoResult = await fetch(getTaskInfo);
      let taskInfo = await taskInfoResult.json();
      let taskdetailInfo = taskInfo.dataObject
      if (taskdetailInfo.value) {
        self.props.history.replacereplace(`/errorpage/${encodeURIComponent(taskdetailInfo.value)}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      /*finishFlag 0默认空,1进行中, 2未领奖,3已完成 4 错误,5(陈列任务待审核状态，等待指定的人审核是否合格，是否打回重新做)*/
      let isHistory = (taskdetailInfo.finishFlag === '2' || taskdetailInfo.finishFlag === '3' || taskdetailInfo.finishFlag === '5') ? '1' : '2'
      switch (taskdetailInfo.templateFlag) {
        case '5':
          self.props.history.replace("/examTask/" + taskdetailInfo.taskId + '&&' + isHistory);
          break;   //考试任务2为历史
        case '6':
          self.props.history.replace({
            pathname: '/businessSchoolDetail/' + encodeURI(encodeURIComponent(taskdetailInfo.relElementIds + '&&task' + '&&' + taskdetailInfo.taskId + '&&' + isHistory))+"?accessToken="+getQueryString("accessToken"),
            query: 'clear'
          })
          break;  //课程任务
        case '10':
          self.props.history.replace('/articledetails/' + taskdetailInfo.relElementIds + '&&' + taskdetailInfo.taskId + '&&' + isHistory)
          break;  //文章任务
        // case '53': this.props.history.push('/sharearticle/'+task.relElementIds+'&&'+task.taskId+'&&'+(self.props.isHistory?'1':'2'))
        //     break; //分享
        //   debugger
        case '44': //调研
          sessionStorage.pageUrl = taskdetailInfo.pageUrl;
          self.props.history.replace('/survey/' + taskdetailInfo.taskId + '&&' + isHistory+"accessToken="+getQueryString("accessToken"));
          break;
        default:
          appStore.Snackbar.handleClick('暂未开发此任务')
      }
      // sessionStorage.messageroute = 'task_study';
    },
    'task_onlineExam': async function () {
      /*状态：ongoing= 进行中，跳转考试页，completed = 已完成，还未结束，跳转详情页，提示信息,end = 已结束，跳转查看详情页，invalid = 已失效*/
      let getOnlineExamInfo = `${HTTPCnst.shopguide_url}exam/getUserExamQuestionInfoByExamId?accessToken=${sessionStorage.accessToken}&examId=${parms.id}`;
      let onlineExamResult = await fetch(getOnlineExamInfo);
      let onlineExamInfo = await onlineExamResult.json();
      let onlineExamdetailInfo = onlineExamInfo.dataObject
      if (onlineExamdetailInfo.status === 'completed') {
        sessionStorage.onlineTab = '1'
        self.props.history.replace({
          pathname: `/examexplain/${encodeURIComponent(JSON.stringify({examId: parms.id}))}?accessToken=${getQueryString("accessToken")}`,
          query: {status: 'completed'}
        })
        return
      } else if (onlineExamdetailInfo.status === 'end') {
        sessionStorage.onlineTab = '1'
      } else if (onlineExamdetailInfo.status === 'invalid') {
        self.props.history.replace(`/errorpage/${encodeURIComponent('此任务已失效')}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      self.props.history.replace(`/examexplain/${encodeURIComponent(JSON.stringify({examId: parms.id}))}?accessToken=${getQueryString("accessToken")}`)
      // sessionStorage.messageroute = 'task_onlineExam';
    },
    'question_answerCenter': function () {
      self.props.history.replace(`/questionAnswerCenter`)
      sessionStorage.messageroute = 'questionAnswerCenter';
    },
    'question_answerDetails': async function () {
      let getBbsQuestionInfoUrl = `${HTTPCnst.shopguide_url}bbs/getBbsQuestionInfo?accessToken=${sessionStorage.accessToken}&questionId=${parms.id}&version=1`;
      let questionInfoResult = await fetch(getBbsQuestionInfoUrl);
      let answerList = await questionInfoResult.json();
      let temp = answerList.dataObject
      if (typeof (temp) === "string") {
        self.props.history.replace(`/errorpage/${encodeURIComponent(temp)}`)
        sessionStorage.messageroute = 'errorpage';
        return
      }
      temp.qContext = answerList.dataObject.QContext
      temp.tagType = answerList.dataObject.bbsTagTypes.length > 0 ? answerList.dataObject.bbsTagTypes[0].typeName : ''
      temp.qId = answerList.dataObject.QId
      // id为问题id
      sessionStorage.messageroute = 'questionAnswerDetails';
      self.props.history.push({pathname: `/questionAnswerDetails/${parms.id}/null`, state: temp})
    },
    'learnPath_detail': function () {
      window.location.replace(`${HTTPCnst.h5_mb_collections}h5-mb-collections/learnPath/#/pages/index/index?accessToken=${sessionStorage.accessToken}&state=${type}/id:${parms.id}`)
    },
    'learnPath_job': function () {
      window.location.replace(`${HTTPCnst.h5_mb_collections}h5-mb-collections/learnPath/#/pages/index/index?accessToken=${sessionStorage.accessToken}&state=${type}/id:${parms.id}`)
    },
    'learnPath_assess': function () {
      window.location.replace(`${HTTPCnst.h5_mb_collections}h5-mb-collections/learnPath/#/pages/index/index?accessToken=${sessionStorage.accessToken}&state=${type}/id:${parms.id}`)
    },
    'learnPath_needJob': function () {
      window.location.replace(`${HTTPCnst.h5_mb_collections}h5-mb-collections/learnPath/#/pages/index/index?accessToken=${sessionStorage.accessToken}&state=${type}`)
    },
    'learnPath_needAssess': function () {
      window.location.replace(`${HTTPCnst.h5_mb_collections}h5-mb-collections/learnPath/#/pages/index/index?accessToken=${sessionStorage.accessToken}&state=${type}`)
    },
    'specialTopic': function () {
      self.props.history.replace('/gotoModule/' + 'topic&&' + parms.id)
    }
  }
  allJumpType[type]()
}
