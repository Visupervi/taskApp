/**
 * @Author: visupervi
 * @Date:
 * @return:
 * @Description 头部组件
 */

import React, {Component} from "react";
import {NavBar, Icon} from "antd-mobile";
import {withRouter} from "react-router-dom";
import "./header.less";
import {communicationWithNative,getQueryString} from "../../utils/superGuide";

class Header extends Component {
  constructor(props){
    console.log("props", props)
    super(props);
    this.state = {
      headerTitle:decodeURI(props.headerTilte).length > 10 ? decodeURI(props.headerTilte).substring(0,20)+"..." : decodeURI(props.headerTilte),
    }
    // // console.log(this.headerTitle);
  }



  leftClickHandler = () =>{
    console.log("点击left",this.props);
    switch (this.props.headerFlag) {
      case "shellDataView":
        communicationWithNative({
          method: 'finish',
          args: null
        }, {
          method: 'finish',
          args: []
        });
        break;
      case "shellDateOption":
        this.props.history.go(-1);
        break;
      case "shellShopTour":
        this.props.history.go(-1);
        break;
      case "shellTaskCenter":
        this.props.history.go(-1);
        break;
      case "shellTaskProgressDetail":
        this.props.history.go(-1);
        break;
      // case "examTask":
      //   communicationWithNative({
      //     method: 'finish',
      //     args: null
      //   }, {
      //     method: 'finish',
      //     args: []
      //   });
      //   break;
      // case "examExplain":
      //   communicationWithNative({
      //     method: 'finish',
      //     args: null
      //   }, {
      //     method: 'finish',
      //     args: []
      //   });
      //   break;
      default:
        this.props.history.go(-1);
    }
    // communicationWithNative(
    //   {
    //     method: 'finish',
    //     args: null
    //   },  {
    //     method: 'finish',
    //     args: []
    //   }
    // );
  };

  render() {
    return (
      <div className={"deppon-header"}>
        <NavBar
          mode="light"
          icon={<Icon type="left" size="xm"  />}
          onLeftClick={this.leftClickHandler}
          rightContent={[
          ]}
        >{this.state.headerTitle}</NavBar>
      </div>
    )
  }
}

export default withRouter(Header);
