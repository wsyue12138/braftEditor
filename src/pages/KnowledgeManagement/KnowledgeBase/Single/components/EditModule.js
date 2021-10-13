import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Icon,
	Cascader,
	Select, 
	message,
	Popover,
	Radio
} from 'antd';
import { getUserData,lineBreak } from '@utils/utils';
import Region from '@components/Region';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

@Form.create()

class SingleEdit extends Component{
	
	state = {
		similarList:[''],
		answerList:[{}],
		serviceType:undefined,
		selectedOnce:{},
		relateAnswerInfo:[],
		regionVal:undefined
	}
	
	componentDidMount(){
		const { single } = this.props;
		this.props.onRef(this);
		this.isSubmit = true;
		this.setInitVal();
		this.getRelateAnswerInfo();
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'single/clearOnceData'
		})		
	}
	
	//获取相关答案
	getRelateAnswerInfo = () => {
		const { dispatch,single } = this.props;
		const { onceData:{id} } = single;
		dispatch({
			type:'single/fetchGetRelateAnswerInfo',
			payload:{id},
			callback:(res) => {
				const { success } = res;
				if(success){
					const { data=[] } = res.data;
					this.setState({relateAnswerInfo:data});
				}
			}
		})	
	}
	
	//新增/编辑请求
	handleRequest = (data) => {
		const { global:{productionId},dispatch,getList,single } = this.props;
		const { onceData:{id} } = single;
		dispatch({
			type:'single/fetchSingleUpdate',
			payload:{...data,productionId,id},
			callback:(res) => {
				let { code,success } = res;
				if(success){
					message.success(`修改成功`);
					getList(true);
					this.handleClose();
				}else{
					if(code === 11037){
						message.error(res.message);
					}else{
						message.error(`修改失败`);
					}
				}
				this.isSubmit = true;
			}
		})	
	}
	
	//关闭弹窗
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:false}
		})	
	}
	
	//初始设置
	setInitVal = () => {
		const { single } = this.props;
		const { onceData={} } = single;
		const { serviceType=undefined,knowledgeSimilarVos=[],knowledgeAnswerVos=[],regionCode,regionFullName='全国',regionName='全国' } = onceData;
		let answerList = [{}];
		let serviceArr = undefined;
		let similarList = [''];
		let selectedOnce = {};
		if(serviceType !== undefined){
			let obj = this.setServiceType(serviceType);
			selectedOnce = {serviceType:obj.type,serviceTypeName:obj.name};
			serviceArr = obj.newArr;
		}
		if(knowledgeSimilarVos.length){
			similarList = this.setKnowledgeSimilar(knowledgeSimilarVos);
		}
		answerList = knowledgeAnswerVos;
		const regionVal = {
			regionCode,
			regionFullName,
			regionShortName:regionName
		}
		this.setState({serviceType:serviceArr,similarList,selectedOnce,answerList,regionVal});
	}
	
	//设置业务分类
	setServiceType = (serviceType) => {
		const { knowledgeBase:{serviceList,operationTree} } = this.props;
		const list = operationTree['05010600'] ? operationTree['05010600'] : [];
		let newArr,type,name;
		list.map((item,index) => {
			const { categoryCode,children=[],categoryName='' } = item;
			if(serviceType === categoryCode){
				newArr = [categoryCode];
				type = categoryCode;
				name = categoryName;
			}else{
				if(children.length){
					children.map((i,_index) => {
						if(serviceType === i.categoryCode){
							newArr = [categoryCode,i.categoryCode];
							type = i.categoryCode;
							name = i.categoryName;
						}else{
							if(i.children && i.children.length){
								i.children.map((l,l_index) => {
									if(serviceType === l.categoryCode){
										newArr = [categoryCode,i.categoryCode,l.categoryCode];
										type = l.categoryCode;
										name = l.categoryName;
									}
								})
							}
						}
					})
				}
			}
		})
		let obj = {
			newArr,
			type,
			name
		}
		return obj;
	}
	
	//设置相似问句
	setKnowledgeSimilar = (data) => {
		let newArr = [];
		data.map((item,index) => {
			const { question='' } = item;
			newArr.push(question);
		})
		newArr.push('');
		return newArr;
	}
	
	//设置答案表单id数组
	setFormList = (data) => {
		const list = data.reduce(function (prev, cur,index) {
		    prev.push('answer_' + index);
		    return prev;
		},[]);
		return list;
	}
	
	//答案改变
	handleAnswerChange = (e,index) => {
		const { answerList } = this.state;
		const answer = e.target.value;
		let list = JSON.parse(JSON.stringify(answerList));
		let obj = list[index];
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
			const { answer='',id } = item;
			if(answer.trim() != ''){
				let obj = {id,answer:lineBreak(answer)};
				childAnswers.push(obj);
			}else{
				isReturn = false;
				setFields({
					['answer_' + index]: {
	                	value: '',
	                	errors: [new Error('答案不可为空')],
	              	}
	            });
			}
		})
		return isReturn ? childAnswers : [];
	}

	//地区判断
	setRegion = () => {
		const { regionVal } = this.state;
		const { form:{setFields},single } = this.props;
		const { onceData={},parentData={},onceType } = single;
		const { regionCode } = regionVal;
		let isExistence = true;
		if(onceType === 'answer'){
			const { childKnowledges=[] } = parentData;
			isExistence = childKnowledges.every((item,index) => {
				if(item.id === onceData.id){
					return true;
				}else{
					return item.regionCode !== regionCode;
				}
			})
			if(!isExistence){
				setFields({
					region: {
						value:regionCode,
						errors: [new Error('地区已存在，不可重复')],
					  }
				});
			}
		}
		return isExistence;
	}
	
	//保存
	handleSave = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { selectedOnce,similarList,regionVal={} } = this.state;
		const { dispatch,form:{validateFields},single:{onceType} } = this.props;
		let fieldNames = ['knowledgeStatus','changeDescription'];
		if(onceType !== 'answer'){
			fieldNames = ['question','serviceType',...fieldNames];
		}
		if(onceType !== 'question'){
			fieldNames = ['region','linkUrl','customField',...fieldNames];
		}
		validateFields(fieldNames,(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			let { question,linkUrl,customField,knowledgeStatus,changeDescription } = values;
			let { serviceType,serviceTypeName } = selectedOnce;
			let options = {};
			if(onceType !== 'answer'){
				options.question = question;
				options.similarQuestion = similarList;
				options.serviceType = serviceType;
				options.serviceTypeName = serviceTypeName;
			}
			if(onceType !== 'question'){
				const { regionCode,regionFullName,regionShortName } = regionVal;
				const isRegion = this.setRegion();
				if(!isRegion){
					this.isSubmit = true;
					return false;
				}else{
					const childAnswers = this.setAnswerList();
					if(!childAnswers.length){
						this.isSubmit = true;
						return false;
					}else{
						options.childAnswers = childAnswers;
						options.regionCode = regionCode;
						options.regionFullName = regionFullName;
						options.regionName = regionShortName;
						options.linkUrl = linkUrl;
						options.customField = customField;
					}
				}
			}
			options.knowledgeStatus = knowledgeStatus;
			options.changeDescription = changeDescription;
			this.handleRequest(options);
		})
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
	
	//删除
	handleRemoveInput = (_index) => {
		const { similarList } = this.state;
		let newList = [...similarList];
		newList.splice(_index,1);
		this.setState({similarList:newList});
	}
	
	//得焦
	handleFocus = (_index) => {
		const { similarList } = this.state;
		let newList = [...similarList];
		let _len = similarList.length;
		if((_len - 1) === _index){
			newList.push('');
		}
		this.setState({similarList:newList});
	}
	
	//相似问句
	handleChange = (e,_index) => {
		const { similarList } = this.state;
		const val = e.target.value;
		let newList = [...similarList];
		newList[_index] = val;
		this.setState({similarList:newList});
	}
	
	//业务分类
	displayRender = (label,selectedOptions) => {
		return label[label.length - 1];
	}
	
	//业务分类选择
	handleServiceTypeChange = (val,selectedOptions=[]) => {
		let selectedOnce = {};
		if(selectedOptions.length){
			let onceData = selectedOptions[selectedOptions.length - 1];
			let { categoryCode,categoryName } = onceData;
			selectedOnce = {serviceType:categoryCode,serviceTypeName:categoryName};
		}
		this.setState({selectedOnce});
	}
	
	//地区选择
	handleRegionChange = (regionVal) => {
		const { form:{setFieldsValue} } = this.props;
		this.setState({regionVal},() => {
			//setFieldsValue({region:regionVal})
		});
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
				const { id } = item;
				const _index = relateAnswerInfo.findIndex((item) => item.answerId === id);
				if(_index !== -1){
					isShow = false;
				}
			})
			return isShow;
		}
		
	}
	
	render(){
		const { similarList,serviceType,answerList } = this.state;
		const { 
			form:{getFieldDecorator},
			single,
			user,
			knowledgeBase:{serviceList,operationTree}
		} = this.props;
		const { onceData={},onceType='all',customFieldName } = single;
		const { 
			customField='',
			linkUrl='',
			question='',
			knowledgeStatus=1,
			changeDescription='',
			operateType=-1,
			regionName='全国'
		} = onceData;
		const { userdata={} } = user;
		const { roleId } = userdata;
		const answerLen = answerList.length;
		const isRelation = this.setAnswerTip('all',answerList);
		let isDisabled = false;
		if(roleId !== 6 && operateType !== 1){
            isDisabled  = true;
        }
		return(
			<div className={styles.singleAdd}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					{
						onceType !== 'answer' ? (
							<Fragment>
								<Form.Item label="标准问句">
									{getFieldDecorator('question',{
										initialValue:question,
										rules: [
											{ 
												required: true,
												message:'请输入标准问句'
											}
										]
									})(
										<Input 
											placeholder="请输入标准问句" 
											disabled={isDisabled} 
											title={isDisabled ? question : ''}
										/>
									)}
								</Form.Item>
								<Form.Item label="相似问句" style={{marginBottom:0}}>
									{getFieldDecorator('similarQuestion')(
										<span></span>
									)}
								</Form.Item>
								{
									similarList.map((item,index) => {
										let _len = similarList.length - 1;
										const suffix = index === _len ?  <span /> : <Icon type="close" style={{cursor:'pointer',color:'#f5222d'}} onClick={() => this.handleRemoveInput(index)} />;
										return(
											<Input 
												key={index}
												value={item}
												placeholder='输入新的相似问句' 
												style={{marginBottom:18}}
												suffix={suffix} 
												onFocus={() => this.handleFocus(index)}
												onChange={(e) => this.handleChange(e,index)}
											/>
										)
									})
								}
							</Fragment>
						) : ''
					}	
					{
						onceType !== 'question' ? (
							<Form.Item label="地区">
								{getFieldDecorator('region',{
									initialValue:regionName,
									rules: [
										{ 
											required: true,
											message:'请选择地区'
										}
									]
								})(
									<Region 
										id='edit'
										initStatus='edit' 
										initInputVal={regionName}
										onChange={this.handleRegionChange}
										{...this.props} 
									/>
								)}
							</Form.Item>
						) : ''
					}			
					{
						onceType !== 'answer' ? (		
							<Form.Item label="业务分类">
								{getFieldDecorator('serviceType',{
									initialValue:serviceType,
									rules: [
										{ 
											required: true,
											message:'请选择业务分类'
										}
									]
								})(
									<Cascader
										placeholder='请选择业务分类' 
										getPopupContainer={triggerNode => triggerNode.parentNode}
										options={operationTree['05010600'] ? operationTree['05010600'] : []}
										expandTrigger="click"
										fieldNames={{ label:'categoryName', value:'categoryCode', children:'children' }}
										displayRender={this.displayRender}
										onChange={this.handleServiceTypeChange}
									/>
								)}
							</Form.Item>
						) : ''
					}	
					{
						onceType !== 'question' ? (
							<Fragment>
								<Form.Item label='答案' style={{marginBottom:0}}>
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
										const { answer='',id='',answerStatus=0 } = item;
										const answerDisabled = false;
										const answerTip = this.setAnswerTip('once',id);
										//是否有关联
										const { isShow,relateContent='' } = answerTip;
										//是否为一条答案
										const isDelete = index === 0 && answerLen === 1;
										//答案不可修改
										if(roleId !== 6 && answerStatus === 1){
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
													isRelation && !isDelete && answerStatus !== 1 ? (
														<Icon type="close" className={styles.deleteAnswer} onClick={() => this.handleDelete(index)} />
													) : ''
												}
												<Form.Item label='' style={{marginBottom:isRelation && index === (answerLen - 1) && answerLen !== 5 ? 0 : 18}}>
													{getFieldDecorator('answer_' + index,{
														initialValue:answer.replace(/\\n/g, " \n"),
														rules: [
															{ 
																min:1
															}
														]
													})(
														<TextArea 
															rows={6} 
															placeholder="请输入答案" 
															disabled={answerDisabled}
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
									isRelation && answerLen < 5 ? (
										<Form.Item label='' style={{margin:0}}>
											{getFieldDecorator('addBtn')(
												<span className={styles.add} onClick={this.handleAdd}>新增答案+</span>
											)}
										</Form.Item>
									) : ''
								}
								<Form.Item label="链接">
									{getFieldDecorator('linkUrl',{
										initialValue:linkUrl
									})(
										<TextArea 
											placeholder="请输入链接" 
											rows={2}
											style={{resize: 'none'}}
											disabled={isDisabled} 
											title={isDisabled ? linkUrl : ''}
										/>
									)}
								</Form.Item>
								<Form.Item label={customFieldName}>
									{getFieldDecorator('customField',{
										initialValue:customField
									})(
										<TextArea rows={4} style={{resize: 'none'}} placeholder="请输入内容" />
									)}
								</Form.Item>
							</Fragment>
						) : ''
					}
				    
				    <Form.Item label="启用/停用">
                        {getFieldDecorator('knowledgeStatus',{
                            initialValue:knowledgeStatus
                        })(
							<Radio.Group>
								<Radio value={1} style={{marginRight:280}}>启用</Radio>
        						<Radio value={0}>停用</Radio>
							</Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label="修改说明">
                        {getFieldDecorator('changeDescription',{
                            initialValue:changeDescription
                        })(
                            <TextArea rows={4} style={{resize: 'none'}} placeholder="请输入内容" />
                        )}
                    </Form.Item>
				    
				</Form>
			</div>
		)
	}
}
export default SingleEdit;