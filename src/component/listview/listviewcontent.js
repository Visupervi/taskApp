import React,{Component} from 'react';
// import ReactDOM from "react-dom";
import {observer} from "mobx-react";


@observer
class ListViewContent extends Component {
	// shouldComponentUpdate(nextProps) {
	// 	return this._shouldUpdate([
	// 		'data',
	// 		'renderItem'
	// 	], nextProps);
	// }
	//
	// componentDidUpdate(){
		// console.log(this.props);
		// const {sysListId} = this.props;
		// let scrollTop = this.props.getScrollTop();
		// window.sessionStorage[sysListId] = scrollTop;
	// }


	// componentWillUnmount(){
	// 	// console.log(this.props);
	// 	const {sysListId} = this.props;
	// 	let scrollTop = this.props.getScrollTop();
	// 	window.sessionStorage[sysListId] = scrollTop;
	// 	// console.log(window.sessionStorage[sysListId]);
	// }
	// //数据不变无需更新
	// _shouldUpdate(rules, nextProps) {
	// 	return rules.some(item=> {
	// 		return nextProps[item] !== this.props[item]
	// 	})
	// }


	_renderItem() {
		return this.props.data.map((item, index)=> {
			return this.props.renderItem(item, index);
		});
	}

    _otherItem(){
        return this.props.otherItem()
	}
	render() {
		return (
			<div
				ref={view=>this.content=view}
				className="list-view-content-inner-wrapper" style={{paddingBottom:'65px'}}>
				{this.props.otherItem && this._otherItem()}
				{this.props.renderItem && this._renderItem()}
			</div>
		)
	}
}


export default ListViewContent;
