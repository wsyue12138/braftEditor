import React,{ Component } from 'react';
import { connect } from 'dva';
import { Modal } from 'antd';
import ChatMount from './ChatMount';
import MessageList from './MessageList';
import ImgModal from '@components/ImgModal';
import styles from './style.less';

export default class MessageDrawerContent extends Component{
	
	state = {
		loading:false,
		previewVisible:false,
		previewImage:''
	}
	
	componentDidMount(){
		this.props.onRef(this);
		this.getMessageData();
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'message/clearDetail'
		})
	}
	
	//获取留言
	getMessageData = () => {
		const { dispatch,message } = this.props;
		const { onceData={} } = message;
		const { id } = onceData;
		this.setState({loading:true});
		dispatch({
			type:'message/fetchGetCommentDetails',
			payload:{commentGroupId:id},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//打开图片弹窗
	handleOpenImg = (previewImage) => {
		this.setState({previewVisible:true,previewImage});
	}
	
	//关闭图片弹窗
	handleCancelImg = () => {
		this.setState({previewVisible:false,previewImage:''});
	}
	
	//发送
	handleSend = () => {
		this.childModule.sendRequest();
	}
	
	render(){
		const { previewVisible,previewImage,loading } = this.state;
		const { message:{drawerType} } = this.props;
		return(
			<div style={{width:'100%',height:'100%'}}>
				<MessageList {...this.props} imgOpen={this.handleOpenImg} listLoading={loading} />
				{
					drawerType === 'reply' ? (
						<ChatMount {...this.props} imgOpen={this.handleOpenImg} onRef={this.onRef} getData={this.getMessageData} />
					) : ''
				}
				<ImgModal 
					visible={previewVisible}
					previewImage={previewImage}
					onCancel={() => this.handleCancelImg()}
				/>
			</div>
		)
	}
}
