import React, {Component} from 'react';
import './commentdetail.css';
import {Shopguidehttp} from '../Shopguidehttp'
import PraiseBlock from "../praiseblock/PraiseBlock";
import Repley from  '../repley/repley';
import Common from '../../common_method/GeneralMethod';
import SchoolStore from './../SchoolStore'
import appStore,{HeadPic} from '../../../sys/AppStore';
import InputSubmit from '../../../component/inputSumbit/inputSubmit';
import {getQueryString} from '../../../utils/getToken';

export default class OldCommentdetail extends Component {
    constructor(props, context) {
        super(props, context);
        this.cache = SchoolStore.chooseCache;
         document.title = '评论详情';
         let params=this.props.match.params.commentId.split('&&')
        this.state={
            data:{
                'headPic':'',
                'name':'',
                'commentTime':'',
                'commentContent':''
            },
            commentId:params[0],
            praisedata:{},
            discussdata:[],
            courseId:params[1],
            commentScore:params[2],
            likeNum:params[3],
            comNum:params[4],
            commentText:'',
            replyId:null,
            replyuserId:null,
            isFavour:false,
            nowPage:1
        };
        this.cache.set('commentId',params[0]);
        this.Http = new Shopguidehttp();
        this.common=new Common();
    }
    componentWillMount(){

    }
    componentDidMount(){
        this.findArticleTopicOrActivityTopicList(this.state.courseId,this.state.commentId)
        this.commentLIst(this.state.courseId,this.state.commentId);
        this.getFavourList(this.state.commentId);
    }
    //评论信息
    commentLIst(courseId,commentId,n){
        let num=1
        if(n===1){
            num=(this.state.nowPage)+1
            this.setState({nowPage: num})
        }else {
            this.setState({discussdata: [],nowPage:1})
        }
        let self =this;
        let obj={
            'accessToken':getQueryString("accessToken"),
            'courseId':courseId,
            'rows':5,
            'page':num
        }
        if(commentId){
            obj.commentId= commentId;
        }
        this.Http.GET('game/getCourseCommentByCourseId',obj).then((json)=>{
            if(json.dataObject){
                let temp=json.dataObject;
                temp.forEach((vi,key) =>{
                    vi.commentTime = self.common.dateFormat(vi.commentTime ,'MM-dd hh:mm',"show")
                });
               let arr=self.state.discussdata;
                arr.push(...temp)
               self.setState({discussdata: arr});
            }else{
                appStore.Snackbar.handleClick("获取评论列表失败");
            }
        }).catch((error)=>{
            console.warn(error)
        });
    }

