import React, {Component} from 'react';
import '../commentblock/commentblock.css';
import ListView  from '../../../component/listview/listview';
import SchoolStore from './../SchoolStore'
import {HeadPic} from '../../../sys/AppStore';
import ListStatus from "../../../component/listStatus/listStatus";
export default class Repley extends Component {
    constructor(props, context) {
        super(props, context);
        this.cache = SchoolStore.chooseCache;
    }
    renderItem(item, index){
        return(
            <li className="rightcom" key={index}>
                {/*<img className="art-img"  src={item.headPic||"http://supershoper.xxynet.com/vsvz1536118304165"} alt="头像"/>*/}
                <HeadPic src={item.headPic} history={this.props.history} userId={item.commentUser} headDivStyle={{height: '40px',width: '40px',marginRight:'10px'}}/>
                <div className="comdetail">
                    <p className="names"><span>{item.name}</span><span></span> </p>
                    <p className="comtime">{item.commentTime}</p>
                    <p className="comcontent">{item.commentContent}</p>
                </div>
            </li>
        )
    }
    render() {
        let commentLists=this.props.content || []
        return (
            <div className="whitebg1">
                {commentLists.length!==0 && <p className="comstitle">{this.props.comNum}人回复</p>}
                {commentLists.length===0 && <ListStatus status="discussEmpty" tips="还没人回复，赶紧抢沙发~"/>}
                <ul className="comlist">
                    <ListView
                        enablePullRefreshEvent={true}					 //是否开启下拉刷新
                        enableOnEndReachedEvent={true}					 //是否开启上滑加载  无更多数据设为false
                        fetchMoreLoading={false}	 //是否显示加载loading
                        onPullRefresh={()=>this.props.commentLIst(this.props.courseId,this.props.commentId)}   //下拉刷新回调 	重新请求更新store数据
                        onEndReached={()=>this.props.commentLIst(this.props.courseId,this.props.commentId,1)}	 //上滑加载回调  原数据concat(请求的page+1数据)
                        renderItem={this.renderItem.bind(this)}		 //children
                        data={commentLists}/>
                </ul>
            </div>
        );
    }
}

