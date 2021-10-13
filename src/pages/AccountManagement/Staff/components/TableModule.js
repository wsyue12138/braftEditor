import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Button,
	message,
	Modal,
	Popover
} from 'antd';
import TableContent from '@components/TableContent';
import styles from './style.less';

@connect(({
	login,
	accountManagement
}) => ({
	login,
	accountManagement
}))

class StaffTable extends Component{
	
	componentDidMount(){
		this.isSubmit = true;
	}
	
	//编辑
	handleEdit = (onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/drawerChange',
			payload:{visible:true,drawerType:'edit',onceData}
		})	
	}
	
	//用户权限修改
	handleJurisdiction = (type,id) => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		let title = '';
		let callback = null;
		if(type === 'reset'){
			title = '是否确认重置密码，重置后密码将初始化?';
			callback = this.handleResetPwd;
		}else
		if(type === 'disable'){
			title = '是否确认禁用?';
			callback = this.handleDisablePwd;
		}else
		if(type === 'unDisable'){
			title = '是否确认启用?';
			callback = this.handleUnDisablePwd;
		}
		Modal.confirm({
    		title,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			callback(id,type);
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
	}
	
	//重置密码
	handleResetPwd = (id) => {
		const { dispatch } = this.props
		dispatch({
			type:'login/fetchResetPwd',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('重置成功');
				}else{
					message.error('重置失败');
				}
				this.isSubmit = true;
			}
		})
	}
	
	//禁用
	handleDisablePwd = (id) => {
		const { dispatch,getList } = this.props;
		dispatch({
			type:'login/fetchDisablePwd',
			payload:{id},
			callback:(res) => {
				let { success,code } = res;
				if(success){
					message.success('禁用成功');
					getList();
				}else{
					if(code === 11008){
						message.error(res.message);
					}else{
						message.error('禁用失败');
					}
				}
				this.isSubmit = true;
			}
		})
	}
	
	//启用
	handleUnDisablePwd = (id) => {
		const { dispatch,getList } = this.props;
		dispatch({
			type:'login/fetchUnDisablePwd',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('启用成功');
					getList();
				}else{
					message.error('启用失败');
				}
				this.isSubmit = true;
			}
		})
	}
	
	//产品-角色处理
	handleProductRole = (data,type) => {
		const { productionVos=[] } = data;
		let list = [];
		let isMore = false,obj;
		let userRole = '';
		if(productionVos.length === 0){
			list = [{}];
		}else
		if(productionVos.length === 1){
			let { userRoleVos=[] } = productionVos[0];
			if(userRoleVos.length > 1){
				isMore = true;
				userRoleVos.map((i,n) => {
					let { roleName='' } = i;
					if(n !== 0){
						userRole += '/' + roleName;
					}else{
						userRole += roleName;
					}
				})
				obj = {
					productName:productionVos[0].productName,
					userRole,
					userRoleOnce:productionVos[0].userRoleVos[0].roleName
				}
			}else{
				obj = {
					productName:productionVos[0].productName,
					userRole:productionVos[0].userRoleVos[0].roleName,
					userRoleOnce:productionVos[0].userRoleVos[0].roleName
				}	
			}
			list.push(obj);
		}else
		if(productionVos.length > 1){
			isMore = true;
			productionVos.map((item,index) => {
				const { productName='',userRoleVos=[] } = item;
				let obj = {productName};
				let userRole = '';
				userRoleVos.map((i,n) => {
					let { roleName='' } = i;
					if(n !== 0){
						userRole += '/' + roleName;
					}else{
						userRole += roleName;
					}
				})
				obj = {
					productName,
					userRole,
					userRoleOnce:productionVos[0].userRoleVos[0].roleName
				}
				list.push(obj);
			})
		}
		return {isMore,list}
	}
	
	//批量禁用
	handleBatchDisable = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { dispatch,accountManagement,getList } = this.props;
		const { selectStaff=[] } = accountManagement;
		if(selectStaff.length){
			Modal.confirm({
	    		title:'是否确认禁用',
	    		content: '',
	    		className:'selfModal',
	    		centered:true,
	    		okText: '是',
	    		cancelText: '否',
	    		onOk:() => {
	    			dispatch({
						type:'login/fetchDisablePwd',
						payload:{id:selectStaff.join()},
						callback:(res) => {
							let { success } = res;
							if(success){
								message.success('禁用成功');
								this.clearSelectStaffList();
								getList();
							}else{
								message.error('禁用失败');
							}
							this.isSubmit = true;
						}
					})
	    		},
	    		onCancel:() => {
	    			this.isSubmit = true;
	    		}
	  		});
		}else{
			message.warning('请选择禁用项');
			this.isSubmit = true;
		}
	}
	
	//清除选择项
	clearSelectStaffList = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/clearSelectStaffList'
		})	
	}	
	
	render(){
		const { dispatch,pageNum,pageSize,callback,loading,accountManagement } = this.props;
		const { staffData={},selectStaff=[] } = accountManagement;
		const { list=[],total=0 } = staffData;
		
		let columns = [
			{
				title: '员工工号',
				key: 'jobNum',
				width:'8%',
				render: text => {
					let { jobNum='' } = text;
					return(
						<span>{jobNum}</span>
					)
				}
			},
			{
				title: '员工姓名',
				key: 'personName',
				ellipsis:true,	
				width:'8%',
				render: text => {
					let { personName='' } = text;
					return(
						<span>{personName}</span>
					)
				}
			},
			{
				title: '部门',
				key: 'userSection',
				ellipsis:true,	
				width:'15%',
				render: text => {
					let { userSection='' } = text;
					return(
						<span title={userSection}>{userSection}</span>
					)
				}
			},
			{
				title: '手机号',
				key: 'userMobile',
				ellipsis:true,	
				width:'10%',
				render: text => {
					let { userMobile='' } = text;
					return(
						<span title={userMobile}>{userMobile}</span>
					)
				}
			},
			{
				title: '登录账号',
				key: 'userName',
				ellipsis:true,
				width:'15%',
				render: text => {
					let { userName='' } = text;
					return(
						<span title={userName}>{userName}</span>
					)
				}
			},
			{
				title: '产品-角色',
				key: 'userName1',
				ellipsis:true,
				width:'15%',
				render: text => {
					let { productionVos=[] } = text;
					let { isMore,list } = this.handleProductRole(text);
					let { productName='',userRoleOnce='' } = list[0];
					let txt = productName + '-' + userRoleOnce; 
					let content = (
						<div>
							{
								list.map((item,index) => {
									let { productName='',userRole='' } = item;
									return(
										<div key={index} style={{fontSize:12}}>
											<span style={{color:'#507CF1'}}>{productName} : </span>
											<span>{userRole}</span>
										</div>
									)
								})
							}
						</div>
					)
					return(
						<Fragment>
							{
								isMore ? (
									<Popover
										placement="bottomLeft" 
										content={content} 
										trigger="hover"
									>
										<span className={styles.moreTxt}>
											{txt}
										</span>
									</Popover>
								) : (<span title={txt}>{txt}</span>)
							}
						</Fragment>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				render: text => {
					const { accountStatus,id } = text;
					return(
						<Fragment>
							{
								accountStatus === 0 ? (
									<Fragment>
										<Button style={{marginRight:16}} onClick={() => this.handleEdit(text)}>编辑</Button>
										<Button style={{marginRight:16}} onClick={() => this.handleJurisdiction('reset',id)}>重置密码</Button>
	    								<Button type="danger" ghost onClick={() => this.handleJurisdiction('disable',id)}>禁用</Button>
									</Fragment>
								) : (<Button onClick={() => this.handleJurisdiction('unDisable',id)}>启用</Button>)
							}
							
	    				</Fragment>	
					)
				}
			}
			
		]
		const rowSelection = {
			columnWidth:50,
			selectedRowKeys:selectStaff,
			getCheckboxProps:(record) => {
				const { accountStatus } = record;
				return {disabled: accountStatus === 0 ? false : true}
			},
  			onChange: (selectedRowKeys, selectedRows) => {
  				dispatch({
					type:'accountManagement/selectStaffList',
					payload:{selectStaff:selectedRowKeys}
				})	
  			}
		};
		
		const tableOptions = {
			onceKey:'id',
			loading,
			dataSource:list,
			rowSelection,
			columns,
			rowClassName:(record) => {
				const { accountStatus } = record;
				return accountStatus === 0 ? '' : styles.rowDisabled
			}
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize,
	  		onChange: (current, pageSize) => {
	  			dispatch({
					type:'accountManagement/selectStaffList',
					payload:{selectStaff:[]}
				})	
      			callback(current,pageSize);
	  		},
	  		total,
	  		custom:(
	  			<Button 
					style={{marginRight:12}}
					onClick={this.handleBatchDisable}
				>
					批量禁用
				</Button>
	  		)
		}
		
		return(
			<TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
		)
	}
}

export default StaffTable;