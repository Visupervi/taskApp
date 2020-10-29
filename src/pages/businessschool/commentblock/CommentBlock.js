import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './commentblock.css';
import ListView  from '../../../component/listview/listview';
import  {Link} from "react-router-dom";
import SchoolStore from './../SchoolStore'
import {HeadPic} from "../../../sys/AppStore"

export default class CommentBlock extends Component {
    constructor(props, context) {
        super(props, context);
        this.cache = SchoolStore.chooseCache;
    }
    renderItem(item, index){
        return(
            <Link to={"/oldCommentdetail/"+item.commentId+'&&'+this.props.courseId+'&&'+item.commentScore+'&&'+item.likeNum+'&&'+item.comNum} key={index}>
                <li className="rightcom">
                    {/*<img className="art-img"  src={item.headPic||"http://supershoper.xxynet.com/vsvz1536118304165"} alt=""/>*/}
                    <HeadPic src={item.headPic} history={this.props.history} userId={item.commentUser} headDivStyle={{height: '40px',width: '40px',marginRight:'10px'}}/>
                    <div className="comdetail">
                        <p className="names"><span>{item.name}</span><span><i className={item.isCheckLike===0?"iconfont icon-dianzan1":"iconfont icon-dianzan1 red"} onClick={(e) => {e.preventDefault();item.isCheckLike===0&&this.props.setPraise(item.commentId)}} ></i>{item.likeNum || '赞'}<i className="iconfont icon-pinglun" ></i>{item.comNum || '评论'}</span> </p>
                        <p className="comtime">{item.commentTime}</p>
                        <p className="comcontent">{item.commentContent}</p>
                    </div>
                </li>
            </Link>
        )
    }

    render() {
        let commentLists=this.props.content&&this.props.content.commentList&&this.props.content.commentList
        return (
            <div className="whitebg1">
                <p className="comstitle">{this.props.content && this.props.content.commentnums}人评论</p>
                <ul className="comlist">
                    <ListView
                        sysListId={'CommentBlock'}
                        listViewStyle={{'height':document.body.clientHeight-100+'px',marginBottom:50+'px'}}
                        enablePullRefreshEvent={true}					 //是否开启下拉刷新
                        enableOnEndReachedEvent={true}					 //是否开启上滑加载  无更多数据设为false
                        fetchMoreLoading={false}	 //是否显示加载loading
                        onPullRefresh={()=>this.props.commentLIst(this.cache.get('courseId'))}   //下拉刷新回调 	重新请求更新store数据
                        onEndReached={()=>this.props.commentLIst(this.cache.get('courseId'),null,1)}	 //上滑加载回调  原数据concat(请求的page+1数据)
                        renderItem={this.renderItem.bind(this)}		 //children
                        data={commentLists || []}/>
                </ul>
            </div>
        );
    }
}

