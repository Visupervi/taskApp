import {observable, action, flow} from "mobx";
import {HTTPCnst} from "../../service/httpCnst.js"
import appStore from "../../sys/AppStore"
import {getExamList, getFinishExamList} from "../../apis/Api";
import {getQueryString} from "../../utils/getToken";

export default class ExamListStore {
  // constructor(props) {
  //     super(props);
  // }
  rows = 5;
  @observable type = getQueryString("taskType");//0 进行中  1 已完成
  @observable examtype = 0; //0 测试考试 1正式考试
  @observable examId = '';
  @observable currentPage = 1;
  @observable nowPage = 1;
  @observable dataObject = [];
  @observable rankList = [];
  @observable userMsg = {};//个人排行信息
  @observable oneObj = {};//第一名信息
  @observable twoObj = {};//第二名信息
  @observable threeObj = {};//第三名信息
  @observable searchvalue = '';//搜索关键字
  @observable noneFlag = false;//判断考试是否为空
  @observable noneRankFlag = false;//判断排行是否为空
  @observable fetchMoreLoading = false;
  @observable static isLoading = false;
  @observable static err = undefined;
  @observable static lastReqTime = 0 //@fixme
  // 试卷列表

  @action initExamListDate = flow(async function* () {
    let {dataObject, currentPage, rows, type, searchvalue} = this;
    ExamListStore.isLoading = true;
    this.open = true;
    if (type === 0) {
      try {
        // let url = `${HTTPCnst.shopguide_url}exam/user/waitExamList?scope=${2}&examTitle=${searchvalue}`;
        let result = await getExamList({
          accessToken:getQueryString("accessToken"),
          scope:2,
          examTitle:searchvalue,
          version:"1.0"
        });
        if (result && result.code === 102) {

          console.log("result.dataObj",result)
          dataObject.replace(result.dataObject);
          if (result.dataObject.length <= 0) {
            this.noneFlag = true;
          } else {
            this.noneFlag = false;
          }
        } else {
          appStore.Snackbar.handleClick('获取进行中试卷列表失败！');
        }
      } catch (error) {
        this.err = error;
        // appStore.Snackbar.handleClick(error);
      }
    } else {
      try {
        let result = await getFinishExamList({
          accessToken: getQueryString("accessToken"),
          scope: 2,
          examTitle:searchvalue,
          page:currentPage,
          rows:rows
        });
        // let url = `${HTTPCnst.shopguide_url}exam/user/finishExamList?scope=${2}&examTitle=${searchvalue}&page=${currentPage}&rows=${rows}`
        // let ExamListRes = yield fetch(url);
        // let result = yield ExamListRes.json();
        if (result && result.code === 102) {
          let datajson = result.dataObject;
          if (currentPage === 1) {
            dataObject.replace(datajson.rows)
          } else {
            dataObject.push(...datajson.rows)
          }
          this.noneFlag = false;
          if (datajson && datajson.rows && datajson.rows.length <= 0 && currentPage === 1) {
            this.noneFlag = true;
          }
        } else {
          appStore.Snackbar.handleClick('获取已完成试卷列表失败！');
        }
      } catch (error) {
        this.err = error;
        // appStore.Snackbar.handleClick(error);
      }
    }
    ExamListStore.isLoading = false;
    this.open = false;
  })

  @action getSearchList = (data) => {
    this.searchvalue = data;
    this.currentPage = 1;
    this.initExamListDate();

  }
  // 排行榜列表
  @action initExamRankList = flow(function* () {
    let {rankList, nowPage, examId, examtype} = this;
    ExamListStore.isLoading = true;
    this.open = true;
    try {
      let url = examtype === 1 ? `${HTTPCnst.shopguide_url}exam/user/getStatisticsOfRank?examId=${examId}&page=${nowPage}&rows=10&accessToken=${getQueryString("accessToken")}` : `${HTTPCnst.shopguide_url}exam/user/getHistoryExamQuestionInfo?examId=${examId}&page=${nowPage}&rows=10&accessToken=${getQueryString("accessToken")}`
      let ExamListRes = yield fetch(url);
      let result = yield ExamListRes.json();
      if (result && result.code === 102) {
        let datajson = result.dataObject;
        if (datajson && datajson.rank && datajson.rank.rows) {
          if (parseInt(nowPage, 10) === 1) {
            if (datajson.rank.rows.length <= 0) {
              this.noneRankFlag = true;
            } else {
              this.noneRankFlag = false;
              // if(examtype === 1){//正式考试
              if (datajson.rank.rows[0]) {
                this.oneObj = datajson.rank.rows[0];
              }
              if (datajson.rank.rows[1]) {
                this.twoObj = datajson.rank.rows[1];
              }
              if (datajson.rank.rows[2]) {
                this.threeObj = datajson.rank.rows[2];
              }
              if (datajson.rank.rows.length > 3) {
                rankList.replace(datajson.rank.rows.slice(3))
              }
              // }else{//模拟考试
              //     rankList.replace(datajson.rank.rows)
              // }
            }
          } else {
            this.noneRankFlag = false;
            rankList.push(datajson.rank.rows)
          }
        }
        if (datajson && datajson.user) {
          this.userMsg = datajson.user;
        }
      } else {
        appStore.Snackbar.handleClick('获取排行榜失败！');
      }
    } catch (error) {
      this.err = error;
      appStore.Snackbar.handleClick(error);
    }

    ExamListStore.isLoading = false;
    this.open = false;
  })
  // 刷新考试排行榜
  @action reloadExamRankList = () => {
    this.nowPage = 0;
    this.initExamRankList();

  }
  // 加载考试排行榜
  @action pullExamRankList = () => {
    this.nowPage += 1;
    this.initExamRankList();

  }

  // 刷新试卷列表
  @action reloadExamListDate() {
    /* let {currentPage,type} = this;*/
    if (this.type === 0) {
      this.initExamListDate();
    } else {
      this.currentPage = 1;
      this.initExamListDate();
    }
  }

  // 加载试卷列表
  @action pullExamListDate() {
    /*let {currentPage,type} = this;*/
    if (this.type !== 0) {
      this.currentPage++;
      this.initExamListDate();
    }
  }

  @action toExam = (self, item) => {
    console.log(item.examId);
    if (sessionStorage.onlineTab === "1" && (item.optEnabledType === 1)) {
      appStore.Snackbar.handleClick('正式考试结束后可查看详情! ');
      return
    }
    self.props.history.push(`/examexplain/${item.examId}?accessToken=${getQueryString("accessToken")}`);
  }

  @action examType = (type) => {
    if (parseInt(type, 10) === 1) {
      return "正式考试"
    } else if (parseInt(type, 10) === 2) {
      return "模拟考试"
    } else {
      return "闯关考试"
    }
  }

}
