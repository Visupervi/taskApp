import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link, Switch} from "react-router-dom"; // BrowserRouter:history模式,Switch 只匹配其中一个
// import logo from './logo.svg';
import './App.css';
import router from "./router/router";

import appStore from './sys/AppStore'

import Mask from './component/mask/mask'
import LalaLoading from './component/lalaLoading/lalaLoading'
import PositionedSnackbar from './component/snackbar/Snackbar'
import Message from './component/message/message'
import Share from './component/sharePage/share'
import BackHome from "./component/backhome/backhome";
import {HTTPCnst} from './service/httpCnst.js'
import {communicationWithNative} from "./utils/superGuide";

// const baseUrl = "/$/";
const baseUrl = HTTPCnst.baseUrl;

class App extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // communicationWithNative({
    //   method: 'showTitle',
    //   args: null,
    // }, {
    //   method: 'showTitle',
    //   args: []
    // })
  }

  render() {
    console.log("this.props", this.props);
    return (
      <div className={"App"}>

        <Router basename={baseUrl}>
          <Switch>
            <div className={`root-layout`}>
              <LalaLoading onRef={(ref) => {
                appStore.Loading = ref;
              }}/>
              <Mask onRef={(ref) => {
                appStore.Mask = ref;
              }}/>
              <PositionedSnackbar onRef={(ref) => {
                appStore.Snackbar = ref;
              }}/>
              <Message onRef={(ref) => {
                appStore.Message = ref;
              }}/>
              <Share onRef={(ref) => {
                appStore.Share = ref;
              }}/>
              <Mask onRef={(ref) => {
                appStore.Mask = ref;
              }}/>
              {
                router.map((router, key) => {
                  if (router.exact) {
                    return <Route
                      key={key}
                      exact={router.exact}
                      path={`${router.path}`}
                      render={(props) => {
                        document.title = router.meta.title;
                        return <router.componentName {...props} routes={router.routes}/>
                      }
                      }
                    />
                  } else {
                    return <Route
                      key={key}
                      path={router.path}
                      render={() => {
                        document.title = router.meta.title;
                        return <router.componentName/>
                      }}
                    />
                  }
                })
              }
            </div>
          </Switch>
        </Router>

      </div>
    )
  }
}

export default App;
