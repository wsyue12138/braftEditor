import React,{ Component,Fragment }  from 'react';
import { 
	Avatar,
	List
} from 'antd';
import { avatarArr } from '@utils/utils';
import styles from './info.less';

export default class CustomerServiceList extends Component{
	
	state = {
		timeNum:0
	}
	
	componentDidMount(){
		//const newTime = new Date().getTime();
		this.timer = null;
		this.setTimer();
	}
	
	componentWillUnmount(){
		clearInterval(this.timer);
	}
	
	//切换聊天用户
	handleSelectOnce = (item) => {
		const { sendFun } = this.props;
		const { chatPackSeq } = item;
		const sendData = {
			type: "chatSwitch",
			chatPackSeq
		}
		sendFun(sendData,true);
	}
	
	//计时器
	setTimer = () => {
		let { timeNum } = this.state;
		clearInterval(this.timer);
		this.timer = setInterval(() => {
			const newTimeNum = timeNum++;
			this.setState({timeNum:newTimeNum})
		},1000);
	}
	
	//人性化时间处理
	hommizationTime = (updateTime) => {
		const newTime = new Date().getTime();
		let updateDate = new Date(updateTime).getDate();
		let newTimeDate = new Date().getDate();
		let timeTxt = '';
		if(updateDate === newTimeDate){
			let difference = newTime - updateTime;
			if(difference <= 600000){
				timeTxt = '刚刚';
			}else{
				timeTxt = '今天';
			}
		}
		return timeTxt;
	}
	
	//时间显示
	timeFormat = (updateTime) => {
		const newTime = new Date().getTime();
		let timeTxt = '';
		let difference = newTime - updateTime;
		if(difference > 0){
			let num = parseInt(difference / 1000);
			let h = Math.floor(num / 3600);
			let h1 = num % 3600;
			let m = Math.floor(h1 / 60);
			let s = h1 % 60;
			if(h > 0){
				timeTxt = h + 'h';
			}else
			if(m > 0){
				timeTxt = m + 'min';
			}else{
				timeTxt = s + 's';
			}
		}
		return timeTxt;
	}
	
	
	//列表项
	listOnce(item){
		const { newTime } = this.state;
		const { socketetModel } = this.props;
		const { currentInfo={} } = socketetModel;
		const { contactsId='' } = currentInfo;
		const { avatar=6,leastMsg='',leastMsgTime=0,replyStatus=1 } = item;
		const isCurrent = contactsId === item.contactsId;
		return(
			<List.Item 
				style={{position:'relative',background:isCurrent ? '#F3F8FE' : ''}}
			>
				<div 
					className={styles.listOnce} 
					onClick={() => this.handleSelectOnce(item)}
				>
					<div className={styles.avatar}>
						<Avatar 
							style={{width:'100%',height:'100%'}} 
							src={avatarArr[avatar]}
						/>
					</div>
					{
						!isCurrent && replyStatus === -1 ? (
							<div className={styles.creatTime}>
								<div style={{color:'#999999'}}>{this.hommizationTime(leastMsgTime)}</div>
								<div style={{color:'#507CF1'}}>{this.timeFormat(leastMsgTime)}</div>
							</div>
						) : ''
					}
					<div className={styles.content}>
						<p style={{color:'#333333',fontSize:14,lineHeight:'18px',fontWeight:'bold'}} >
							<span title={item.contactsId}>{item.contactsId}</span>
						</p>
						{
							!isCurrent ? (
								<p style={{color:'#999999',fontSize:12,lineHeight:'23px'}} >
									<span title={leastMsg}>{leastMsg}</span>
								</p>
							) : ''
						}
					</div>
				</div>
				{
					isCurrent ? (<span className={styles.currentSign}></span>) : ''
				}
			</List.Item>
		)
	}
	
	render(){
		const { socketetModel } = this.props;
		const { onlineList=[] } = socketetModel;
		return(
			<List
				loading={false}
		      	bordered={false}
		      	split={false}
		      	dataSource={onlineList}
		      	renderItem={item => 
		      		<Fragment>
		      			{this.listOnce(item)}
		      		</Fragment>
		      	}
		    />
		)
	}
}
