import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Table,
	Button,
	Pagination
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import TableContent from '@components/TableContent';
import DetailModule from './components/DetailModule';

@connect(({
	user,
	accountManagement
}) => ({
	user,
	accountManagement
}))

class RolePermissions extends Component{
	
	state = {
		loading:false,
		visible:false,
		pageNum:1,
		pageSize:9
	}
	
	componentDidMount(){
		this.getList();
	}
	
	getList = () => {
		const { pageNum,pageSize } = this.state;
		const { dispatch,user={} } = this.props;
    const { userdata={} } = user;
		const { belongCompanyId } = userdata;
		this.setState({loading:true});
		dispatch({
			type:'accountManagement/fetchGetRoleProductPermissionList',
			payload:{companyId:belongCompanyId,pageNum,pageSize},
			callback:(res) => {
				this.setState({loading:false});
			}
		})	
	}
	
	//表格
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { dispatch,accountManagement } = this.props;
		const { rolePermissions={} } = accountManagement;
		const { list=[],total=0 } = rolePermissions;
		//产品名称处理
		const setProductName = (data) => {
			let str = '';
			data.map((item,index) => {
				const { productName='' } = item;
				if(index !== 0){
					str += `/${productName}`;
				}else{
					str += productName;
				}
			})
			return str;
		}
		const handleIntoDetail = (onceData) => {
			dispatch({
				type:'accountManagement/setOnceJurisdictData',
				payload:{onceData}
			})	
			this.setState({visible:true});
		}
		const columns = [
			{
				title: '角色名称',
				key: 'roleName',
				ellipsis:true,
				width:'18%',
				render: text => {
					let { roleName='' } = text;
					return(
						<span title={roleName} >
							{roleName}
						</span>
					)
				}
			},
			{
				title: '角色描述',
				key: 'roleDescription',
				ellipsis:true,
				render: text => {
					let { description='' } = text;
					return(
						<div title={description} >
							{description}
						</div>
					)
				}
			},
			{
				title: '产品名称',
				key: 'productName',
				ellipsis:true,
				width:'22%',
				render: text => {
					let { productionVos=[] } = text;
					let productName = setProductName(productionVos);
					return(
						<span title={productName} >
							{productName}
						</span>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				align:'center',
				width:200,
				render: text => {
					return(
						<Button onClick={() => handleIntoDetail(text)}>查看</Button>
					)
				}
			}
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			columns,
		}
		
		const pageOptions = {
	  		current: pageNum,
	  		pageSize,
	  		onChange: (current, pageSize) => {
	  			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			})
	  		},
	  		total
		}
		
		return(
			<div style={{paddingTop:20,background:'#fff'}}>
				<TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
			</div>
		)
	}
	
	//查看详情
	drawerModule(){
		const { visible } = this.state;
		const handleClose = () => {
			this.setState({visible:false});
		}
		let drawerOptions = {
			content:(<DetailModule />),
			isOk:false,
			onCancel:handleClose
		}
		let drawerProps = {
			title:'角色权限查看/查看',
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:handleClose,
	        visible
		}
		return(
			<DrawerMount  
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}
	
	render(){
		return(
			<div style={{width:'100%'}}>
				{this.tableModule()}
				{this.drawerModule()}
			</div>
		)
	}
}

export default RolePermissions;