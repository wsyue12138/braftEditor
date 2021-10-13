import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import CreateWbsocket from '@utils/websocket';
import { getUserData } from '@utils/utils';

@connect(({
  global,
  socketetModel
}) => ({
  global,
  socketetModel
}))

class websocketModule extends Component{

	state = {
		_ws:null,
		chatDuplicateLogin:false
	}

	componentDidMount(){
		this.timer = null;
		const { type='index' } = this.props;
		if(type === 'index'){
			//socket连接
			this.createWebsocket();
		}
	}

	componentWillUnmount(){
		const { _ws } = this.state;
		clearTimeout(this.timer);
		if(_ws){
			_ws.close();
		}
	}

	createWebsocket = () => {
		const { host,protocol } = window.location;
		const scokerUrl = protocol === 'http:' ? `ws` : `wss`;
		const options = {
			wsUrl:`${scokerUrl}://${host}/ws`,
			onopen:this.onopen,
			onerror:this.onerror,
			onclose:this.oncloseFun,
			onmessage:this.onmessage
		}
		const _ws = new CreateWbsocket(options);
	}

	//socket连接
	onopen = (e,wsObj) => {
		const { headerType } = this.props;
		this.setWs(wsObj);
		this.setState({_ws:wsObj},() => {
			this.sendFun({type:'ping'});
			this.setChatLogin();
			if(headerType === 'index'){
				this.getAllCount();
			}
		})
	}

	//socket错误
	onerror = (e) => {
		clearTimeout(this.timer);
		this.setSocketState(true);
	}

	//socket断开
	oncloseFun = (e) => {
		clearTimeout(this.timer);
		this.setSocketState(true);
	}

	//socket消息接收
	onmessage = (e) => {
		const data = JSON.parse(e.data);
		const { type } = data;
		switch (type){
			case 'chatInit':
				this.setInit(data);							//初始化
				break;
			case 'pong':									//心跳
				this.heartbeat();
				break;
			case 'chatReceive':								//聊天返回
				this.setChatReceive(data);
				break;
			case 'online':									//在线
				this.setOnline(data);
				break;
			case 'hangUp':									//挂起
				this.setStatus(3);
				break;
			case 'chatLogout':								//离线
				this.setStatus(1);
				break;
			case 'chatSwitch':								//切换用户
				this.setChatSwitch(data);
				break;
			case 'queueInfo':								//排队人数更新
				this.setQueueInfo(data);
				break;
			case 'contactsFresh':							//会话列表更新
				this.setContactsFresh(data);
				break;
			case 'terminate':								//评价
				this.setTerminate(data);
				break;
			case 'quickReply':								//快捷回复
				this.setQuickReply(data);
				break;
			case 'chatDuplicateLogin':						//重复登录
				this.setChatDuplicateLogin(data);
				break;
			case 'contactOutline':							//人员离线
				this.setContactOutline(data);
				break;
			case 'initQueryMsg':							//未读总数
				this.setInitMessagesCount(data);
				break;	
			case 'keepingMessagesCount':					//留言未读
				this.setMessagesCount(data);
				break	
			case 'onlineServiceCount':						//客服未读
				this.setOnlineCount(data);
				break;	
			case 'error':									//错误提示
				this.setError(data);
				break;
			default:
				break;
		}
	}

