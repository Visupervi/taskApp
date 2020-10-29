import React,{Component} from 'react';
import {BrowserRouter as Router,Switch,Route,Link} from "react-router-dom";
import ListView  from '../listview';
import './list.css';
import ListDetails from './listdetails';

const baseUrl = document.location.pathname;

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listData: null,			  				//列表数据
			fetchMoreLoading: false,  				//是否显示加载loading
			page: 0,				  				//分页参数
		}
	}

	//初始化默认请求第一页数据（实质上应该是加载store里面存储的数据）
	componentDidMount() {
		this._onPullRefresh();
	}

	_fetch(page = 0) {
		return fetch(`https://cnodejs.org/api/v1/topics?page=${page + 1}&limit=${5}`)
			.then(res=>res.json())
			.then(data=>data.data)
	}

	//下拉默认请求第一页数据  (应该是取store数据）
	_onPullRefresh() {
		return this._fetch()
			.then(data=> {
				this.setState({
					listData: data,
					page: 1
				});
			});
	}

	//上滑加载更多  concat  page+1数据
	_onEndReached() {
		this.setState({
			fetchMoreLoading: true
		});
		let startTime = new Date().getTime();
		this._fetch(this.state.page)
			.then(data=> {
				let timeLeft = 1000 - (new Date().getTime() - startTime);  //限流 防止上滑过快 每个分页请求至少给1s缓冲时间
				if (timeLeft > 0) {
					setTimeout(()=> {
						this.setState({
							listData: this.state.listData.concat(data),
							page: this.state.page + 1,
							fetchMoreLoading: false
						})
					}, timeLeft);
				}
				else {
					this.setState({
						listData: this.state.listData.concat(data),
						page: this.state.page + 1,
						fetchMoreLoading: false
					})
				}
			})
			.catch(err=> {
				console.log(err);
				this.setState({
					fetchMoreLoading: false
				});
			});
	}

	_renderItem(item, index) {
		let { title, author } = item;
		let { avatar_url} = author || {};
		return (
			<Link to='/listdetails' key={index}>
			<div key={index} className="item">
				<div className="img-wrapper">
					<img src={avatar_url} alt=""/>
				</div>
				<div className="topic-info-wrapper">
					{title}
				</div>
			</div>
			</Link>
		)
	}

	render() {
		let listview = (
			<ListView
				listViewStyle={{'height':'300px'}}				 //默认高度为window.innerHeight  可自定义
				sysListId={'listview'}							 //自定义列表ID(用于区分多个列表数据共用一个ListView)
				enablePullRefreshEvent={true}					 //是否开启下拉刷新
				enableOnEndReachedEvent={true}					 //是否开启上滑加载  无更多数据设为false
				fetchMoreLoading={this.state.fetchMoreLoading}	 //是否显示加载loading
				onPullRefresh={this._onPullRefresh.bind(this)}   //下拉刷新回调 	重新请求更新store数据
				onEndReached={this._onEndReached.bind(this)}	 //上滑加载回调  原数据concat(请求的page+1数据)
				renderItem={this._renderItem.bind(this)}		 //children
				data={this.state.listData || []}/>			     //listData入口
		);
		let empty = <ListView.Loading/>;
		return (
				<div className="app-wrapper">
					<Router basename={baseUrl}>
					<Switch>
						<Route  exact path="/">{ this.state.listData ? listview : empty}</Route>
						<Route  path="/listdetails" component={ListDetails} />
					</Switch>
					</Router>
				</div>
		)
	}
}

export default App;
