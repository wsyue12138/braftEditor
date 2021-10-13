import React,{ Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import ListModule from './components/InfoModule';
import ChatModule from './components/ChatModule';
import RelevantModule from './components/RelevantModule'
import { getUserData } from '@utils/utils';

@connect(({
	global,
	user,
	customerService,
	socketetModel
}) => ({
	global,
	user,
	customerService,
	socketetModel
}))

class CustomerService extends Component{

	state = {
		_ws:null
	}

	componentWillReceiveProps(nextProps){
		const { socketetModel } = nextProps;
		const { _ws=null,takeOff } = socketetModel;
		if(!this.props.socketetModel._ws && JSON.stringify(_ws) !== JSON.stringify(this.props.socketetModel._ws)){
			this.setState({_ws},() => {
				this.setChatLogin();
			});
		}else{
			if(this.props.socketetModel.takeOff && !takeOff){
				message.success('聊天服务已连接');
				this.setChatLogin();
			}
		}
	}

	componentDidMount(){
		const { socketetModel } = this.props;
		const { _ws } = socketetModel;
		if(_ws){
			this.setChatLogin();
		}
		this.clearUnreadNum();
	}

	//清除未读
	clearUnreadNum = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'global/setUnreadMessages',
			payload:{unreadNum:0}
		})
	}

	//login发送
	setChatLogin = () => {
		const { global } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		const sendData = {
			type:'chatLogin',
			appId:appid,
			token
		}
		this.sendFun(sendData);
	}

	//发送消息
	sendFun = (data,showMessage=false,callback) => {
		const { socketetModel } = this.props;
		const { _ws,repeatLogin,takeOff,currentInfo={} } = socketetModel;
		const { contactsId=-1 } = currentInfo;
		if(repeatLogin){
			message.warning('请勿重复登录同一帐号！');
		}else
		if(contactsId === -1 && data.type === 'chatSend'){
			return false;
		}else{
			if(takeOff && showMessage){
				message.error('聊天服务已断开,请稍后再试!');
			}else{
				if(_ws){
					_ws.send(JSON.stringify(data));
				}
				if(callback){
					callback();
				}
			}
		}
	}
	render(){
		const { _ws } = this.state;
		return(
			<div style={{width:'100%',height:'100%'}}>
				<ListModule {...this.props} sendFun={this.sendFun} />
				<RelevantModule {...this.props} sendFun={this.sendFun} />
				<ChatModule {...this.props} sendFun={this.sendFun} />
			</div>
		)
	}
}

export default CustomerService;
