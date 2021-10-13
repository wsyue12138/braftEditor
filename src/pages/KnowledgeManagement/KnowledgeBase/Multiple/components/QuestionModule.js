import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Icon,
	message
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import styles from './style.less';

const { TextArea } = Input;

@Form.create()

class MultipleQuestion extends Component{
	state = {
		visible:false
	}
	
	componentDidMount(){
		const { multiple:{multipleDrawerType} } = this.props;
		this.props.onRef(this);
		if(multipleDrawerType !== 'edit'){
			this.getEditHistory();
		}
		this.isSubmit = true;
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'multiple/clearNodeType'
		})		
	}
	
	//获取历史修改
	getEditHistory = () => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchGetOriginQaKnowledge',
			payload:{id}
		})	
	}
	
	//保存
	handleSave = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { multiple:{multipleDrawerType} } = this.props;
		switch (multipleDrawerType){
			case 'edit':
				this.getFormData(multipleDrawerType);
				break;
			case 'examine':
				this.getFormData(multipleDrawerType);
				break;
			case 'handle':
				this.handleRequest(1);
				break;
			case 'complete':
				this.completeRequest();
				break;
			default:
				break;
		}
	}
		
	//不通过
	handleFailed = () => {
		this.setState({visible:true});
	}
	
	//获取表单信息
	getFormData = (multipleDrawerType) => {
		const { serviceType,selectedOnce } = this.state;
		const { dispatch,form:{validateFields} } = this.props;
		validateFields(['nodeContent'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			if(multipleDrawerType === 'edit'){
				this.editRequset(values);
			}else{
				this.examineRequest(1,values);
			}
		})
	}
	
	//抽屉关闭
	handleClose = () => {
		this.setState({visible:false});
	}
	
	//不通过
	handleSaveReason = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { dispatch,form:{validateFields},multiple:{multipleDrawerType} } = this.props;
		validateFields(['handleDescription'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			if(multipleDrawerType === 'examine'){
				this.examineRequest(2,values);
			}else{
				this.handleRequest(2,values);
			}
		})
	}
	
	//编辑请求
	editRequset = (payload) => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchUpdateQaKnowledge',
			payload:{...payload,id},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//审核请求
	examineRequest = (result,payload) => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchAuditQaKnowledge',
			payload:{...payload,id,result},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//处理
	handleRequest = (result,payload={}) => {
		const { dispatch,multiple:{detailData},updateProcedure } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchTesHandleQaKnowledge',
			payload:{...payload,id,result},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//处理完成
	completeRequest = () => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchTesHandleQaKnowledge',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}

	//关闭总弹窗
	handleBoxClose = (success) => {
		const { dispatch,updateProcedure,multiple:{onceData} } = this.props;
		if(success){
			message.success('操作成功');
			this.setState({visible:false},() => {
				updateProcedure();
				dispatch({
					type:'multiple/setMultipleVisible',
					payload:{multipleVisible:false,onceData}
				})	
			})
		}else{
			message.error('操作失败');
		}
		this.isSubmit = true;
	}
	
	//内容
	formContent = (formType='') => {
		const { 
			form:{getFieldDecorator},
			multiple:{onceData,detailData,originKnowledge,multipleDrawerType}
		} = this.props;
		const { lastUpdateTime='',lastUpdatePersonName='' } = detailData;
		let questionDisabled;
		if(multipleDrawerType === 'edit' || multipleDrawerType === 'examine'){
			questionDisabled = false;
		}else{
			questionDisabled = true;
		}
		return(
			<div className={styles.formBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<Form.Item label='关键词'>
			        	{getFieldDecorator('keyword',{
			        		initialValue:onceData.nodeContent,
				        })(
				        	<Input placeholder="请输入关键字" disabled />
				        )}
				    </Form.Item>
				    {
				    	multipleDrawerType !== 'edit' && originKnowledge != null ? (
				    		<Form.Item label='原节点问句'>
					        	{getFieldDecorator('originalQuestion',{
					        		initialValue:originKnowledge.formerNodeContent,
						        })(
						        	<TextArea placeholder="请输入原节点问句" rows={10} style={{resize: 'none'}} disabled />
						        )}
						    </Form.Item>
				    	) : ''
				    }
				    <Form.Item label='节点问句'>
			        	{getFieldDecorator('nodeContent',{
			        		initialValue:detailData.nodeContent,
			        		rules: [
				        		{ 
				        			required: multipleDrawerType === 'edit' || multipleDrawerType === 'examine' ? true : false,
				        			message:'请输入节点问句'
				        		}
				        	]
				        })(
				        	<TextArea 
				        		placeholder="请输入节点问句" 
				        		rows={multipleDrawerType !== 'edit' && originKnowledge != null ? 10 : 20}
				        		style={{resize: 'none'}}
				        		disabled={questionDisabled} 
				        	/>
				        )}
				    </Form.Item>
				    {
				    	multipleDrawerType !== 'edit' ? (
				    		<Fragment>
				    			<Form.Item label="申请人">
						        	{getFieldDecorator('applicant',{
						        		initialValue:lastUpdatePersonName
							        })(
							        	<Input disabled />
							        )}
							    </Form.Item>
							    <Form.Item label="申请时间">
						        	{getFieldDecorator('applicantTime',{
						        		initialValue:lastUpdateTime
							        })(
							        	<Input disabled />
							        )}
							    </Form.Item>
				    		</Fragment>
				    	) : ''
				    }
				</Form>
			</div>
		)
	}
	
	//原因抽屉
	drawerContent(){
		const { visible } = this.state;
		const { form:{getFieldDecorator},multiple:{multipleDrawerType} } = this.props;
		const title = multipleDrawerType === 'examine' ? '知识库管理/问句审核/审核不通过说明' : '知识库管理/问句处理/无法处理说明';
		const label = multipleDrawerType === 'examine' ? '审核不通过说明' : '无法处理说明';
		const content = (
			<div className={styles.drawerBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<Form.Item label={label}>
				        {getFieldDecorator('handleDescription',{
				        	rules: [
				        		{ 
				        			required: true,
				        			message:'请选输入内容'
				        		}
				        	]
				        })(
				        	<TextArea rows={6} style={{resize: 'none'}} placeholder="请输入内容" />
				        )}
				    </Form.Item>
				</Form>
			</div>
		)
		let drawerOptions = {
			content,
			onCancel:this.handleClose,
			okText:'保存',
			onOk:this.handleSaveReason,
			size:'small'
		}
		
		let drawerProps = {
			title:title,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount drawerProps={drawerProps} {...drawerOptions} />
		)
	}
	
	render(){
		const { multiple:{multipleDrawerType} } = this.props;
		return(
			<div className={styles.drawerBox}>
				{this.formContent()}
				{ multipleDrawerType === 'examine' || multipleDrawerType === 'handle' ? this.drawerContent() : ''}
			</div>
		)
	}
}

export default MultipleQuestion;