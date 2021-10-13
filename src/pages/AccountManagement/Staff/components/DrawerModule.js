import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Row,
	Col,
	Form,
	Input,
	Radio,
	Select,
	TreeSelect,  
	message
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import styles from './style.less';
const { TreeNode,SHOW_ALL } = TreeSelect;
const { Option } = Select;

@connect(({
	user,
	accountManagement
}) => ({
	user,
	accountManagement
}))

@Form.create()

class StaffDrawer extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			initUserName:'',
			formList:[
				{
					roleData:[]
				}
			],
			permissionCodes:[],
			treeVal:['0-0-0'],
			treeData:{},
			operationShow:true,
			jurisdictionObj:{}
		}
	}
	
	componentDidMount(){
		const { accountManagement:{drawerType} } = this.props;
		this.props.onRef(this);
		this.isSubmit = true;
		this.getCompanys();
		if(drawerType === 'edit'){
			this.setJurisdiction();
			this.setRoleData();
			this.getUserBGPermissionList();
		}
	}
	
	//获取公司信息
	getCompanys = () => {
		const { dispatch,user:{userdata},accountManagement } = this.props;
		const { belongCompanyId } = userdata;
		dispatch({
			type:'accountManagement/fetchGetCompanyPrefix',
			payload:{companyId:belongCompanyId},
			callback:(res) => {
				const { success } = res;
				const { bgPermissionList=[] } = accountManagement;
				if(!bgPermissionList.length){
					this.getBGPermission();
				}
				if(success){
					const { data={} } = res.data;
					const { companyPrefix='' } = data;
					this.userName = companyPrefix + '_';
					this.setState({initUserName:companyPrefix + '_'});
				}
			}
		})	
	}
	
	//获取后台管理权限列表
	getBGPermission = () => {
		const { dispatch } = this.props;
		dispatch({type:'accountManagement/fetchGetBGPermission'})	
	}
	
	//账号已选后台权限权限列表查询接口
	getUserBGPermissionList = () => {
		const { dispatch,accountManagement:{onceData} } = this.props;
		const { id } = onceData;
		dispatch({
			type:'accountManagement/fetchGetUserBGPermissionList',
			payload:{id},
			callback:(res) => {
				const { success } = res;
				if(success){
					const { data } = res.data;
					const { permissionCodes=[] } = data;
					this.setState({permissionCodes});
				}
			}
		})
	}

	//根据产品角色组获取类目及权限
	getCategoryByProductAndRoles = () => {
		const { dispatch,accountManagement:{onceData} } = this.props;
		const obj = this.setCategoryRolesPostions();
		const { isSuper,productionRoles } = obj;
		this.setState({operationShow:!isSuper},() => {
			if(!isSuper && productionRoles){
				dispatch({
					type:'accountManagement/fetchGetCategoryByProductAndRoles',
					payload:{productionRoles},
					callback:(res) => {
						const { success } = res;
						if(success){
							const { data } = res.data;
							this.setState({treeData:data});
						}
					}
				})
			}
		});
	}

	//设置产品角色组获取类目及权限参数
	setCategoryRolesPostions = () => {
		const { formList } = this.state;
		let isAllSuper = false;
		let productionRoles = {};
		let returnObj = {isSuper:false};
		formList.map((item,index) => {
			const { productId,roleId,roleData } = item;
			if(productId){
				productionRoles[productId] = roleId;
				const isSuper = roleData.some((i) => {
					const _index = i.roleCode.indexOf('bmxm_'); 
					return _index !== -1;
				})
				if(!isAllSuper){
					isAllSuper = isSuper;
				}
			}
		})
		if(Object.keys(productionRoles).length !== 0){
			returnObj = {
				isSuper:isAllSuper,
				productionRoles
			}
		}
		return returnObj;
	}
	
	//设置产品角色
	setRoleData = () => {
		const { accountManagement:{onceData,productionRolesArr} } = this.props;
		const { productionVos=[] } = onceData;
		let formList = [];
		if(productionVos.length){
			productionVos.map((item,index) => {
				const { id,userRoleVos=[] } = item;
				//获取索引值为编辑时的值
				let num = productionRolesArr.findIndex(j => j.id === id);
				let roleId = [];
				userRoleVos.map((i,n) => {
					roleId.push(i.id + '');
				})
				if(num > -1){
					let obj = {
						productIndex:num,
						productId:id,
						roleId,
						roleData:productionRolesArr[num].userRoleVos ? productionRolesArr[num].userRoleVos : []
					};
					formList.push(obj);
				}
			})
			let lastObj = {
				roleData:[]
			}
			formList.push(lastObj);
			this.setState({formList});
		}else{
			formList = [
				{
					roleData:[]
				}
			]
		}
		this.setState({formList},() => {
			this.getCategoryByProductAndRoles();
		});
	}

	//设置权限
	setJurisdiction = () => {
		//新增权限 05010800   变更权限 05010600  审核权限 05010300  生效权限 05010500
		const { accountManagement:{onceData} } = this.props;
		const { userPermissonMap={} } = onceData;
		const add = this.setJurisdictionCategory(userPermissonMap['05010800']);
		const edit = this.setJurisdictionCategory(userPermissonMap['05010600']);
		const examine = this.setJurisdictionCategory(userPermissonMap['05010300']);
		const takeEffect = this.setJurisdictionCategory(userPermissonMap['05010500']);
		this.setState({jurisdictionObj:{add,edit,examine,takeEffect}});
	}

	//处理权限内业务分类
	setJurisdictionCategory = (obj) => {
		let allArr = [];
		if(obj){
			let index;
			for(index in obj) {
				if(obj[index] && obj[index].length){
					obj[index].map((item,_index) => {
						allArr.push(item.productionKnowledgeCategoryRelationId)
					})
				}
			}
		}
		return allArr;
	}
	
	//新增
	addUser = (payload) => {
		const { dispatch,getList,user,form } = this.props;
		const { userdata:{belongCompanyId} } = user;
		payload.belongCompanyId = belongCompanyId;
		dispatch({
			type:'accountManagement/fetchAddUser',
			payload,
			callback:(res) => {
				let { success,code } = res;
				if(success){
					message.success('添加成功');
					this.handleClose();
					getList();
				}else{
					if(code === 11009){
						form.setFields({
			              	'userName': {
			                	value: payload.userName,
			                	errors: [new Error('登录账号不可重复')],
			              	},
			            });
					}else{
						message.error('添加失败!');
					}
				}
				this.isSubmit = true;
			}
		})	
	}
	
	//修改
	updateUser = (payload) => {
		const { dispatch,getList,user,accountManagement:{onceData} } = this.props;
		const { userdata:{belongCompanyId} } = user;
		payload.belongCompanyId = belongCompanyId;
		payload.id = onceData.id;
		dispatch({
			type:'accountManagement/fetchUpdateUser',
			payload,
			callback:(res) => {
				let { success,code } = res;
				if(success){
					message.success('编辑成功');
					this.handleClose();
					getList();
				}else{
					message.error('编辑失败!');
				}
				this.isSubmit = true;
			}
		})	
	}
	
	//工号验证
	jobNumValidator = (rule, val='', callback) => {
		var reg = /^[0-9]*$/;
		let _len = val.length;
		if(_len && _len <= 10 && reg.test(val)){
			callback();
		}else{
			this.isSubmit = true;
    		callback('工号要求长度为1-10位数字');
		}
	}
	
	//姓名验证
	personNameValidator = (rule, val='', callback) => {
		let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/;
		let _len = val.length;
		if(_len && _len <= 20 && reg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('姓名要求中文或英文最大20位');
    	}
	}
	
	//手机号验证
	phoneValidator = (rule, val='', callback) => {
		let reg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    	if(val.length === 0) {
    		callback();
    	}else{
    		if(reg.test(val)){
    			callback();
    		}else{
    			this.isSubmit = true;
    			callback('请输入正确手机号');
    		}
    	}
	}
	
	//部门验证
	departmentValidator = (rule, val='', callback) => {
		let reg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
		let _len = val.length;
		if(_len === 0) {
    		callback();
    	}else{
    		if(_len <= 100 && reg.test(val)){
    			callback();
    		}else{
    			this.isSubmit = true;
    			callback('部门要求中文、英文、数字,最大100位');
    		}
    		
    	}
	}
	
	//账号验证
	userNameValidator = (rule, val='', callback) => {
		const { initUserName } = this.state;
		let reg1 = /^[A-Za-z0-9]+$/;
		let reg2 = /^[0-9]*$/;
		let num = initUserName.length;
		let value = val.substring(num);
		let _len = val.length;
		if(_len >= 6 && _len <= 20 && reg1.test(value)) {
			if(reg2.test(value)){
				this.isSubmit = true;
				callback('账号不可使用纯数字');
			}else{
				callback();
			}
    		
    	}else{
    		this.isSubmit = true;
    		callback('账号要求6-20位英文、数字');
    	}
	}
	
	//产品禁止
	handleSetDisabled = (productId) => {
		const { formList } = this.state;
		const _index = formList.findIndex((i) => i.productId === productId);
		return _index > -1;
	}
	
	//产品选择
	handleProductSelect = (index,val=-1) => {
		const { formList } = this.state;
		const { form,accountManagement,form:{setFieldsValue,resetFields,setFields} } = this.props;
		let newFormList = [...formList];
		resetFields('productId_' + index);
		if(val === -1){     
			//清除处理
			delete newFormList[index].productId;
			newFormList[index].roleData = [];
		}else{
			const { productionRolesArr=[] } = accountManagement;
			let obj = productionRolesArr[val];
			let { id,userRoleVos=[] } = obj;
			newFormList[index].productId = id;
			newFormList[index].roleData = userRoleVos;
		}
		newFormList[index].roleId = [];
		this.setState({formList:newFormList},() => {
			resetFields('roleId_' + index);
			if(val === -1){
				console.log(111)
				form.setFieldsValue({
					add:[],
					edit:[],
					examine:[],
					takeEffect:[]
				})
				this.getCategoryByProductAndRoles();
			}
		});
	}
	
	//角色选择
	handleRoleSelect = (index,val=[]) => {
		const { form } = this.props;
		const { formList } = this.state;
		let newFormList = [...formList];
		let _len = newFormList.length;
		form.resetFields('roleId_' + index);
		if(val.length){
			newFormList[index].roleId = val;
		}else{
			delete newFormList[index].roleId;
		}
		if(_len === (index + 1)){
			let obj = {
				roleData:[]
			}
			newFormList.push(obj);
		}
		this.setState({formList:newFormList},() => {
			form.setFieldsValue({
				add:[],
				edit:[],
				examine:[],
				takeEffect:[]
			})
			this.getCategoryByProductAndRoles();
		});
	}
	
	//账号改变
	handleUserNameChange = (e) => {
		const { initUserName } = this.state;
		const { form:{setFieldsValue} } = this.props;
		let num = initUserName.length;
		let value = e.target.value;
		if(value.substr(0,num) !== initUserName){
			return this.userName;
		}else{
			this.userName = value;
			return value;
		}
	}
	
	//罗列产品角色
	setProductionRoles = () => {
		const { form } = this.props;
		const { formList } = this.state;
		let newFormList = [...formList];
		let productionRoles = {};
		let list = [];
		let isSelect = true;
		newFormList.map((item,index) => {
			let { productId=-1,roleId=[] } = item;
			if(productId !== -1){
				if(roleId.length === 0){
					isSelect = false;
					form.setFields({
		              	['roleId_' + index]: {
		                	value: [],
		                	errors: [new Error('请选择角色')],
		              	},
		            });
				}else{
					let obj = {
						[productId + '']:roleId
					}
					productionRoles[productId + ''] = roleId;
					list.push(obj);
				}
			}
		})
		if(!isSelect){
			return null;
		}else{
			return productionRoles;
//			if(list.length){
//				return productionRoles;
//			}else{
//				form.setFields({
//					'productId_0': {
//	                	value: undefined,
//	                	errors: [new Error('请选择产品')],
//	              	},
//	              	'roleId_0': {
//	                	value: [],
//	                	errors: [new Error('请选择角色')],
//	              	},
//	            });
//	            return null;
//			}
			
		}
	}
	
	//确定
	handleOk = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { form,type,accountManagement:{drawerType} } = this.props;
		let validateArr = ['jobNum','personName','userMobile','userSection','permissionCodes','accGovernPermission','add','edit','examine','takeEffect'];
		if(drawerType === 'add'){
			validateArr.push('userName');
		}
		form.validateFields(validateArr,(err, values) => {
			if(err){
				this.isSubmit = true;
				return false
			}
			let productionRoles = this.setProductionRoles();
			if(productionRoles === null){
				this.isSubmit = true;
			}else{
				const obj = JSON.parse(JSON.stringify(values));
				const { add,edit,examine,takeEffect } = obj;
				const permissionCategorys = {
					'05010800':add ? add : [],
					'05010600':edit ? edit : [],
					'05010300':examine ? examine : [],
					'05010500':takeEffect ? takeEffect : []
				}
				delete values.add;
				delete values.edit;
				delete values.examine;
				delete values.takeEffect;
				let data = {
					...values,
					productionRoles,
					permissionCategorys
				}
				if(drawerType === 'add'){
					this.addUser(data);
				}else{
					this.updateUser(data);
				}
			}
		})
		
	}

	//设置树状结构
	setTreeContent = (type,data=[]) => {
		let returnContent;
		const content = () => {
			return(
				<Fragment>
					{
						data.map((item,index) => {
							const { productName='',oneLevelCategorys=[] } = item;
							return(
								<TreeNode value={item.id + 'product'} title={productName} key={`${type}_product_${item.id}`}>
									{
										oneLevelCategorys.map((i,_index) => {
											const { productionKnowledgeCategoryRelationId,categoryName='' } = i;
											return(
												<TreeNode value={productionKnowledgeCategoryRelationId} title={categoryName} key={`${type}_category_${productionKnowledgeCategoryRelationId}`}>
												</TreeNode>
											)
										})
									}
								</TreeNode>
							)
						})
					}
				</Fragment>
			)
		}
		returnContent = data.length ? content() : [];
		return returnContent;
	}
	
	//关闭抽屉
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/drawerChange',
			payload:{visible:false}
		})	
	}
	
	contentModule(){
		const { formList,initUserName,permissionCodes,operationShow,treeData,jurisdictionObj } = this.state;
		const { form:{getFieldDecorator,getValueFromEvent},accountManagement,user } = this.props;
		const { productionRolesArr=[],bgPermissionList=[],drawerType,onceData={} } = accountManagement;
		const { jobNum='',personName='',userMobile='',userSection='',userName='',accGovernPermission=-1 } = onceData;
		const { userdata={} } = user;
		const { belongCompanyId } = userdata;
		
		return(
			<div className={styles.contentModule}>
				<Row>
					<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
						<Col>
							<Form.Item label="员工工号">
						        {getFieldDecorator('jobNum',{
						        	initialValue:drawerType === 'add' ? '' : jobNum,
						        	rules: [
						        		{ 
						        			required: true,
						        			validator:this.jobNumValidator
						        		}
						        	]
						        })(
						        	<Input placeholder="请输入工号" />
						        )}
						    </Form.Item>
						</Col>
						<Col>
							<Form.Item label="员工姓名">
						        {getFieldDecorator('personName',{
						        	initialValue:drawerType === 'add' ? '' : personName,
						        	rules: [
						        		{ 
						        			required: true,
						        			validator:this.personNameValidator
						        		}
						        	]
						        })(
						        	<Input placeholder="请输入姓名" />
						        )}
						    </Form.Item>
						</Col>
					    <Col>
						    <Form.Item label="手机号">
						        {getFieldDecorator('userMobile',{
						        	initialValue:drawerType === 'add' ? '' : userMobile,
						        	rules: [
						        		{ 
						        			validator:this.phoneValidator
						        		}
						        	]
						        })(
						        	<Input placeholder="请输入手机号" />
						        )}
						    </Form.Item>
					    </Col>
					    <Col>
						    <Form.Item label="部门">
						        {getFieldDecorator('userSection',{
						        	initialValue:drawerType === 'add' ? '' : userSection,
						        	rules: [
						        		{ 
						        			validator:this.departmentValidator
						        		}
						        	]
						        })(
						        	<Input placeholder="请输入部门" />
						        )}
						    </Form.Item>
					    </Col>
					    <Col>
					    	<Form.Item label="账号管理权限">
						        {getFieldDecorator('accGovernPermission',{
						        	initialValue:drawerType === 'add' ? -1 : accGovernPermission,
						        	rules: [
						        		{ 
						        			required: true,
						        			message: '请选账号管理权限'
						        		}
						        	]
						        })(
						        	<Radio.Group>
								        <Radio value={1} style={{marginRight:220}}>是</Radio>
								        <Radio value={-1}>否</Radio>
								    </Radio.Group>
						        )}
						    </Form.Item>
					    </Col>
					    {
					    	!belongCompanyId ? (
					    		<Col>
							    	<Form.Item label="后台数据管理权限">
								        {getFieldDecorator('permissionCodes',{
								        	initialValue:drawerType === 'add' ? undefined : permissionCodes
								        })(
								        	<Select
								        		mode="multiple"
								        		placeholder="请选台数据管理权限"
												getPopupContainer={triggerNode => triggerNode.parentNode}  
								        	>
								        		{
								        			bgPermissionList.map((item) => {
								        				const { permissionCode='',permissionName='' } = item;
								        				return(
								        					<Option 
								        						value={permissionCode} 
								        						key={permissionCode}
								        					>
								        						{permissionName}
								        					</Option>
								        				)
								        			})
								        		}
							        		</Select>
								        )}
								    </Form.Item>
							    </Col>
					    	) : ''
					    }
					    <Col>
					    	{
					    		formList.map((item,index) => {
					    			const { productId,productIndex,roleData=[],roleId=[] } = item;
					    			return(
					    				<Row key={index} style={{margin:0}}>
					    					<Col span={12} style={{paddingRight:10}}>
					    						{
					    							index === 0 ? (
					    								<Form.Item label="关联产品" style={{marginBottom:0}}>
													        {getFieldDecorator('product')(
													        	<Fragment></Fragment>
													        )}
													    </Form.Item>
					    							) : ''
					    						}
											    <Form.Item>
											        {getFieldDecorator('productId_' + index,{
											        	initialValue:drawerType === 'add' ? undefined : productIndex,
											        })(
											        	<Select 
											        		placeholder="选择需要关联的产品" 
											        		allowClear 
															getPopupContainer={triggerNode => triggerNode.parentNode}  
											        		onChange={(val) => this.handleProductSelect(index,val)}
											        	>
											        		{
											        			productionRolesArr.map((i,n) => {
												        			return(
												        				<Option value={n} key={i.id} disabled={this.handleSetDisabled(i.id)}>{i.productName}</Option>
												        			)
												        			
												        		})
											        		}
										        			
										        		</Select>
											        )}
											    </Form.Item>
										    </Col>
										    <Col span={12} style={{paddingLeft:10}}>
										    	{
										    		index === 0 ? (
										    			<Form.Item label="角色类型" style={{marginBottom:0}}>
													        {getFieldDecorator('RoleId')(
													        	<Fragment></Fragment>
													        )}
													    </Form.Item>
										    		) : ''
										    	}
											    <Form.Item>
											        {getFieldDecorator('roleId_' + index,{
											        	initialValue:drawerType === 'add' ? [] : roleId,
											        })(
											        	<Select
											        		mode="multiple"
											        		placeholder="选择角色类型"  
															getPopupContainer={triggerNode => triggerNode.parentNode}  
											        		onChange={(val) => this.handleRoleSelect(index,val)}
											        	>
											        		{
											        			roleData.map((i,n) => {
											        				let { roleName='',id } = i;
											        				return(
											        					<Option value={id + ''} key={id}>{roleName}</Option>
											        				)
											        			})
											        		}
										        		</Select>
											        )}
											    </Form.Item>
										    </Col>
					    				</Row>
					    			)
					    		})
					    	}
					    </Col>
					    <Col span={24}>
						    <Form.Item label="登录账号(公司前缀_用户账号)">
						        {getFieldDecorator('userName',{
						        	initialValue:drawerType === 'add' ? initUserName : userName,
						        	rules: [
						        		{ 
						        			required: drawerType === 'add' ? true : false,
						        			validator:this.userNameValidator
						        		}
						        	],
						        	getValueFromEvent: this.handleUserNameChange
						        })(
						        	<Input style={{width:'100%'}} disabled={drawerType === 'add' ? false : true}/>
						        )}
						    </Form.Item>
					    </Col>
						{
							operationShow && (
								<Fragment>
									<Col span={24}>
										<Form.Item>
											{getFieldDecorator('separate',{
											})(
												<div style={{width:'100%',textAlign:'center',lineHeight:'32px'}}>
													/// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;知识库数据操作权限&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ///
												</div>
											)}
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="新增">
											{getFieldDecorator('add',{
												initialValue:jurisdictionObj.add 
											})(
												<TreeSelect
													placeholder="选择编辑数据管理权限"
													allowClear
													multiple
													treeCheckable={true}
													treeDefaultExpandAll
													getPopupContainer={(triggerNode) => triggerNode.parentNode}
      											>
													{this.setTreeContent('add',treeData['05010800'])}
												</TreeSelect>
											)}
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="编辑">
											{getFieldDecorator('edit',{
												initialValue:jurisdictionObj.edit
											})(
												<TreeSelect
													placeholder="选择编辑数据管理权限"
													allowClear
													multiple
													treeCheckable={true}
													treeDefaultExpandAll
													getPopupContainer={(triggerNode) => triggerNode.parentNode}
      											>
													{this.setTreeContent('edit',treeData['05010600'])}
												</TreeSelect>
											)}
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="审核">
											{getFieldDecorator('examine',{
												initialValue:jurisdictionObj.examine
											})(
												<TreeSelect
													placeholder="选择编辑数据管理权限"
													allowClear
													multiple
													treeCheckable={true}
													treeDefaultExpandAll
													getPopupContainer={(triggerNode) => triggerNode.parentNode}
      											>
													{this.setTreeContent('examine',treeData['05010300'])}
												</TreeSelect>
											)}
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="生效" style={{marginBottom:50}}>
											{getFieldDecorator('takeEffect',{
												initialValue:jurisdictionObj.takeEffect
											})(
												<TreeSelect
													placeholder="选择编辑数据管理权限"
													allowClear
													multiple
													treeCheckable={true}
													treeDefaultExpandAll
													getPopupContainer={(triggerNode) => triggerNode.parentNode}
      											>
													{this.setTreeContent('takeEffect',treeData['05010500'])}
												</TreeSelect>
											)}
										</Form.Item>
									</Col>
								</Fragment>
							)
						}
						
					</Form>
				</Row>
			</div>
		)
	}
	
	render(){
		return (
			<Fragment>
				{this.contentModule()}
			</Fragment>
		)
	}
}

export default StaffDrawer;