import React, {Component} from 'react';
import './commentblock.css';
import  {Link} from "react-router-dom";
import Common from '../../utils/GeneralMethod'
import {HeadPic} from "../../sys/AppStore"
import {getQueryString} from '../../utils/getToken';
const common=new Common();
export default class CommentBlock extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:{},
        }
    }
    render() {
        let item = this.props.content;
        return (
            <Link to={"/commentdetail/"+item.commonId+"?accessToken="+getQueryString("accessToken")}>
                <li>
                    <HeadPic src={item.headPic} history={this.props.history} userId={item.createUser} headDivStyle={{height: '40px',width: '40px',marginRight:'10px'}}/>
                    <div>
                        <p>
                            <span>
                                {item.isShowNameToArticle === '1' ? item.nickName || item.name || '--' : item.name || item.nickName || '--'}
                                <em className={item.eliteFlag===1?'excellent':'none'}>精选</em>
                            </span>
                            <span>
                                <i className={item.favourStatus===false?"iconfont icon-dianzan":"iconfont icon-dianzan3 red"}
                                   onClick={(e) => {
                                       e.preventDefault();
                                       if(item.favourStatus===false){
                                           this.props.setPraise(this.props.store,item.commonId);
                                           item.favourNum++;
                                           item.favourStatus=true;
                                           this.forceUpdate();
                                       }else{
                                           this.props.setPraise(this.props.store,item.commonId,'del');
                                           item.favourNum--;
                                           item.favourStatus=false;
                                           this.forceUpdate();
                                       }
                                   }}
                                ></i>{item.favourNum>0?item.favourNum:"赞"}
                                <i className="iconfont icon-pinglun" ></i>{item.commentNum>0?item.commentNum:"回复"}
                            </span>
                        </p>
                        <p> {common.dateFormat(item.commentTime,'MM-dd hh:mm',"show")}</p>
                        <p>{item.cont}</p>
                    </div>
                </li>
            </Link>
        );
    }
}

