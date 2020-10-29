import React, {Component} from 'react';
import Modal from '@material-ui/core/Modal';
// import CircularProgress from '@material-ui/core/CircularProgress';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      msg: '正在加载，请稍后。。。'
    }
  }

  componentDidMount() {
    if (this.props.loading) {
      this.setState({open: this.props.loading.open, msg: this.props.loading.msg})
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading) {
      this.setState({open: nextProps.loading.open, msg: nextProps.loading.msg})
    }
  }

  render() {
    return (
      <Modal style={{justifyContent: 'center', alignItems: 'center'}} open={this.state.open}>
        {/*<div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>*/}
        {/*<CircularProgress color="secondary" size={50}/>*/}
        {/*<div style={{marginTop:"10px",fontSize:"14px",color:'#2d2d2d'}}>{this.state.msg}</div>*/}
        {/*</div>*/}
        <div style={{'width': '100%', 'textAlign': 'center', 'outline': 'aliceblue'}}>
          <img style={{'width': '50%'}} src="http://supershoper.xxynet.com/vsvz1539855699953" alt={'拉拉跑'}/>
        </div>
      </Modal>
    );
  }
}
