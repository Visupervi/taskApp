import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './praiseblock.css';
import {Link} from "react-router-dom";
import {getQueryString} from '../../utils/getToken';

export default class PraiseBlock extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return (
      <div className={this.props.content && this.props.content.totalCount > 0 ? 'whitebg paddbottom' : 'whitebg'}>
        <p className={this.props.content && this.props.content.totalCount === 0 ? "zanp" : "none"}>
          <span>{this.props.content && this.props.content.totalCount}人点赞</span>
        </p>
        <Link
          to={"/praiselist/" + this.props.videoId + "," + this.props.praiseType + "?accessToken=" + getQueryString("accessToken")}
          className={this.props.content && this.props.content.totalCount === 0 ? "none" : ""}>
          <p className="zanp">
            <span>{this.props.content && this.props.content.totalCount}人点赞</span>
            <i className="iconfont icon-youjiantou"></i>
          </p>
          <div className="photos">
            {this.props.content && this.props.content.list && this.props.content.list.map((item, index) => {
              return (index < 9 ? (
                <img src={item.headPic || "http://supershoper.xxynet.com/vsvz1553752667436"} className='articles' alt=""
                     key={index}/>) : null)
            })}
          </div>
        </Link>
      </div>
    );
  }
}


