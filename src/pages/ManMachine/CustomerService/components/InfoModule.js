import React,{ Component } from 'react';
import { 
	Avatar,
	Icon,
	Popover,
	message
} from 'antd';
import ListModule from './ListModule';
import { getUserData,avatarArr } from '@utils/utils';
import styles from './info.less';

export default class CustomerServiceInfo extends Component{
	
	state = {
		
	}
	
	componentDidMount(){
		
	}
	
	//切换客服模式
	handleChnageState = (state) => {
		const { global,sendFun } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		const sendData = {
			appId:appid,
			token
		};
		if(state === 1){			//离线
			sendData.type = 'chatLogout';
		}else
		if(state === 2){			//在线
			sendData.type = 'online';
		}else
		if(state === 3){			//挂起
			sendData.type = 'hangUp';
		}
		sendFun(sendData,true);
	}
	
	//客服人员部分
	selfModule(){
		const { socketetModel } = this.props;
		const { userInfo={} } = socketetModel;
		const { staffStatus=1,staffName='',avatar=0 } = userInfo;
		let stateIcon;
		if(staffStatus === 2){
			stateIcon = (<Icon className={styles.stateIcon} type="check-circle" theme='filled' style={{color:'#5FDC8C'}} />)
		}else
		if(staffStatus === 3){
			stateIcon = (<Icon className={styles.stateIcon} type="minus-circle" theme='filled' style={{color:'#FFAC1F'}} />)
		}else
		if(staffStatus === 1){
			stateIcon = (<Icon className={styles.stateIcon} type="clock-circle" theme='filled' style={{color:'#909090'}} />)
		}
		let content = (
			<div className={styles.stateContent}>
				<div className={styles.contentOnce} onClick={() => this.handleChnageState(2)} >
					{staffStatus === 2 ? (<span className={styles.currentState}>√</span>) : ''}
					<Icon className={styles.stateIcon} type="check-circle" theme='filled' style={{color:'#5FDC8C',marginRight:5}} />
					在线
				</div>
				<div className={styles.contentOnce} onClick={() => this.handleChnageState(3)} >
					{staffStatus === 3 ? (<span className={styles.currentState}>√</span>) : ''}
					<Icon className={styles.stateIcon} type="minus-circle" theme='filled' style={{color:'#FFAC1F',marginRight:5}} />
					挂起
				</div>
				<div className={styles.contentOnce} onClick={() => this.handleChnageState(1)} >
					{staffStatus === 1 ? (<span className={styles.currentState}>√</span>) : ''}
					<Icon className={styles.stateIcon} type="clock-circle" theme='filled' style={{color:'#909090',marginRight:5}} />
					离线
				</div>
			</div>
		)
		return(
			<div className={styles.selfBox}>
				<div className={styles.avatar}>
					<Avatar 
						style={{width:'100%',height:'100%'}} 
						src={avatarArr[avatar]}
					/>
					<Popover placement="rightTop" content={content} trigger="hover" overlayClassName={styles.popover}>
        				<span className={styles.stateIconBox}>
							{stateIcon}
						</span>
      				</Popover>
				</div>
				<span className={styles.selfName} title={staffName}>{staffName}</span>
				<span className={styles.tips}>客服</span>
			</div>
		)
	}
	
	//排队列表
	listModule(){
		const { socketetModel } = this.props;
		const { onlineList=[],lineUpNum=0 } = socketetModel;
		const conversationNum = onlineList.length;
		const lineUpTxt = lineUpNum <= 30 ? lineUpNum : '30+';
		return(
			<div className={styles.chatListBox}>
				<div 
					className={styles.numberBox} 
					style={{top:0,borderBottom:'1px solid #e8e8e8'}}
				>
					{`会话中 ( ${conversationNum} )`}
				</div>
				<div 
					className={styles.numberBox} 
					style={{bottom:0,borderTop:'1px solid #e8e8e8'}}
					title={`当前排队人数 ${lineUpNum} 人`}
				>
					{`排队中 ( ${lineUpTxt} )`}
				</div>
				<div className={styles.contentBox}>
					<ListModule {...this.props} />
				</div>
				
			</div>
		)
	}
	
	render(){
		return(
			<div className={styles.listBox}>
				<div className={styles.listContent}>
					{this.selfModule()}
					{this.listModule()}
				</div>
			</div>
		)
	}
}
