import React from 'react';
import './snackbar.css';

class PositionedSnackbar extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onRef(this)
  }

  state = {
    open: false,
    vertical: 'top',
    horizontal: 'center',
    content: '系统开小差了，请登录重试！',
    time: 1500
  };

  handleClick = (content, time) => {
    let temp = {};
    if (typeof (content) === "string") {
      if (content) temp.content = content;
    }
    this.setState({open: true, ...temp});
    setTimeout(this.handleClose, time || this.state.time)
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {
    const {content, open} = this.state;
    return (
      <div className={open ? 'cjToast' : 'none'}>
        <span className="messageText">{content}</span>
      </div>
    )
  }

  // render() {
  //     const { vertical, horizontal,open } = this.state;
  //     return (
  //         <Snackbar
  //             anchorOrigin={{ vertical, horizontal }}
  //             open={open}
  //             onClose={this.handleClose}
  //             ContentProps={{
  //                 'aria-describedby': 'message-id',
  //             }}
  //             message={<span id="message-id">{this.state.content}</span>}
  //         />
  //     );
  // }
}

export default PositionedSnackbar;
