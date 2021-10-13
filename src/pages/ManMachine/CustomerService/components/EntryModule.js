import React,{ Component,Fragment } from 'react';
import { List,Avatar,Button,Icon } from 'antd';
import $ from  'jquery';
import ImgModal from '@components/ImgModal';
import emojiStyle from '@components/Emoji/emoji.less';
import { avatarArr } from '@utils/utils';
import styles from './entry.less';

const jEmoji = require('emoji');

class ChatEntryModule extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			loading:false,
			previewVisible:false,
			previewImage:''
		}
	}
	
	componentDidMount(){
		let _height = $('#entryBox').height() + $('#entryBox').scrollTop();
		$('#entryBox').scrollTop($('#entryBox')[0].scrollHeight);
	}
	
	componentDidUpdate(prevProps,prevState){
		const { socketetModel } = this.props;
		const { chatList=[] } = socketetModel; 
		const prevChatList = prevProps.socketetModel.chatList;
		if(JSON.stringify(chatList) !== JSON.stringify(prevChatList) ){
			if(chatList.length > 1){
				const _index = chatList.length - 1;
				const lastObj = chatList[_index];
				const { fromType } = lastObj;
				let _height = $('#entryBox').height() + $('#entryBox').scrollTop();
				if($('#entryBox')[0].scrollHeight - _height <= 180 || fromType !== 1){
					$('#entryBox').scrollTop($('#entryBox')[0].scrollHeight);
				}
			}
		}
	}
	
	//打开图片弹窗
	handleOpenImg = (previewImage) => {
		this.setState({previewVisible:true,previewImage});
	}
	
	//关闭图片弹窗
	handleCancelImg = () => {
		this.setState({previewVisible:false,previewImage:''});
	}
	
	//时间模式
	setTimePattern = (createTime) => {
		const newTime = new Date(createTime);
        let month = newTime.getMonth() + 1;
        let day = newTime.getDate();
        let hour = newTime.getHours();
        let min = newTime.getMinutes();
        let sen = newTime.getSeconds();
        let returnTime = this.getzf(month) + '-' + this.getzf(day) + ' ' + this.getzf(hour) + ':' + this.getzf(min) + ':' + this.getzf(sen);//最后拼接时间
        return returnTime;
	}
	
	//位数补齐
	getzf = (num) => {
		if (parseInt(num) < 10) {
            num = '0' + num;
        }
        return num;
	}
	
	//提醒消息
	tipOnce(data){
		const { content='' } = data;
		return(
			<div className={styles.tipOnce}>
				{content}
			</div>
		)
	}
	
	//消息内容
	msgModule(item,index){
		const { socketetModel } = this.props;
		const { chatList=[],userInfo } = socketetModel;
		const { staffName } = userInfo;
		const { avatar=6,msg='',chatType,fromPersonId,createTime,fromType } = item;
		let difference = 0;
		let contentModule = '';
		if(chatType === 'transSplit'){
			const msgContent = '由  机器人  转接给  ' + staffName + ' 接待';
			
			contentModule = (
				<Fragment>
					{this.tipOnce({content:msgContent})}
					{this.tipOnce({content:this.setTimePattern(createTime)})}	
				</Fragment>
			)
		}else{
			let content = '';
			if(chatType === 'common'){
				const txt = msg.replace(/\n/g, '<br/>');
				const html = jEmoji.unifiedToHTML(txt);
				content = (
					<div className={styles.txtContent}>
						<span className={emojiStyle.chatOnce} dangerouslySetInnerHTML={{__html:html}} />
					</div>
				)
			}else
			if(chatType === 'pic'){
				content = (
					<div className={styles.picContent}>
						<img src={msg} onClick={() => this.handleOpenImg(msg)} />
					</div>
				)
			}
			if(index){
				const prevOnce = chatList[index - 1];
				difference = createTime - prevOnce.createTime;
			}
			contentModule = (
				<Fragment>
					{
						difference > 60000 ? this.tipOnce({content:this.setTimePattern(createTime)}) : '' 
					}
					<div className={fromType === 1 ? styles.otherOnce : styles.machineOnce}>
						<div className={styles.avatar}>
							<Avatar src={avatarArr[avatar]} style={{width:35,height:35}}/>
						</div>
						<div className={styles.content}>
							{content}
						</div>
					</div>
				</Fragment>
			)
		}
		return(
			<Fragment>
				{contentModule}
			</Fragment>
		)
	}
	
	//内容部分
	contentBox(){
		const { socketetModel } = this.props;
		const { chatList=[] } = socketetModel;
		return(
			<Fragment>
				{
					chatList.map((item,index) => {
						const { chatType } = item;
						const content = this.msgModule(item,index);
						return (
							<div className={styles.onceBox} key={index}>
								{content}
							</div>
						);
					})
				}
			</Fragment>
		)
	}
	
	render(){
		const { previewVisible,previewImage } = this.state;
		return(
			<div id="entryBox" className={styles.entryBox}>
				<div className={styles.contentBox}>
					{this.contentBox()}
				</div>
				<ImgModal 
					visible={previewVisible}
					previewImage={previewImage}
					onCancel={() => this.handleCancelImg()}
				/>
			</div>
		)
	}
}

export default ChatEntryModule;