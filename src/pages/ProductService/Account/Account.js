import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Button,
	Modal
} from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import EditModule from './components/EditModule';
import styles from './Account.less';

@connect(({
	global,
	user,
	productAccount
}) => ({
	global,
	user,
	productAccount
}))

@Form.create()

class ProductAccount extends Component{
	
	state = {
		loading:false,
		searchData:{},
		pageNum:1,
		pageSize:10,
		drawerType:'add',
		visible:false,
		onceData:{}
	}
	
	componentWillMount(){
		this.isSubmit = true;
	}
	
	componentDidMount(){
		this.getList();	
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'productAccount/clearAccountList'
		})
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//获取列表
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { global,user,dispatch } = this.props;
		const { appid='' } = global;
		const { userdata:{euid} } = user;
		this.setState({loading:true});
		dispatch({
			type:'productAccount/fetchGetAccountList',
			payload:{...searchData,appid,euid,pageNum,pageSize},
			callback:(res) => {
				this.setState({loading:false});
				this.isSubmit = true;
			}
		})
		
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		if(!this.isSubmit){return false};
		validateFields(['search_cid','search_cname','search_type'],(err, values) => {
	    	let { search_cid='',search_cname='',search_type } = values;
	    	let searchData = {
	    		cid:search_cid,
	    		cname:search_cname,
	    		type:search_type
	    	}
	    	this.setState({searchData,pageNum:1},() => {
	    		this.getList();
	    	})
	    });
	}
	
	//新增
	handleAdd = () => {
		this.setState({visible:true,drawerType:'add'});
	}
	
	//编辑
	handleEdit = (onceData) => {
		this.setState({visible:true,drawerType:'edit',onceData});
	}
	
	//关闭抽屉病刷新
	clossDrawer = () => {
		this.setState({visible:false},() => {
			this.getList();
		});
	}
	
	//启用/禁用
	handleIsEnable = (data) => {
		let { status } = data;
		let titleType = status ? '禁用' : '启用';
		Modal.confirm({
    		title: `是否确认${titleType}`,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.setStatus(data);
    		}
  		});
	}
	
	//修改状态请求
	setStatus = (data) => {
		const { dispatch } = this.props;
		const { appid,cid,euid,status } = data;
		dispatch({
			type:'productAccount/fetchAccountUpdate',
			payload:{appid,euid,cid,status:status ? 0 : 1},
			callback:(res) => {
				this.getList();
			}
		})
	}
	
	//搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_cid',
				domOptions:{placeholder:'登录工号'},
				domStyle:{width:150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_cname',
				domOptions:{placeholder:'姓名'},
				domStyle:{width:120},
				iconType:'edit'
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.handleSearch}
			},
			{
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:this.handleAdd}
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//列表部分
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { productAccount } = this.props;
		const { accountData } = productAccount;
		const { list=[],total=0 } = accountData;
		let columns = [
			{
				title: '登录工号',
    			key: 'jobNum',
    			width:'40%',
    			render: text => {
    				let { cid } = text;
    				return(
    					<span>{cid}</span>
    				)
    			}
			},
			{
				title: '姓名',
    			key: 'personName',
    			width:'40%',
    			render: text => {
    				let { cname } = text;
    				return(
    					<span>{cname}</span>
    				)
    			}
			},
			{
				title: '操作',
    			key: 'operation',
    			render: text => {
    				let { status } = text;
    				return(
    					<Fragment>
    						{
    							status === 0 ? (
    								<Button onClick={() => this.handleIsEnable(text)}>启用</Button>
    							) : (
    								<Fragment>
    									<Button style={{marginRight:16}} onClick={() => this.handleEdit(text)}>编辑</Button>
    									<Button type="danger" ghost onClick={() => this.handleIsEnable(text)}>禁用</Button>
    								</Fragment>
    							)
    						}
    					</Fragment>
    				)
    			}
			}
			
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list,
			rowClassName:(record) => {
				const { status=0 } = record;
				return status === 0 ? styles.rowDisabled : '';
			}
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: pageSize,
	  		onChange: (current, pageSize) => {
	  			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			});
	  		},
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}
	
	//抽屉
	drawerContent(){
		const { drawerType,visible,onceData } = this.state;
		//关闭
		const handleClose = () => {
			this.setState({visible:false});
		}
		//确定
		const handleOk = () => {
			this.childModule.handleSave();
		}
		let drawerOptions = {
			content:(<EditModule type={drawerType} onRef={this.onRef} onceData={onceData} callback={this.clossDrawer} />),
			isOk:true,
			okText:'保存',
			onOk:handleOk,
			onCancel:handleClose
		}
		let title = drawerType === 'add' ? '新增' : '编辑';
		let drawerProps = {
			title:`产品账号管理/${title}`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:handleClose,
	        visible:visible
		}
		return(
			<Fragment>
				<DrawerMount  
					drawerProps={drawerProps}
					{...drawerOptions}
				/>
			</Fragment>
		)
	}
	
	render(){
		return(
			<div className={styles.productAccountBox}>
				{this.searchModule()}
				{this.tableModule()}
				{this.drawerContent()}
			</div>
		)
	}
}

export default ProductAccount;