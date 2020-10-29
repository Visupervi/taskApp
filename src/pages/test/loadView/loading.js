import React,{Component} from 'react';
import {observer} from "mobx-react";

@observer
class Loading extends Component {

	render() {
		return (
			<div className={`listview-loading`}>
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
			</div>
		)
	}
}

export default Loading;
