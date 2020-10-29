import React, {Component} from 'react'
import './select.css'

export default class Select extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data1: props.selectData1 || null,
      data2: props.selectData2 || null,
      data: null,
      isOpen1: false,
      isOpen2: false,
      height: 700,
      selectIndex: 0,
      choosedIndex: props.choosedIndex || 1,
      choosedData: props.selectData1 && props.selectData1[0],
      choosedData1: props.selectData1 && props.selectData1[0],
      choosedData2: props.isInitial ? props.isInitial : props.selectData2 ? props.selectData2[0] : null, // isInitial兑换中心价格初始值
    }
    this.list.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.selectData1) !== JSON.stringify(this.state.data1) && (nextProps.selectData1 !== undefined || nextProps.selectData1 !== null)) {
      let temp = 0
      nextProps.selectData1 && nextProps.selectData1.map((itm, idx) => {
        if (itm.choosed) {
          temp = idx
        }
      })
      this.setState({
        data1: nextProps.selectData1 || null,
        choosedData1: nextProps.selectData1 && nextProps.selectData1[temp],
      })
    }
    if (JSON.stringify(nextProps.selectData2) !== JSON.stringify(this.state.data2) && (nextProps.selectData2 !== undefined || nextProps.selectData2 !== null)) {
      let temp = 0
      nextProps.selectData2 && nextProps.selectData2.map((itm, idx) => {
        if (itm.choosed) {
          temp = idx
        }
      })
      this.setState({
        choosedData2: nextProps.selectData2 && nextProps.selectData2[temp],
        data2: nextProps.selectData2 || null,
      })
    }
    if (this.state.choosedIndex !== nextProps.choosedIndex) {
      this.setState({choosedIndex: nextProps.choosedIndex})
    }
  }

  componentDidMount() {
    this.setState({height: document.body.clientHeight, width: window.innerWidth})
  }

  openLabel(i) { //点击打开列表
    this.setState({selectIndex: i});
    if (i === 1) {
      if (this.state.data1 && this.state.data1.length === 1) {
        this.clickEvent(this.state.data1[0], i)
        return
      }
      this.setState({
        isOpen1: !this.state.isOpen1,
        isOpen2: false,
        data: this.state.data === this.state.data1 ? null : this.state.data1,
        choosedData: this.state.choosedData1
      });
    } else {
      if (this.state.data2 && this.state.data2.length === 1) {
        this.clickEvent(this.state.data2[0], i)
        return
      }
      this.setState({
        isOpen2: !this.state.isOpen2,
        isOpen1: false,
        data: this.state.data === this.state.data2 ? null : this.state.data2,
        choosedData: this.state.choosedData2
      });
    }
  }

  clickEvent = (val, index) => { //点击后调用事件
    if (index === 1) {
      this.setState({choosedData1: val});
    } else if (index === 2) {
      this.setState({choosedData2: val});
    }
    this.setState({isOpen1: false, isOpen2: false});
    this.setState({data: null});
    if (index === 3) {
      return
    }
    if (index === 2) {
      this.state.choosedIndex = 2
      this.props.changeData2(val);
    } else {
      this.state.choosedIndex = 1
      this.props.changeData1(val)
    }
  }
  list = (item, index) => {
    return (
      <span key={index} className={this.state.choosedData.value === item.value ? 'choosed' : ''}
            onClick={() => this.clickEvent(item, this.state.selectIndex)}>
                <i>{item.name}<em
                  className={this.state.choosedData.value === item.value ? 'iconfont icon-duihao' : 'none'}></em></i>
            </span>
    )
  }

  render() {
    let windowH = {
      height: this.state.height,
      width: this.state.width
    }
    let choose1 = this.state.data1 && this.state.data1.length
    let choose2 = this.state.data2 && this.state.data2.length
    return (
      <div className={'select'}>
        <div className="selecttitle">
          <p className={this.state.choosedIndex === 1 ? 'choosed' : ''}
             style={{"display": this.state.choosedData1 ? "flex" : "none"}} onClick={() => this.openLabel(1)}>
            <span>{this.state.choosedData1 && this.state.choosedData1.name}</span>
            {choose1 > 1 && <em className={this.state.isOpen1 ? 'iconfont icon-toDown' : 'iconfont icon-xiala'}></em>}
          </p>
          <p className={this.state.choosedIndex === 2 ? 'choosed' : ''}
             style={{"display": this.state.choosedData2 ? "flex" : "none"}} onClick={() => this.openLabel(2)}>
            <span>{this.state.choosedData2 && this.state.choosedData2.name}</span>
            {choose2 > 1 && <em className={this.state.isOpen2 ? 'iconfont icon-toDown' : 'iconfont icon-xiala'}></em>}
          </p>
        </div>
        <div style={windowH} className={this.state.data ? 'selectTab' : 'none'}
             onClick={() => this.clickEvent(null, 3)}>
          {this.state.data && this.state.data.map(this.list)}
        </div>
      </div>
    )
  }
}
