import React,{Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
// import ListViewContent from './listviewcontent';
import Loading from './loading';


const defaultFunc = ()=>null;

class LoadView extends Component {
    //属性类型检查 只是在开发时方便代码校验 因为检查会耗时影响性能 webpack配置相关插件 打包会处理掉
    static propTypes = {
        resistance: PropTypes.number,					//下拉阻力
        onPullRefreshThreshold: PropTypes.number,		//下拉刷新阈值
        onEndReachedThreshold: PropTypes.number,		//触底判定阈值
        minLoadingTime: PropTypes.number,				//下拉最小Loading时间
        enablePullRefreshEvent: PropTypes.bool,			//是否开启下拉刷新
        enableOnEndReachedEvent: PropTypes.bool,		//是否开启上滑加载

        listViewStyle:PropTypes.object,					//最外层DIV样式
        pullUIStyle: PropTypes.object,					//下拉刷新过程中顶部下拉UI样式
        pullUIClassName: PropTypes.string,				//下拉刷新过程中顶部UI类名
        // data: PropTypes.array,							//列表数据

        renderPullUI: PropTypes.func,					//渲染下拉UI
        renderItem: PropTypes.func.isRequired,			//children
        renderFooter: PropTypes.func,					//渲染底部
        onEndReached: PropTypes.func,					//上滑加载回调
        onPullRefresh: PropTypes.func,					//下拉刷新回调
        onScroll: PropTypes.func 						//滚动事件
    };

    //在使用此组件时如果未传入相应props的默认props
    static defaultProps = {
        resistance: 2,									//下拉阻力 2表示(2倍下滑距离 = 下拉UI出现高度)
        onPullRefreshThreshold: 80,						//下拉判定阈值
        data: [],										//列表数据
        minLoadingTime: 1000,							//下拉最小Loading时间
        onEndReachedThreshold: 120,						//触底判定阈值
        enableOnEndReachedEvent: true,					//是否开启上滑加载
        listViewStyle:{height: document.body.clientHeight},		//最外层div高度默认为视口高度
        pullUIStyle: {height: 50},						//下拉刷新过程中顶部下拉UI样式

        renderHeader: defaultFunc,
        renderFooter: defaultFunc,
        onEndReached: defaultFunc,
        onPullRefresh: defaultFunc
    };

    static Loading = Loading;

    constructor(props) {
        super(props);
        this._setDefaultPanProps();
        this.state = {
            loading: false,
            showLoadingInfo: true,
            refresh: false,
            reset: false,
        }
    }

    componentDidMount() {
        this.contentDom = ReactDOM.findDOMNode(this.content);		//dom装载完毕，通过ref回调、findDOMNode获的内容区的真实的dom节点
        this.pullUIDom = ReactDOM.findDOMNode(this.pullUI);			//同理，获得下拉出现的UI的真实的dom节点
        this._setContentPan();
        this._setScrollTop();
    }

    componentDidUpdate(){
        this._setScrollTop();
    }

    componentWillUnmount() {
        clearTimeout(this.doResetTimeout);
    }

    //设置之前存储在sessionStorage里面的内容区的scrollTop
    _setScrollTop(){
        this.contentDom.scrollTop = window.sessionStorage[this.props.sysListId];
    }

    //设置（内容区处于界面可滑动区中）的默认状态——对象
    _setDefaultPanProps() {
        this.pan = {
            pullRefreshEnablePan: false,			//下滑不会出现下拉刷新
            distance: 0,							//未滑动无滑动距离
            startingPositionY: 0,					//未滑动默认的起始位置Y为0
            direction: undefined,					//未滑动无法确定方向
            lastOnEndReachedContentLength: 0		//触底时内容高度
        };
    }

    //touchStart:手指碰到屏幕触发
    _touchStart(e) {
        const touch = e.touches[0];			//获取touch事件对象
        if (!touch) return;
        this.touchStart = touch.pageY;		//设置touchStart那一刻的Y坐标 确定滑动方向需要
    }

    //touchMove:手指在屏幕有滑动连续触发（单纯点击然后离开不会触发）
    _touch(e) {
        const touch = e.touches[0];  					//获取touch事件对象
        if (!touch) return;
        const { pageY } = touch;   						//获取touchMove过程中到这一刻的最新的Y坐标
        if (!this.touchStart) return;   				//这一步其实可以去掉  因为touchMove触发了必然已经触发touchStart
        if (!this.pan.direction) {						//这一步主要是确定滑动方向并进一步初始化内容区状态
            if (this.touchStart < pageY) {
                this.pan.direction = 'down';			//如果touchMove新坐标Y大于touchStart时的Y坐标 判定为下滑
            }
            if (this.touchStart > pageY) {
                this.pan.direction = 'up';				//反之 判定为上滑
            }
            if (this.pan.direction) {					//确定了滑动方向之后
                this._onPanStart({
                    direction: this.pan.direction  		//传入方向 进一步初始化内容区状态  此时还没有直接反应到视图UI中
                });
            }
        }
        if (this.lastTouch) {						 	//如果不是第一次触发touchMove
            let distance = pageY - this.touchStart;  	//计算从touchStart开始，touchMove到现在的滑动距离（此次行为的滑动距离）
            let panEvent = {distance};				 	//逆解构  定义panEvent对象 增加滑动距离属性
            if (this.lastTouch < pageY) {			 	//此时的lastTouch为此次触发的touchMove的再上一次touchMove触发时的pageY（这个涉及到下拉UI的缓慢呈现 所以放到touchMove中做处理）
                this._onPanDown(panEvent);			 	//如果当前这次pageY>上次pageY  调用_onPanDown（传入panEvent对象）
            }
            if (this.lastTouch > pageY) {
                this._onPanUp(panEvent);			 	//反之，调用_onPanUp(传入panEvent对象)
            }
        }
        this.lastTouch = pageY;					   	 	//每次触发touchMove pageY都在变化 lastTouch慢一拍。
    }

    //touchEnd:触摸结束即手指离开屏幕时触发
    _touchEnd() {
        this._onPanEnd();
        this.touchStart = undefined;
        this.lastTouch = undefined;
    }

    //以下三个函数在touchMove中触发
    _onPanStart(e) {
        const { scrollTop } = this.contentDom;						 		//获得内容区顶部卷掉的高度
        if (scrollTop > 0 || !this.props.enablePullRefreshEvent) {  		//如果内容区scrollTop>0(被卷过)或者是listView设定了禁止下拉刷新
            return this.pan.pullRefreshEnablePan = false;					//则在滑动区中的内容区  很显然不能在顶部出现下拉刷新UI
        }

        this.pan.startingPositionY = this.contentDom.scrollTop;				//以界面可滑动区为基准，内容区的相对起始位置Y
        this.pan.direction = e.direction;									//方向在touchMove中得到

        if (this.pan.startingPositionY === 0 && e.direction === 'down') {	//内容区相对于界面可滑动区没有被卷过的高度  同时  此次滑动方向向下
            this.pan.pullRefreshEnablePan = true;							//开启下拉刷新（如果下滑会出现下拉刷新UI）
        }

        this.doingPullDown = true;											//对应视图  下拉刷新UI即将呈现...
    }
    _onPanDown(e) {
        if (!this.pan.pullRefreshEnablePan) return;
        this.pan.distance = e.distance/this.props.resistance;
        this._setContentPan();
        this._setRefresh();
    }
    _onPanUp(e) {
        if (!this.pan.pullRefreshEnablePan) {
            this._reachEnd();
            return;
        }
        const { distance } = e;

        let resistance = this.props.resistance;
        if (!this.pan.pullRefreshEnablePan || this.pan.distance === 0) {
            return;
        }

        if (this.pan.distance < distance / resistance) {
            this.pan.distance = 0;
        } else {
            this.pan.distance = distance / resistance;
        }

        this._setContentPan();
        this._setRefresh();
    }

    //下面这个是在touchEnd中触发
    _onPanEnd() {
        if (!this.pan.pullRefreshEnablePan) {
            this.pan.distance = 0;
            this.pan.pullRefreshEnablePan = false;
            this.pan.direction = undefined;
            return;
        }

        this.contentDom.style.transform = this.contentDom.style.webkitTransform = 'translate3d( 0, ' + this.pullUIDom.offsetHeight + 'px, 0 )';
        this.pullUIDom.style.transform = this.pullUIDom.style.webkitTransform = 'translate3d( 0, ' + 0 + 'px, 0 )';
        this.contentDom.style.transition = this.pullUIDom.style.webkitTransform = 'all .25s ease';
        this.pullUIDom.style.transition = this.pullUIDom.style.webkitTransform = 'all .25s ease';

        if (this.state.refresh) {
            this._doLoading();
        } else {
            this._doReset();
        }
        this.pan.distance = 0;
        this.pan.pullRefreshEnablePan = false;
        this.pan.direction = undefined;
    }

    //监控滚动事件
    _onScroll(e) {
        //同步设置当前列表item滚动高度
        let scrollTop = e.target.scrollTop;
        window.sessionStorage[this.props.sysListId] = scrollTop;
        //监控是否触底
        this._reachEnd();
        // this.props.onScroll && this.props.onScroll(e, this.contentDom);
    }

    //触底判定    规则：列表内容区总高度-(顶部卷去高度+视窗高度）< 定义的触底阈值
    _reachEnd() {
        //获取列表内容区域
        const { scrollHeight, scrollTop, clientHeight }= this.contentDom;
        const currentContentHeight = ReactDOM.findDOMNode(this.listviewContent).clientHeight;
        //是否开启上滑加载&&触底判定公式成立
        if (this.props.enableOnEndReachedEvent && 	scrollHeight - scrollTop - clientHeight < this.props.onEndReachedThreshold && this.pan.lastOnEndReachedContentLength !== currentContentHeight) {
            //触底执行加载更多回调
            this.props.onEndReached();
            this.pan.lastOnEndReachedContentLength = currentContentHeight;
        }
    }

    //设置(内容区)和(下拉UI)随touchMove的不断触发导致的distance的不断变化  出现的此消彼长的样式
    _setContentPan() {
        this.contentDom && (this.contentDom.style.transform = this.contentDom.style.webkitTransform = 'translate3d( 0, ' + this.pan.distance + 'px, 0 )');
        this.pullUIDom && (this.pullUIDom.style.transform = this.pullUIDom.style.webkitTransform = 'translate3d( 0, ' + ( this.pan.distance - (this.props.offsetHeight || this.pullUIDom.offsetHeight) ) + 'px, 0 )');
    }

    _setRefresh() {
        this.setState({
            refresh: this.pan.distance > this.props.onPullRefreshThreshold
        });
    }

    _doLoading() {
        this.setState({
            loading: true
        });
        this._setDefaultPanProps();
        const cb = ()=> {
            const endTime = new Date().getTime();
            const timeLeft = this.props.minLoadingTime - (endTime - startTime);
            if (timeLeft > 0) {
                this.doResetTimeout = setTimeout(()=> {
                    this._doReset();
                }, timeLeft)
            }

            else {
                this._doReset();
            }
        };
        let result = this.props.enablePullRefreshEvent && this.props.onPullRefresh(cb);
        const startTime = new Date().getTime();
        if (typeof result === 'object' && result && typeof result.then === 'function') {
            this.doResetTimeout = setTimeout(()=> {
                result.then(()=> {
                    this._doReset();
                })
                    .catch(err=> {
                        this._doReset();
                    });
            }, this.props.minLoadingTime);
        }
    }

    _doReset() {
        if (!this.doingPullDown) return;
        this.setState({
            loading: false,
            refresh: false,
            reset: true
        });
        this._setDefaultPanProps();
        this._setContentPan();
        this.pan.lastOnEndReachedContentLength = 0;

        const removeReset = ()=> {
            this.setState({
                reset: false
            });
            document.body.removeEventListener('transitionend', removeReset, false);
        };
        document.body.addEventListener('transitionend', removeReset, false);
        this.doingPullDown = false;
    }


    render() {
        let styles = {};
        const transitionStyle = {transition: 'all .25s ease'};
        const { listViewStyle,pullUIStyle} = this.props;

        if (this.pullUI && this.content) {
            styles = {
                content: {
                    transform: this.contentDom.style.transform,
                    WebkitTransform: this.contentDom.style.webkitTransform
                },
                pullUI: {
                    transform: this.pullUIDom.style.transform,
                    WebkitTransform: this.pullUIDom.style.webkitTransform
                }
            };
        }

        if (this.state.loading) {
            styles.loadingInfo = {
                display: 'none'
            };
        }

        if (this.state.reset || this.state.loading) {
            styles.pullUI = {
                ...styles.pullUI,
                ...transitionStyle
            };
            styles.content = {
                ...styles.content,
                ...transitionStyle
            };
            styles.loadingInfo = {
                display: 'none'
            }
        }

        //下拉过程中出现的UI
        const pullUI = (
            <div ref={view=>this.pullUI=view} className={`listview-pull-ui`} style={{...styles.pullUI, ...pullUIStyle}}>
                {this.props.fetchMoreLoading?(this.state.loading && <Loading/>):null}
                <div style={styles.loadingInfo} className="pull-ui-info">
                    <span>{ !this.state.refresh ? '下拉刷新' : '释放刷新'}</span>
                </div>
            </div>
        );

        return (
            <div style={listViewStyle} className="listview-wrapper">
                { this.props.enablePullRefreshEvent && pullUI}
                <div ref={view=>this.content=view}
                     className="listview-content"
                     style={{...styles.content}}
                     onScroll={this._onScroll.bind(this)}
                     onTouchCancel={this._touchEnd.bind(this)}
                     onTouchMove={this._touch.bind(this)}
                     onTouchEnd={this._touchEnd.bind(this)}
                     onTouchStart={this._touchStart.bind(this)}>
                </div>
            </div>
        );
    }
}

export default LoadView;
