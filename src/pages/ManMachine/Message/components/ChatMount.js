import React,{ Component } from 'react';
import { connect } from 'dva';
import { Row,Col,Input,Icon,Upload,message } from 'antd';
import EmojiMouunt from '@components/Emoji';
import ImgUpload from '@components/ImgUpload';
import { modalContent,getUserData } from '@utils/utils';
import styles from './style.less';

const { TextArea } = Input;

export default class MessageChatMount extends Component{
	
	state = {
		val:'',
		picUrls:[]
	}
	
	componentDidMount(){
		this.props.onRef(this);
		this.isSubmit = true;
	}
	
	//发送
	sendRequest = (e=null) => {
		const {val='',picUrls=[]} = this.state;
		const { dispatch,message:{onceData},getList,getData } = this.props;
		const { id } = onceData;
		const payload = {
			commentGroupId:id,
			picUrls:picUrls.length ? picUrls : undefined,
			comment:val
		}
		if(val.trim().length || picUrls.length){
			dispatch({
				type:'message/fetchReplyComment',
				payload,
				callback:(res) => {
					let { success } = res;
					if(success){
						message.success('发送成功');
						const textAreaDom = document.getElementById('chatInput');
						this.setState({val:'',picUrls:[]},() => {
							textAreaDom.focus();
							getData();
							getList();
						});
					}else{
						message.error('发送失败');
					}
				}
			})
		}
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
		let val = '';
		if(value.length <= 300){
			val = value;
		}else{
			val = value.substring(0, 300);
		}
		this.setState({val});
	}
	
	//图片预览
	handleImgOpem = (e,item) => {
		e.preventDefault();
		const { imgOpen } = this.props;
		imgOpen(item)
	}
	
	//删除图片
	handleDeleteImg = (e,index) => {
		e.preventDefault();
		const { picUrls } = this.state;
		let newList = [...picUrls];
		newList.splice(index,1);
		this.setState({picUrls:newList});
	}
	
	//图片列表
	imageList(){
		const { picUrls } = this.state;
		
		return(
			<div className={styles.imageList}>
				<Row gutter={12}>
					{
						picUrls.map((item,index) => {
							return(
								<Col key={index} span={6}>
									<div className={styles.imageOnce}>
										<Icon 
											type="close-circle" 
											className={styles.deleteIcon}
											theme='filled'
											onClick={(e) => this.handleDeleteImg(e,index)}
										/>
										<div 
											className={styles.imageContent}
											style={{ backgroundImage: 'url(' + item + ')' }}
											onClick={(e) => this.handleImgOpem(e,item)}
										></div>
									</div>
								</Col>
							)
						})
					}
				</Row>
			</div>
		)
	}
	
	render(){
		const { val,picUrls } = this.state;
		const { data={} } = getUserData();
		const { token='' } = data;
		let uploadProps = {
			className:styles.imgUpload,
			headers:{token},
			data:{},
			action:'/icservice/common/uploadImg',
			imgList:picUrls,
			maxLen:4,
			maxSize:2,
			successCallback:(response) => {
				const { ret_code,ret_msg } = response;
  				if(ret_code === 1){
  					const { data } = response;
  					const { url='' } = data;
  					modalContent('success','上传成功',true);
  					let newList = [...picUrls];
  					newList.push(url);
  					this.setState({picUrls:newList});
  				}else
  				if(ret_code === 11019){
  					modalContent('warning','仅支持上传jpeg,jpg,png,文件!',true);
  				}else{
  					modalContent('error','上传失败,请稍后重试',true);
  				}
			},
			errorCallback:(res) => {
				modalContent('error','上传失败,请稍后重试',true);
			}
		}
		return(
			<div className={styles.chatBox}>
				<div className={styles.chatOperation}>
					<EmojiMouunt onChange={this.handleEmojiChange} />
					<ImgUpload {...uploadProps} />
				</div>
				<div className={styles.chatContent}>
					<TextArea 
	      				id="chatInput"
						value={val}
						className={picUrls.length ? styles.minTextArea : styles.maxTextArea}
						placeholder='请输入内容'
						onChange={this.handleChange}
					/>
					{
						picUrls.length ? this.imageList() : ''
					}
					
				</div>
			</div>
		)
	}
}
