import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Input,
	Button,
	Icon,
	Popover,
	Empty,
	Modal
} from 'antd';
import EmojiMouunt from '@components/Emoji';
import ImgUpload from '@components/ImgUpload';
import { modalContent,getUserData } from '@utils/utils';
import styles from './send.less';

const { TextArea } = Input;

export default class ChatSendModule extends Component{

	state = {
		val:'',
		visible:false,
		sendContent:''
	}

	componentWillReceiveProps(nextProps){
		const { customerService } = nextProps;
		const { sendContent='' } = customerService;
		if(sendContent !== this.props.customerService.sendContent){
			this.setState({val:sendContent});
		}
	}

	componentDidMount(){
		this.timer = null;
		this.isSubmit = true;
	}

	//发送
	sendRequest = (e=null) => {
		const { dispatch } = this.props;
		const {val='',imgList} = this.state;
		if(val.trim().length){
			this.sendCallback(val);
		}
	}

	//提交回调
	sendCallback = (content) => {
		const { dispatch,global,socketetModel:{currentInfo,userInfo},sendFun } = this.props;
		const { appid='' } = global;
		const { chatPackSeq='',contactsId='',contactsName='' } = currentInfo;
		const { staffId='',staffName='' } = userInfo;
		const sendData = {
			type:'chatSend',
			appId:appid,
			data:{
				chatPackSeq,
				fromPersonId:staffId,
				fromPersonName:staffName,
				toPersonId:contactsId,
				toPersonName:contactsName,
				chatType:'common',
				msg:content
			}
		}
		sendFun(sendData,true,() => {
			const textAreaDom = document.getElementById('chatInput');
			this.setState({val:''},() => {
				dispatch({
					type:'customerService/changeContent',
					payload:{sendContent:''}
				});
				textAreaDom.focus();
			})
		})
	}

	//回车发送
	handlePressEnter = (e) => {
		e.preventDefault();
		e.returnValue = false;
		this.sendRequest(e);
	}

	//表情选择
	handleEmojiChange = (data) => {
	  	const { val } = this.state;
	  	if(val.length < 300){
	  		const textAreaDom = document.getElementById('chatInput');
		  	this.setState({val:val + '' + data},() => {
		  		textAreaDom.focus();
		  	});
	  	}
	}

	//内容改变
	handleChange = ({ target: { value } }) => {
		const { dispatch } = this.props;
		let firstVal = value.substr(0,1);
		let isShow = false;
		let val = '';
		if(value.length <= 300){
			val = value;
		}else{
			val = value.substring(0, 300);
		}
		if(firstVal != '' && firstVal === '/'){
			isShow = true;
			this.searchQuick(val);
		}
		this.setState({val,visible:isShow});
	}

	//快捷搜索
	searchQuick = (value) => {
		const { global,sendFun } = this.props;
		const { appid='' } = global;
		const { data={} } = getUserData();
		const { token='' } = data;
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			let searchVal = value.substr(1);
			const sendData = {
				type:'quickReply',
				keyword:searchVal,
				appId:appid,
				token
			}
			sendFun(sendData,true);
		},500);
	}

	//选中快捷
	handleClickQuick = (val) => {
		const { dispatch } = this.props;
		this.setState({val,visible:false},() => {
			dispatch({
				type:'socketetModel/clearQuick',
			});
		})
	}

	//评价
	handleEvaluate = () => {
		const { dispatch,global,socketetModel:{currentInfo},sendFun } = this.props;
		const { appid='' } = global;
		const { chatPackSeq } = currentInfo;
		const { data={} } = getUserData();
		const { token='' } = data;
		if(chatPackSeq){
			Modal.confirm({
	    		title: '是否确认结束对话并发送满意度评价',
	    		content: '',
	    		className:'selfModal',
	    		centered:true,
	    		okText: '是',
	    		cancelText: '否',
	    		onOk:() => {
	    			const sendData = {
	    				type:'terminate',
	    				chatPackSeq,
	    				appId:appid,
	    				token
	    			}
	    			sendFun(sendData,true);
	    		}
	  		});
		}
	}

	//快捷内容
	quickContent(){
		const { socketetModel } = this.props;
		const { quickList=[] } = socketetModel;
		return(
			<Fragment>
				{
					quickList.length ? (
						<div className={styles.quickContent}>
							{
								quickList.map((item,index) => {
									const { content='',id } = item;
									return(
										<p
											key={id}
											title={content}
											onClick={() => this.handleClickQuick(content)}
										>
											{content}
										</p>
									)
								})
							}
						</div>
					) : ''
				}
			</Fragment>
		)
	}

	render(){
		const { socketetModel } = this.props;
		const { quickList=[] } = socketetModel;
		const { val,visible } = this.state;
		return(
			<div className={styles.chatBox}>
				<div className={styles.chatOperation}>
					<EmojiMouunt onChange={this.handleEmojiChange} />
					<Icon
						type="like"
						title='评价'
						style={{fontSize:'22px',color:'#333',marginLeft:30,cursor:'pointer'}}
						onClick={this.handleEvaluate}
					/>
				</div>
				<div className={styles.chatContent}>
					<Popover
						overlayClassName={styles.popoverBox}
						visible={visible && quickList.length > 0}
						placement="bottomLeft"
						title=''
						content={this.quickContent()}
						trigger="click"
					>
        				<span className={styles.quick}></span>
      				</Popover>
					<TextArea
	      				id="chatInput"
						value={val}
						className={styles.maxTextArea}
						placeholder='请输入内容'
						onChange={this.handleChange}
						onPressEnter={this.handlePressEnter}
					/>
				</div>
				<div className={styles.btnBox}>
					<Button type="primary" onClick={this.sendRequest}>发送</Button>
				</div>
			</div>
		)
	}
}