    // 点赞信息
    getFavourList(favourRelId){
        let self =this;
        this.Http.GET('bbs/getFavourList',{
            'accessToken': getQueryString("accessToken"),
            'favourRelId':favourRelId,
            'type':4,  //1：论坛，2：活动，3：文章，4：课程
            'favourType':2,
            'page':1,
            'rows':15
        }).then((json)=>{
            if(json.dataObject){
                let temp=json.dataObject;
                // let isFavour=false;
                temp.forEach((vi) =>{
                    vi.createTime = self.common.dateFormat(vi.createTime ,'MM-dd hh:mm',"show")
                    // if(vi.favourRelId.toString()===self.state.courseId.toString()){
                    //     isFavour=true;
                    // }
                });
                self.setState({praisedata: {'FavourList':temp}});
            }else{
                appStore.Snackbar.handleClick("获取点赞列表失败");
            }
        }).catch((error)=>{
            console.warn(error)
        });
    }
    //获取头部信息
    findArticleTopicOrActivityTopicList(courseId,commentId){
        let obj={
            'accessToken': getQueryString("accessToken"),
            'targetParentId':courseId,
            'type':'courseTopic',
            'page':1,
            'rows':10,
            // 'accessToken':sessionStorage['accessToken']
        }
        let self =this;
        if(commentId){
            obj.targetId= commentId;
        }
        this.Http.GET('contmgn/findArticleTopicOrActivityTopicList',obj).then((json)=>{
            if(json.dataObject){
                let temp=json.dataObject;
                temp.commentTime = self.common.dateFormat(temp.commentTime ,'MM-dd hh:mm',"show")
                self.setState({data:temp,isFavour:temp.isCheckLike!==0})
            }else{
                appStore.Snackbar.handleClick("获取详细内容失败");
            }
        }).catch((error)=>{
            console.warn(error)
        });
    }
    // 点赞
    postPraise = () => {
        let self=this
        this.Http.GET('bbs/courseLikeOper',{
            'accessToken': getQueryString("accessToken"),
            'courseId':this.state.courseId,
            'replyId':this.state.commentId
        }).then((json) => {
               if (json) {
                   self.setState({isFavour:!self.state.isFavour});
                   self.getFavourList(self.state.commentId);
                } else {
                    appStore.Snackbar.handleClick("点赞失败")
                }
        });
    };
    // 评论
    postComment = (content) => {
        if(!content||(content.length>0 && content.trim().length === 0)){
            appStore.Snackbar.handleClick('内容不能为空');
            return;
        }
        if(content){
            this.Http.GET('game/addCourseComment',{
                'accessToken': getQueryString("accessToken"),
                'courseId':this.state.courseId,
                'commentContent':content,
                'parentId':this.state.commentId,
                'commentScore':this.state.commentScore,
                /*'parentReplyId':this.state.data.commentId,
                'parentReplyUserId':this.state.data.commentUser || null*/
            })
                .then((json) => {
                    if (json.code===102) {
                        // 清空评论输入框
                        // this.state.commentText = '';
                        this.setState({commentText:''})
                        // 刷新评论信息
                        this.commentLIst(this.state.courseId,this.state.commentId);
                        //添加评论数
                        this.setState({comNum:(this.state.comNum-0)+1})
                    } else {
                        appStore.Snackbar.handleClick("评论失败")
                    }
                });
        }else{
            appStore.Snackbar.handleClick("请输入评论内容")
        }
    };
    // 获取评论内容
    getText =(event)=>{
        this.setState({commentText: event.target.value});
    };
    // 提交点赞评论
    setReplyId = (replyId,userId) => {
       this.setState({replyId:replyId});
       this.setState({replyuserId:userId});
        this.surname.focus();
    };
    render() {
        let items=this.state.data
        return (
            <div className="oldcomment-content">
                <div className="article-detail">
                    <div  className="whitebg paddbottom">
                        <div className="rightcom marbottom" >
                            {/*<img className="art-img" src={props.item.headPic||"http://supershoper.xxynet.com/vsvz1536118304165"} alt="头像"/>*/}
                            <HeadPic src={items.headPic} history={this.props.history} userId={items.commentUser} headDivStyle={{height: '40px',width: '40px',marginRight:'10px'}}/>
                            <div className="comdetail">
                                <p className="names"><span>{items.name}</span><span></span> </p>
                                <p className="comtime">{items.commentTime}</p>
                            </div>
                        </div>
                        <p className="comcontent">{items.commentContent}</p>
                    </div>
                    <PraiseBlock content={this.state.praisedata} praiseType="4" type={'commentId'}/>
                    <Repley history={this.props.history} comNum={this.state.comNum} courseId={this.state.courseId} commentId={this.state.commentId} setPraise={this.props.postPraise} content={this.state.discussdata} commentLIst={this.commentLIst.bind(this)}/>
                </div>
                <HandleBar inputRef={el => this.surname = el} praiseState={this.state.isFavour} comment={this.state.commentText}  setPraise={this.postPraise.bind(this)} setComment={this.postComment.bind(this)}  getText={this.getText}/>
            </div>
        );
    }
}

// 底部操作 点赞、评论、转发
const HandleBar = (props) => (
    <div className="editcom oldEditCom">
        {/*<input placeholder="说点什么吧…" autoFocus="autoFocus" value={props.comment} onChange={props.getText} />*/}
        {/*<i className="sendbtn" onClick={() => {props.setComment(props.comment)}}>发送</i>*/}
        <InputSubmit innerStyle={{'width':'76vw'}} submit={props.setComment}/>
        <i className={props.praiseState?"iconred iconfont icon-dianzan3":"iconfont icon-dianzan"} onClick={() => {props.setPraise()}}></i>
        {/*<i className="iconfont icon-wode_shoucang" onClick={() =>{alert('努力开发中')}}></i>
       <i className="iconfont icon-fenxiang1" onClick={() =>{alert('努力开发中')}}></i>*/}
    </div>
)
