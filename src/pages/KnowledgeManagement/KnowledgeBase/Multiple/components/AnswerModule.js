import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Icon,
	message,
	Popover
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import { lineBreak } from '@utils/utils';
import styles from './style.less';

const { TextArea } = Input;

@Form.create()

class MultipleAnswer extends Component{
	
	state = {
		answerList:[{}],
		visible:false,
		relateAnswerInfo:[]
	}
	
	componentDidMount(){
		const { multiple:{multipleDrawerType} } = this.props;
		this.props.onRef(this);
		this.setInitVal();
		if(multipleDrawerType !== 'edit'){
			this.getEditHistory();
		}
		this.getQaRelateAnswerInfo();
		this.isSubmit = true;
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'multiple/clearNodeType'
		})		
	}
	
	//获取历史修改
	getQaRelateAnswerInfo = () => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchGetQaRelateAnswerInfo',
			payload:{nodeId:id},
			callback:(res) => {
				const { success } = res;
				if(success){
					const { data=[] } = res.data;
					this.setState({relateAnswerInfo:data});
				}
			}
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
		const { changeLogUuid,id } = detailData;
		dispatch({
			type:'multiple/fetchAuditQaKnowledge',
			payload:{...payload,id,result},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//处理请求
	handleRequest = (result,payload={}) => {
		const { dispatch,multiple:{detailData},updateProcedure } = this.props;
		const { id } = detailData;
		console.log(111)
		dispatch({
			type:'multiple/fetchTesHandleQaKnowledge',
			payload:{...payload,id,result},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//处理完成请求
	completeRequest = () => {
		
	}
	
	//初始设置
	setInitVal = () => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { answerList=[] } = detailData;
		this.setState({answerList});
	}
	
	//保存
	handleSave = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { multiple:{multipleDrawerType} } = this.props;
		if(multipleDrawerType === 'complete'){
			this.completeRequest();
		}else{
			this.getFormData(multipleDrawerType);
		}
	}
	
	//获取表单信息
	getFormData = (multipleDrawerType) => {
		const { serviceType,selectedOnce } = this.state;
		const { dispatch,form:{setFields} } = this.props;
		const childAnswers = this.setAnswerList();
		if(childAnswers.length){
			if(multipleDrawerType === 'edit'){
				this.editRequset({childAnswers});
			}else
			if(multipleDrawerType === 'examine'){
				this.examineRequest(1,{childAnswers});
			}else
			if(multipleDrawerType === 'handle'){
				this.handleRequest(1);
			}
			
		}else{
			this.isSubmit = true;
		}
	}
	
	//打开不通过抽屉
	handleFailed = () => {
		this.setState({visible:true});
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
		const { dispatch,form:{validateFields},multiple } = this.props;
		const { multipleDrawerType } = multiple;
		validateFields(['handleDescription'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			if(multipleDrawerType === 'examine'){
				const childAnswers = this.setAnswerList();
				this.examineRequest(2,{...values,childAnswers});
			}else{
				this.handleRequest(2,{...values});
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
	
	//设置答案表单id数组
	setFormList = (data) => {
		const list = data.reduce(function (prev, cur,index) {
		    prev.push('nodeContent_' + index);
		    return prev;
		},[]);
		return list;
	}
	
	//答案改变
	handleAnswerChange = (e,index) => {
		const { answerList } = this.state;
		const answer = e.target.value;
		let list = JSON.parse(JSON.stringify(answerList));
		let obj = answerList[index];
		obj.answer = answer;
		list.splice(index,1,obj);
		this.setState({answerList:list});
	}
	
	//答案判断
	setAnswerList = () => {
		const { form:{setFields} } = this.props;
		const { answerList } = this.state;
		let childAnswers = [];
		let isReturn = true;
		answerList.map((item,index) => {
			const { knowledgeId,parentId,answer='' } = item;
			if(answer.trim() != ''){
				let obj = {id:knowledgeId,answer:lineBreak(answer),knowledgeId:parentId};
				childAnswers.push(obj);
			}else{
				isReturn = false;
				setFields({
					['nodeContent_' + index]: {
	                	value: '',
	                	errors: [new Error('答案不可为空')],
	              	}
	            });
			}
		})
		return isReturn ? childAnswers : [];
	}
	
	//添加答案
	handleAdd = () => {
		const { answerList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(answerList));
		resetFields(this.setFormList(list));
		list.push({});
		this.setState({answerList:list});
	}
	
	//删除答案
	handleDelete = (index) => {
		const { answerList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(answerList));
		list.splice(index,1);
		resetFields(this.setFormList(list));
		this.setState({answerList:list});
	}
	
	//判断是否是json数据
	isJsonString = (str) => {
		let isJson = false;
		try {
			if (typeof JSON.parse(str) == "object") {
				isJson = true;
			}
		} catch(e) {
			
		}
		return isJson;
	}
	
	//答案提示
	setAnswerTip = (type,data) => {
		const { relateAnswerInfo=[] } = this.state;
		const _len = relateAnswerInfo.length;
		if(type === 'once'){
			let isShow = false;
			let relateContent = '';
			if(_len){
				const _index = relateAnswerInfo.findIndex((item) => item.answerId === data);
				const obj = relateAnswerInfo[_index];
				if(_index !== -1){
					const { relateAnswers=[] } = obj;
					isShow = true;
					relateContent = (
						<div>
		    				{
		    					relateAnswers.map((item,index) => {
		    						const { question='' } = item;
		    						return(
		    							<div
		    								key={index}
		    								className={styles.relateQuestion}
		    								style={{marginTop:index === 0 ? 0 : 2}}
		    							>
		    								{question}
		    							</div>
		    						)
		    					})
		    				}
		  				</div>
					)
				}
			}
			return { isShow,relateContent };
		}else{
			let isShow = true;
			data.map((item,index) => {
				const { knowledgeId } = item;
				const _index = relateAnswerInfo.findIndex((item) => item.answerId === knowledgeId);
				if(_index !== -1){
					isShow = false;
				}
			})
			return isShow;
		}
		
	}
	
	//内容
	formContent = (formType='') => {
		const { answerList } = this.state;
		const { 
			form:{getFieldDecorator},
			user,
			multiple:{onceData,detailData,originKnowledge,multipleDrawerType}
		} = this.props;
		const { userdata={} } = user;
		const { userCode } = userdata;
		const { lastUpdateTime='',lastUpdatePersonName='' } = detailData;
		const answerLen = answerList.length;
		const isRelation = this.setAnswerTip('all',answerList);
		let formerAnswerList = [];
		if(originKnowledge){
			const { formerAnswer='[]' } = originKnowledge;
			if(formerAnswer && this.isJsonString(formerAnswer)){
				formerAnswerList = JSON.parse(formerAnswer);
			}
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
				    	multipleDrawerType !== 'edit' && originKnowledge != null && formerAnswerList.length ? (
				    		<Fragment>
				    			<Form.Item label='原节点答案' style={{marginBottom:0}}>
							        {getFieldDecorator('answer_' + formType)(
							        	<Fragment></Fragment>
							        )}
							    </Form.Item>
				    			{
				    				formerAnswerList.map((item,index) => {
				    					const { answer='' } = item;
				    					let rows;
				    					return(
				    						<Form.Item key={index}>
										        {getFieldDecorator(`answer_${index}_${formType}`,{
										        	initialValue:answer.replace(/\\n/g, " \n")
										        })(
										        	<TextArea rows={6} placeholder="请输入答案" disabled style={{resize: 'none'}} />
										        )}
										    </Form.Item>
				    					)
				    				})
				    			}
						    </Fragment>
				    	) : ''
				    }
				    <Form.Item label='节点答案' style={{marginBottom:0}}>
				        {getFieldDecorator('answer',{
				        	rules: [
				        		{ 
				        			required: true
				        		}
				        	]
				        })(
				        	<Fragment></Fragment>
				        )}
				    </Form.Item>
				    {
				    	answerList.map((item,index) => {
				    		const { answer='',knowledgeStatus,knowledgeId } = item;
				    		const answerDisabled = false;
				    		const answerTip = this.setAnswerTip('once',knowledgeId);
				    		//是否有关联
				    		const { isShow,relateContent='' } = answerTip;
				    		//是否为一条答案
				    		const isDelete = index === 0 && answerLen === 1;
				    		//答案不可修改
				    		if(userCode !== 'super_admin' && userCode !== 'super_operate' && knowledgeStatus === 1){
				    			answerDisabled = true;
				    		}
				    		
				    		return(
				    			<div key={index} className={styles.answerOnceBox}>
				    				{
				    					!answerDisabled && isShow ? (
				    						<Popover placement="leftTop" title='关联问句' content={relateContent} trigger="hover">
						    					<Icon 
						    						title='该答案已与其他问句关联，请谨慎修改'
						    						type="exclamation-circle" 
						    						theme='filled' 
						    						className={styles.answerTip}
						    					/>
						    				</Popover>
				    					) : ''
				    				}
				    				{
				    					multipleDrawerType !== 'handle' && isRelation && !isDelete && knowledgeStatus !== 1 ? (
				    						<Icon type="close" className={styles.deleteAnswer} onClick={() => this.handleDelete(index)} />
				    					) : ''
				    				}
					    			<Form.Item style={{marginBottom:isRelation && index === (answerLen - 1) && answerLen !== 5 ? 0 : 18}}>
							        	{getFieldDecorator('nodeContent_' + index,{
							        		initialValue:answer.replace(/\\n/g, " \n")
								        })(
								        	<TextArea 
								        		placeholder="请输入节点答案" 
								        		rows={6}
								        		disabled={multipleDrawerType === 'handle' || answerDisabled}
								        		style={{resize: 'none'}}
								        		onChange={(e) => this.handleAnswerChange(e,index)}
								        	/>
								        )}
								    </Form.Item>
							    </div>
				    		)
				    	})
				    }
				    {
				    	multipleDrawerType !== 'handle' && isRelation && answerLen < 5 ? (
				    		<Form.Item label='' style={{margin:0}}>
						        {getFieldDecorator('addBtn')(
						        	<span className={styles.add} onClick={this.handleAdd}>新增答案+</span>
						        )}
					    	</Form.Item>
				    	) : ''
				    }
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
		const { form:{getFieldDecorator},multiple } = this.props;
		const { multipleDrawerType } = multiple;
		const title = multipleDrawerType === 'examine' ? '知识库管理/答案审核/审核不通过说明' : '知识库管理/答案处理/无法处理说明';
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
			title,
	        width:422,
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

export default MultipleAnswer;