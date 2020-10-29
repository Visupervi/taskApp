import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './praiseblock.css';
import {Link} from "react-router-dom";
import {getQueryString} from '../../../utils/getToken';
export default class PraiseBlock extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
           praiseType:this.props.praiseType
        }
        console.log("props",props);
    }
    componentDidMount(){
    }
    render() {
        return (
                <div className="whitebg1">
                    <p className={this.props.content&&this.props.content.FavourList&&this.props.content.FavourList.length===0?"zanp":"none"}><span>{this.props.content&&this.props.content.FavourList&&this.props.content.FavourList.length}人点赞</span></p>
                    <Link to={"/OldPraiselist/"+this.state.praiseType+"?accessToken="+getQueryString("accessToken")} className={this.props.content&&this.props.content.FavourList&&this.props.content.FavourList.length===0?"none":""}>
                        <p className="zanp"><span>{this.props.content&&this.props.content.FavourList&&this.props.content.FavourList.length}人点赞</span><i className="iconfont icon-youjiantou"></i></p>
                        <div className="photos">
                         {this.props.content&&this.props.content.FavourList&&this.props.content.FavourList.map((item, index) => {
                            return(index<8?(<img src={item.headPic||"http://supershoper.xxynet.com/vsvz1553752667436"} className='articles' alt="图片" key={index} />):null)
                        })}
                        </div>
                    </Link>
                </div>
        );
    }
}


