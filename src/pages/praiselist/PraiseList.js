import React, {Component} from 'react';
import './praiselist.css';
import Loading from "../../utils/Loading";
import HttpModel from '../../service/HttpModel';
import Common from '../../utils/GeneralMethod';
import ListView from '../../component/listview/listview';
import {CommonInterface} from "../../utils/CommonInterface";
import appStore, {HeadPic} from "../../sys/AppStore"
import {getQueryString} from '../../utils/getToken';

export default class PraiseList extends Component {
  constructor(props, context) {
    super(props, context);
    CommonInterface.setTitle("点赞列表");
    this.state = {
      praisedata: [],
      iFrameHeight: 0,
      open: false,
      meg: '加载中...',
      fetchMoreLoading: false,
      nowPage: 1,
      pageSize: 10
    };
    this.Http = new HttpModel();
    this.common = new Common();
    this.fetchMoreLoading = false;
    this.nowPage = 1;
    this.pageSize = 15;
    const topicdetail = props.match.params.praisemeg.split(',');
    this.praiseTargetId = topicdetail[0];
    this.praiseType = topicdetail[1];
    appStore.isShowName = '';
    appStore.isShowNameToActivity = sessionStorage.getItem('isShowName') ? JSON.parse(sessionStorage.getItem('isShowName')).dataObject.isShowNameToActivity : '0';
    appStore.isShowNameToArticle = sessionStorage.getItem('isShowName') ? JSON.parse(sessionStorage.getItem('isShowName')).dataObject.isShowNameToArticle : '0';
    appStore.isShowNameToBBS = sessionStorage.getItem('isShowName') ? JSON.parse(sessionStorage.getItem('isShowName')).dataObject.isShowNameToBBS : '0';
  }

  componentDidMount() {
    this.initData(1);
    //根据praiseType来判断是哪个模块使用点赞列表
    switch (this.praiseType) {
      case 'activity' :
        appStore.isShowName = appStore.isShowNameToActivity;
        break;
      case 'article' :
        appStore.isShowName = appStore.isShowNameToArticle;
        break;
      case 'articleComment' :
        appStore.isShowName = appStore.isShowNameToArticle;
        break;
      case 'bbs' :
        appStore.isShowName = appStore.isShowNameToBBS;
        break;
      default :
        appStore.isShowName = '0';
        break;
    }
  }

  initData(i) {
    this.setState({fetchMoreLoading: true});
    if (i === 1) {
      this.nowPage = 1;
    } else {
      this.nowPage++;
    }
    return this.Http.GET('cms/praise', {
      'praiseType': this.praiseType,
      'praiseTargetId': this.praiseTargetId,
      'pageSize': this.pageSize,
      'nowPage': this.nowPage,
      'accessToken': getQueryString("accessToken"),
    }).then((praisejson) => {
      if (praisejson) {
        let userIds = [];
        praisejson.list.map((item, index) => (
          userIds.push(item.createUser)
        ));
        this.Http.GET('user', {
          'userIds': userIds.join(','),
          'accessToken': getQueryString("accessToken"),
        }).then((json) => {
          if (json) {
            praisejson.list.forEach((vi) => {
              json.forEach((user) => {
                if (vi.createUser === user.sysUserId) {
                  vi.headPic = user.headPic;
                  vi.name = user.name;
                  vi.nickName = user.nickName;
                }
              });
            });

            if (this.nowPage === 1) {
              this.setState({praisedata: praisejson.list});
            } else {
              let data = this.state.praisedata.concat(praisejson.list);
              this.setState({praisedata: data});
            }
            this.setState({open: false, fetchMoreLoading: false});
          } else {
            appStore.Snackbar.handleClick("获取用户信息失败");
            this.fetchMoreLoading = false;
            this.setState({open: false, fetchMoreLoading: false});
          }
        }).catch((err) => {
          appStore.Snackbar.handleClick(err);
          this.fetchMoreLoading = false;
          this.setState({open: false, fetchMoreLoading: false});
        });
      } else {
        appStore.Snackbar.handleClick('获取点赞信息失败');
        this.fetchMoreLoading = false;
        this.setState({open: false, fetchMoreLoading: false});
      }
    }).catch((err) => {
      appStore.Snackbar.handleClick(err);
    });
  }

  // 点赞列表UI
  _renderItem = (item, index) => {
    return (
      <li key={index}>
        <HeadPic src={item.headPic} history={this.props.history} userId={item.createUser}
                 headDivStyle={{height: '30px', width: '30px'}}/>
        <div>
          <span>{appStore.isShowName === '1' ? item.nickName || item.name || '无名氏' : item.name || item.nickName || '无名氏'}</span>
          <span>{this.common.dateFormat(item.createTime, 'MM-dd hh:mm', "show")}</span>
        </div>
      </li>
    )
  }

  render() {
    return (
      <div className="praise-content">
        <Loading loading={{open: this.state.open, msg: this.state.meg}}/>
        <ul className="praiselist">
          <ListView
            onPullRefresh={() => this.initData(1)}   //下拉刷新回调   重新请求更新store数据
            onEndReached={() => this.initData(2)}     //上滑加载回调  原数据concat(请求的page+1数据)
            fetchMoreLoading={this.state.fetchMoreLoading}   //是否显示加载loading
            enablePullRefreshEvent={true}         //是否开启下拉刷新
            enableOnEndReachedEvent={true}        //是否开启上滑加载  无更多数据设为false
            renderItem={this._renderItem}
            data={this.state.praisedata || []}
          />
        </ul>
      </div>
    );
  }
}
