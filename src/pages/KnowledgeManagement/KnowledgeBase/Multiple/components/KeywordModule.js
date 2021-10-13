import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Radio,
	Cascader,
	Select,
	Row,
	Col,
	message
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import Region from '@components/Region';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;

@Form.create()

class MultipleKeyword extends Component{
	
	state = {
		visible:false,
		serviceType:undefined,
		selectedOnce:{},
		regionVal:undefined
	}
	
	componentDidMount(){
		const { multiple:{multipleDrawerType} } = this.props;
		this.props.onRef(this);
		this.isSubmit = true;
		if(multipleDrawerType !== 'edit'){
			this.getEditHistory();
		}
		this.setInitVal();
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
	
	//初始化设置
	setInitVal = () => {
		const { multiple } = this.props;
		const { detailData={} } = multiple;
		const { serviceType=undefined,regionCode,regionFullName='全国',regionName='全国' } = detailData;
		let serviceArr = undefined;
		let selectedOnce = {};
		if(serviceType !== undefined){
			let obj = this.setServiceType(serviceType);
			selectedOnce = {serviceType:obj.type,serviceTypeName:obj.name};
			serviceArr = obj.newArr;
		}
		const regionVal = {
			regionCode,
			regionFullName,
			regionShortName:regionName
		}
		this.setState({serviceType:serviceArr,selectedOnce,regionVal});
	}
	
	//设置业务分类
	setServiceType = (serviceType) => {
		const { knowledgeBase:{serviceList} } = this.props;
		let newArr,type,name;
		serviceList.map((item,index) => {
			const { categoryCode,children=[],categoryName='' } = item;
			if(serviceType === categoryCode){
				newArr = [categoryCode];
				type = categoryCode;
				name = categoryName;
			}
			if(children.length){
				children.map((i,_index) => {
					if(serviceType === i.categoryCode){
						newArr = [categoryCode,i.categoryCode];
						type = i.categoryCode;
						name = i.categoryName;
					}
				})
			}
		})
		let obj = {
			newArr,
			type,
			name
		}
		return obj;
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
			case 'takeEffect':
				this.takeEffect();
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
		const { selectedOnce,regionVal } = this.state;
		const { dispatch,form:{validateFields} } = this.props;
		validateFields(['nodeContent','region','serviceType','nodeStatus'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			let { serviceType,serviceTypeName } = selectedOnce;
			if(regionVal){
				const { regionCode,regionFullName,regionShortName } = regionVal;
				delete values.region;
				values.regionCode = regionCode;
				values.regionFullName = regionFullName;
				values.regionName = regionShortName;
			}
			values.serviceType = serviceType;
			values.serviceTypeName = serviceTypeName;
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
		const { id,nodeType } = detailData;
		dispatch({
			type:'multiple/fetchAuditQaKnowledge',
			payload:{...payload,id,nodeType,result},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//处理
	handleRequest = (result,payload={}) => {
		const { dispatch,multiple:{detailData},updateProcedure } = this.props;
		const { id,nodeType } = detailData;
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
		const { id,nodeType } = detailData;
		dispatch({
			type:'multiple/fetchTesHandleQaKnowledge',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				this.handleBoxClose(success);
			}
		})	
	}
	
	//生效
	takeEffect = () => {
		const { dispatch,multiple:{detailData} } = this.props;
		const { id } = detailData;
		dispatch({
			type:'multiple/fetchEnableQaKnowledge',
			payload:{id},
			callback:(res) => {
				let { success,code } = res;
				if(success){
					this.handleBoxClose(success);
				}else{
					if(code === 11028){
						message.error(res.message);
					}else{
						this.handleBoxClose(success);
					}
				}
				
			}
		})	
	}
	
	//业务分类
	displayRender = (label) => {
		return label[label.length - 1];
	}
	
	//业务分类选择
	handleServiceTypeChange = (val,selectedOptions=[]) => {
		let selectedOnce = {};
		if(selectedOptions.length){
			let onceData = selectedOptions[selectedOptions.length - 1];
			let { categoryCode=-1,categoryName } = onceData;
			selectedOnce = {serviceType:categoryCode,serviceTypeName:categoryName};
		}
		this.setState({selectedOnce});
	}
	
	//完成关闭
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
	
	//这是不同操作默认状态
	setDefaultState = () => {
		const { multiple:{multipleDrawerType} } = this.props;
		let required = false;
		let disabled = true;
		switch (multipleDrawerType){
			case 'edit':
				required = true;
				disabled = false;
				break;
			case 'examine':
				required = true;
				disabled = false;
				break;
			default:
				break;
		}
		return {required,disabled};
	}

	//地区选择
	handleRegionChange = (regionVal) => {
		const { form:{setFieldsValue} } = this.props;
		this.setState({regionVal},() => {
			//setFieldsValue({region:regionVal})
		});
	}
	
	//业务分类
	serviceTypeContent = (formType,data,title,isProhibit) => {
		const { serviceType } = this.state;
		const { 
			form:{getFieldDecorator},
			knowledgeBase:{serviceList},
			multiple:{multipleDrawerType}
		} = this.props;
		const { formerServerTypeName='',serviceTypeName='' } = data;
		let isInput = false;
		let initialValue = serviceType;
		if(formType === 'previous'){
			isInput = true;
			initialValue = formerServerTypeName;
		}else{
			if(multipleDrawerType !== 'edit' && multipleDrawerType !== 'examine'){
				isInput = true;
				initialValue = serviceTypeName;
			}
		}
		return(
			<Form.Item label={title}>
		        {getFieldDecorator('serviceType' + formType,{
		        	initialValue:initialValue,
		        	rules: [
		        		{ 
		        			required: isProhibit.required,
		        			message:'请选择业务分类'
		        		}
		        	]
		        })(
		        	isInput ? (
		    			<Input placeholder="请选择业务分类" disabled />
		    		) : (
		    			<Cascader
			        		placeholder='请选择业务分类' 
						    options={serviceList}
						    expandTrigger="click"
						    fieldNames={{ label:'categoryName', value:'categoryCode', children:'children' }}
						    displayRender={this.displayRender}
						    onChange={this.handleServiceTypeChange}
						/>
		    		)
		        )}
		    </Form.Item>
		)
	}

	//对比
	previousContent = () => {
		const { form:{getFieldDecorator},multiple:{originKnowledge} } = this.props;
		const {
			formerNodeContent='',
			formerKnowledgeStatus=0,
			formerRegionName='全国' 
		} = originKnowledge;
	
		return(
			<div className={styles.formBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<Form.Item label='原关键词'>
			        	{getFieldDecorator('nodeContentprevious',{
			        		initialValue:formerNodeContent
				        })(
				        	<Input placeholder="请输入关键字" disabled />
				        )}
				    </Form.Item>
					<Form.Item label='原地区'>
			        	{getFieldDecorator('regionprevious',{
			        		initialValue:formerRegionName
				        })(
				        	<Input placeholder="请输入地区" disabled />
				        )}
				    </Form.Item>
				    {this.serviceTypeContent('previous',originKnowledge,'原业务分类',{required:false,disabled:true})}
				    <Form.Item label='原状态'>
				        {getFieldDecorator('nodeStatusprevious',{
			        		initialValue:formerKnowledgeStatus
			        	})(
			        		<Radio.Group disabled>
								<Radio value={1} style={{marginRight:220}}>启用</Radio>
        						<Radio value={0}>停用</Radio>
							</Radio.Group>
				        )}
				    </Form.Item>
				</Form>
			</div>
		)
	}
	
	//内容
	formContent = () => {
		const { 
			form:{getFieldDecorator},
			multiple:{detailData,multipleDrawerType}
		} = this.props;
		const isProhibit = this.setDefaultState();
		const {
			nodeContent='',
			nodeStatus,
			lastUpdateTime='',
			lastUpdatePersonName='',
			regionName
		} = detailData;
	
		return(
			<div className={styles.formBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<Form.Item label='关键词'>
			        	{getFieldDecorator('nodeContent',{
			        		initialValue:nodeContent,
			        		rules: [
				        		{ 
				        			required: isProhibit.required,
				        			message:'请输入关键字'
				        		}
				        	]
				        })(
				        	<Input placeholder="请输入关键字" disabled={isProhibit.disabled} />
				        )}
				    </Form.Item>
					{
						isProhibit.disabled ? (
							<Form.Item label='地区'>
								{getFieldDecorator('region',{
									initialValue:regionName
								})(
									<Input placeholder="请输入地区" disabled />
								)}
							</Form.Item>
						) : (
							<Form.Item label="地区">
								{getFieldDecorator('region',{
									initialValue:regionName,
									rules: [
										{ 
											required:true,
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
						)
					}
				    {this.serviceTypeContent('',detailData,'业务分类',isProhibit)}
				    <Form.Item label='状态'>
				        {getFieldDecorator('nodeStatus',{
			        		initialValue:nodeStatus
			        	})(
							<Radio.Group disabled={isProhibit.disabled}>
								<Radio value={1} style={{marginRight:220}}>启用</Radio>
        						<Radio value={0}>停用</Radio>
							</Radio.Group>
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
		const title = multipleDrawerType === 'examine' ? '知识库管理/关键词审核/审核不通过说明' : '知识库管理/关键词处理/无法处理说明';
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
		const { multiple:{originKnowledge,multipleDrawerType} } = this.props;
		let span = originKnowledge == null ? 24 : 12;
		return(
			<div className={styles.drawerBox}>
				<Row>
					{
						originKnowledge != null ? (
							<Col span={span} style={{paddingRight:20}}>
								{this.previousContent()}
							</Col>
						) : ''
					}
					<Col span={span} style={{paddingLeft:originKnowledge != null ? 20 : 0}}>
						{this.formContent()}
					</Col>
				</Row>
				{ multipleDrawerType === 'examine' || multipleDrawerType === 'handle' ? this.drawerContent() : ''}
			</div>
		)
	}
}

export default MultipleKeyword;