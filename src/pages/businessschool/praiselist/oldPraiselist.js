import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './praiselist.css';
import ListView  from '../../../component/listview/listview';
import {HeadPic} from "../../../sys/AppStore"
import  SchoolStore from './../SchoolStore'

export default class OldPraiselist extends Component {
    constructor(props, context) {
        super(props, context);
         document.title = '点赞列表';
        this.state={
            praisedata:null,
            iFrameHeight:0,
            praiseType:this.props.match.params.praiseType
        };
        this.store=new SchoolStore();
    }
    componentDidMount(){
        this.store.getFavourListAll(this.state.praiseType)
    }
    renderItem(item,idx){
       return(
           <li key={idx}>
               {/*<img src={item.headPic||"http://supershoper.xxynet.com/vsvz1536118304165"} alt=""/>*/}
               <HeadPic src={item.headPic} history={this.props.history} userId={item.createUser} headDivStyle={{height: '30px',width: '30px'}}/>
               <div className={'cont'}>
                   <span>{item.name}</span>
                   <span>{item.createTime}</span>
               </div>
           </li>
       )
    }
    render() {
        return (
            <div className="oldPraise-content">
            {
               this.store.favourList?(
                   <ul className="praiselist">
                       <ListView
                           enablePullRefreshEvent={true}					 //是否开启下拉刷新
                           enableOnEndReachedEvent={true}					 //是否开启上滑加载  无更多数据设为false
                           fetchMoreLoading={this.store.isLoading}	 //是否显示加载loading
                           onPullRefresh={()=>this.store.getFavourList(this.state.praiseType)}   //下拉刷新回调 	重新请求更新store数据
                           onEndReached={()=>this.store.getFavourList(this.state.praiseType,1)}	 //上滑加载回调  原数据concat(请求的page+1数据)
                           renderItem={this.renderItem.bind(this)}	 //children
                           data={this.store.favourList || []}/>
                   </ul>
               ):(<div className="nocontent">暂无数据</div>)
            }   
            </div>
        );
    }
}