	//心跳
	heartbeat = () => {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.sendFun({type:'ping'});
		},30000);
	}

	//获取未读消息个数
	getAllCount = () => {
		const { global } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		const sendData = {
			type:'initQueryMsg',
			appId:appid,
			token
		}
		this.sendFun(sendData);
	}

	//login发送
	setChatLogin = () => {
		const { global } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		const sendData = {
			type:'newsLogin',
			appId:appid,
			token
		}
		this.sendFun(sendData);
	}

	//初始化处理
	setInit = (datas) => {
		const { data={} } = datas;
		const { onQueueCount=0,staffCurrentInfo={},recentContacts=[],leastContactFullInfo={} } = data;
		const { chatDetailsVos=[] } = leastContactFullInfo;
		this.heartbeat();
		this.setLineUp(onQueueCount);
		this.setRepeatLogin(false);
		this.setUserInfo(staffCurrentInfo);
		this.setOnlineList(recentContacts);
		this.setCurrentInfo(leastContactFullInfo);
		this.setChatList(chatDetailsVos);
	}

	//消息返回处理
	setChatReceive = (datas) => {
		const hash = window.location.hash;
		const receiveData = datas.data;
		if(hash !== '#/manMachine/customerService'){
			this.setUnreadMessages();
		}else{
			const { socketetModel:{currentInfo} } = this.props;
			const { contactsId } = currentInfo;
			const { fromPersonId=-1,fromType,toPersonId=-1 } = receiveData;
			if(fromType === 1){
				if(contactsId === fromPersonId){
					this.addChatList(receiveData);
				}
				this.activeGetList();
			}else
			if(fromType === 2){
				if(contactsId === toPersonId){
					this.addChatList(receiveData);
				}
				this.activeGetList();
			}else
			if(fromType === 3){
				this.addChatList(receiveData);
			}
		}
	}

	//主动刷新列表
	activeGetList = () => {
		const { global } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		const sendData = {
			type:'contactsFresh',
			appId:appid,
			token
		}
		this.sendFun(sendData);
	}

	//在线
	setOnline = (datas) => {
		const { data={} } = datas;
		const { onQueueCount=0,recentContacts=[],staffCurrentInfo={},leastContactFullInfo={} } = data;
		const { chatDetailsVos=[] } = leastContactFullInfo;
		this.setStatus(3);
		this.setLineUp(onQueueCount);
		this.setRepeatLogin(false);
		this.setUserInfo(staffCurrentInfo);
		this.setOnlineList(recentContacts);
		this.setChatList(chatDetailsVos);
	}

	//切换用户
	setChatSwitch = (datas) => {
		const { data={} } = datas;
		const { chatDetailsVos=[] } = data;
		this.activeGetList();
		this.setCurrentInfo(data);
		this.setChatList(chatDetailsVos);
	}

	//排队人数返回
	setQueueInfo = (datas) => {
		const { data={} } = datas;
		const { count } = data;
		this.setLineUp(count);
	}

	//会话列表更新返回
	setContactsFresh = (datas) => {
		const { data={} } = datas;
		const { recentContacts=[],leastContactFullInfo={} } = data;
		const { contactsId=-1 } = leastContactFullInfo;
		this.setOnlineList(recentContacts);
		if(contactsId === -1){
			this.setChatList([]);
			this.setCurrentInfo({});
		}
	}

	//评价返回
	setTerminate = (datas) => {
		const { data=[] } = datas;
		this.setCurrentInfo({});
		this.setChatList([]);
		this.setOnlineList(data);
	}

	//快捷回复返回
	setQuickReply = (datas) => {
		const { data=[] } = datas;
		this.setQuickReplyContent(data);
	}

	//重复登录
	setChatDuplicateLogin = (datas) => {
		message.warning('请勿重复登录同一帐号！');
		this.setRepeatLogin(true);
	}

	//人员退出
	setContactOutline = (datas) => {
		const { contactsName,contactsId } = datas.data;
		const name = contactsName ? contactsName : contactsId;
		message.warning(`用户  ${name} 已退出!`);
	}

	//错误处理
	setError = (datas) => {
		const { msg='' } = datas;
		message.error(msg);
	}


	//方法

	//发送消息
	sendFun = (data) => {
		const { _ws } = this.state;
		_ws.send(JSON.stringify(data));
	}

	//设置初始化未读数
	setInitMessagesCount = (datas) => {
		const { dispatch } = this.props;
		const data = datas.data;
		dispatch({
			type:'global/initMessagesCount',
			payload:{data}
		})
	}

	//设置留言未读
	setMessagesCount = (data) => {
		const { dispatch } = this.props;
		const { keepingMessagesCount=0 } = data.data;
		dispatch({
			type:'global/setMessagesCount',
			payload:{keepingMessagesCount}
		})
	}
	
	//设置客服未读
	setOnlineCount = (data) => {
		const { dispatch } = this.props;
		const { onlineServiceCount=0 } = data.data;
		dispatch({
			type:'global/setOnlineCount',
			payload:{onlineServiceCount}
		})
	}

	//设置socket
	setWs = (_ws) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setWs',
			payload:{_ws}
		})
	}

	//设置socket状态
	setSocketState = (takeOff) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setSocketState',
			payload:{takeOff}
		})
	}

	//设置自己个人信息
	setUserInfo = (userInfo) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setUserInfo',
			payload:{userInfo}
		})
	}

	//修改在线状态
	setStatus = (selfStatus) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setStatus',
			payload:{selfStatus}
		})
	}

	//更新列表
	setOnlineList = (onlineList) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setOnlineList',
			payload:{onlineList}
		})
	}

	//更新聊天记录
	setChatList = (chatList) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setChatList',
			payload:{chatList}
		})
	}

	//添加聊天记录
	addChatList = (data={}) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/addChatList',
			payload:{data}
		})
	}

	//未读消息数量
	setUnreadMessages = () => {
		const { dispatch,global } = this.props;
		let { unreadNum=0 } = global;
		const num = ++unreadNum;
		dispatch({
			type:'global/setUnreadMessages',
			payload:{unreadNum:num}
		})
	}

	//更新排队人数
	setLineUp = (lineUpNum) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setLineUp',
			payload:{lineUpNum}
		})
	}

	//当前会话人
	setCurrentInfo = (currentInfo) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setCurrentInfo',
			payload:{currentInfo}
		})
	}

	//重复登录处理
	setRepeatLogin = (repeatLogin) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setRepeatLogin',
			payload:{repeatLogin}
		})
	}

	//快捷回复处理
	setQuickReplyContent = (quickList) => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/setQuickReplyContent',
			payload:{quickList}
		})
	}

	//清空全部
	setClearAll = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'socketetModel/clearAll'
		})
	}

	render(){
		return(
			<Fragment></Fragment>
		)
	}
}

export default websocketModule;
