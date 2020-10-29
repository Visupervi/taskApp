import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import {CommonInterface} from "../../utils/CommonInterface";
import ExamList from './ExamList'
import Search from '../../component/search/index';
import ExamListStore from "./ExamListStore"
import "./ExamList.css"
import Header from "../../component/header/header";

function TabContainer({children, dir}) {
  return (
    <Typography component="div" dir={dir} style={{padding: 0}}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    // backgroundColor: theme.palette.background.paper,
    backgroundColor: '#f6f6f6',
    flex: 1,
    height: 50,
    color: "#333",
  },
  tabs: {
    background: "#fff",
    color: "#333"
  },
  indicator: {
    backgroundColor: " #ff5651"
  }
});

class OnLineExam extends React.Component {
  constructor() {
    super()
    this.store = new ExamListStore();
    this.store.toExam = this.store.toExam.bind(this);
    this.state = {
      value: (sessionStorage.onlineTab && Number(sessionStorage.onlineTab)) || 0,
      data: '',
      searchValue: ''
    };
    CommonInterface.setTitle("在线考试");
  }

  handleChange = (value, event) => {
    this.setState({'value': value});
    window.sessionStorage['onlineTab'] = value;
  };
  // handleChangeIndex = index => {
  //     this.setState({ value: index });
  // };
  getDate = (data) => {
    this.setState({
      data: data
    })
  }

  render() {
    const {theme} = this.props;
    return (
      <div className={'onlineExam'}>
        <Header headerTilte={"在线考试"}/>
        <div className="exam_search">
          <Search searchData={(data) => this.getDate(data)} searchPlaceholder={'搜索你需要的内容'}/>
        </div>
        <div className='tabHeader'>
          <span onClick={this.handleChange.bind(this, 0)}
                className={this.state.value === 0 ? 'active' : 'lose'}><b>进行中</b></span>
          <span onClick={this.handleChange.bind(this, 1)}
                className={this.state.value === 1 ? 'active' : 'lose'}><b>已完成</b></span>
        </div>
        {this.state.value === 0 && <TabContainer dir={theme.direction}>
          <ExamList type={this.state.value} scroll={this.props.scroll || false} history={this.props.history}
                    data={this.state.data}/>
          {/* <div>进行中</div> */}
        </TabContainer>}
        {this.state.value === 1 && <TabContainer dir={theme.direction}>
          <ExamList type={this.state.value} scroll={this.props.scroll || false} history={this.props.history}
                    data={this.state.data}/>
        </TabContainer>}
      </div>
    );
  }
}

OnLineExam.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, {withTheme: true})(OnLineExam);
