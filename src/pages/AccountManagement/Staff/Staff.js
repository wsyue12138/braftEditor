import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Modal
} from 'antd';
import SearchModule from './components/SearchModule';
import TableModule from './components/TableModule';
import DrawerModule from './components/DrawerModule';
import DrawerMount from '@components/DrawerMount';
import styles from './Staff.less';

@connect(({
	user,
	login,
	accountManagement
}) => ({
	user,
	login,
	accountManagement
}))

class StaffManagement extends Component{
	
	state = {
		loading:false,
		pageNum:1,
		pageSize:9,
		searchData:{}
	}
	
	componentWillMount(){}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { dispatch } = this.props;
		const { searchData,pageNum,pageSize } = this.state;
		const payload = {...searchData,pageNum,pageSize}
		this.setState({loading:true});
		dispatch({
			type:'accountManagement/fetchGetStaffList',
			payload,
			callback:(res) => {
				this.setState({loading:false},() => {
					this.getProductionRoles();
				});
			}
		})
	}
	
	//获取产品与角色
	getProductionRoles = () => {
		const { dispatch,user:{userdata} } = this.props;
		const { belongCompanyId } = userdata;
		dispatch({
			type:'accountManagement/fetchGetProductionRoles',
			payload:{companyId:belongCompanyId}
		})	
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//搜索
	handleChangeSearch = (searchData) => {
		this.setState({searchData,pageNum:1},() => {
			this.getList();
		})
	}
	
	//翻页
	handleChangePage = (pageNum,pageSize) => {
		this.setState({pageNum,pageSize},() => {
			this.getList();
		})
	}
	
	//抽屉确认
	handleOk = () => {
		this.childModule.handleOk();
	}
	
	//关闭抽屉
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/drawerChange',
			payload:{visible:false}
		})	
	}
	
	//抽屉
	drawerModule(){
		const {accountManagement:{drawerType,visible}} = this.props;
		let drawerOptions = {
			content:(<DrawerModule onRef={this.onRef} {...this.props} getList={this.getList} />),
			isOk:true,
			okText:'保存',
			onOk:this.handleOk,
			onCancel:this.handleClose
		}
		let drawerProps = {
			title:drawerType === 'add' ? '员工管理/新增' : '员工管理/编辑',
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
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
		const { loading,pageNum,pageSize } = this.state;
		return(
			<div className={styles.staffManagementBox}>
				<SearchModule 
					callback={this.handleChangeSearch} 
				/>
				<TableModule 
					loading={loading}
					pageNum={pageNum} 
					pageSize={pageSize} 
					getList={this.getList}
					callback={this.handleChangePage}
				/>
				{this.drawerModule()}
			</div>
		)
	}
}

export default StaffManagement;