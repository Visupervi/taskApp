import React, {Component} from 'react'
import './messageInfo.css'

export default class  MessageInfo extends Component{
  // constructor(props){
  //     super(props)
  // }
  render(){
    console.log("this.props.data",this.props.data)
    if(this.props.btn){
      return(
        <div className={this.props.data && this.props.data.content?'messageInfo':'none'}>
          <div className={'displayFlex'}>
            <div className={'infoContent'}>
              {/*<p>{this.props.data.content}</p>*/}
              <p dangerouslySetInnerHTML={{__html:this.props.data.content}}></p>
              <div>

                <span onClick={ ()=>this.props.btn(this.props.data.no,this.props.self)}>{this.props.data.btnTitle1}</span>
                <span onClick={()=>this.props.btn(this.props.data.yes,this.props.self)}>{this.props.data.btnTitle2}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }else{
      return(
        <div className={this.props.data && this.props.data.content?'messageInfo':'none'}>
          <div className={'displayFlex'}>
            <div className={'infoContent'}>
              {/*<p>{this.props.data.content}</p>*/}
              <p dangerouslySetInnerHTML={{__html:this.props.data.content}}></p>
              <div>

                <span onClick={ ()=>this.props.data.clickL()}>{this.props.data.btnTitle1}</span>
                <span onClick={()=>this.props.data.clickR()}>{this.props.data.btnTitle2}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

  }
}
