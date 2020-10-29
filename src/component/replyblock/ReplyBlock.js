import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import './replyblock.css';
import {HeadPic} from "../../sys/AppStore"
import Common from '../../utils/GeneralMethod'

const common = new Common();
export default class ReplyBlock extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      // data:{},
    }
  }

  render() {
    let item = this.props.content;
    {/*<Link to={"/commentdetail/"+item.commonId}>*/
    }
    return (
      <li className="rightcom">
        <HeadPic src={item.headPic} history={this.props.history} userId={item.createUser}
                 headDivStyle={{height: '30px', width: '30px', marginRight: '10px'}}/>
        {/* onClick={() => { this.props.setReply(item.commonId,item.createUser)} } */}
        <div className="comdetail">
          <div className="replys">
            <p>
              <span>{item.isShowNameToArticle === '1' ? item.nickName || item.name || '无名氏' : item.name || item.nickName || '无名氏'}</span>
              <span className={item.parentReplyUserName ? "" : "none"}><i>回复</i>{item.parentReplyUserName}</span>
            </p>
          </div>
          <p className="comtime">{common.dateFormat(item.commentTime, 'MM-dd hh:mm', "show")}</p>
          <p className="comcontent">{item.cont}</p>
        </div>
      </li>
      // </Link>
    );
  }
}

