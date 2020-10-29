import React, {Component} from 'react';
import './Comment.css'
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
export default class Comment extends Component {
    constructor(props){
        super(props);
        this.state={
           focus:false
        }
    }
    onFocus(){
        console.warn(111)
        this.setState({focus:true});
    }
    render() {
        return (
            <div className="Comment">
                {/*<Input style={{flex:1}} onFocus={()=>()=>this.onFocus()}  placeholder="说点什么呢..." multiline />*/}
                {/*<TextField*/}
                    {/*id="multiline-flexible"*/}
                    {/*// label="Multiline"*/}
                    {/*multiline*/}
                    {/*rowsMax="4"*/}
                    {/*// className={classes.textField}*/}
                    {/*margin="normal"*/}
                {/*/>*/}

                <input  multiline={true} className="TextInput" onFocus={()=>this.onFocus()} placeholder={'说点什么吧...'} type="text"/>
                {/*<div onClick={() => this.props.like.isLike()}>*/}
                    {/*<i className={'iconfont icon-dianzan1'} style={{color:this.props.like.liked?"#ff5651":null}}></i>*/}
                {/*</div>*/}
                {/*<div onClick={() => this.props.collect.isCollect()}>*/}
                    {/*<i className={'iconfont icon-wode_shoucang'} style={{color:this.props.collect.collected?"#ff5651":null}}></i>*/}
                {/*</div>*/}
                {/*<div onClick={() => this.props.share.isShare()}>*/}
                    {/*<i className={'iconfont icon-fenxiang1'} style={{color:this.props.share.shared?"#ff5651":null}}></i>*/}
                {/*</div>*/}
                {this.state.focus?( <Button onClick={()=>alert(111)} variant="contained" color="primary" size={'small'}>
                    提交
                </Button>):null}
            </div>
        )
    }
}