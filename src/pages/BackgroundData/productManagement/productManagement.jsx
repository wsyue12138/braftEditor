import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Button,
	message,
	Modal,
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import HandleMoudle from './components/HandleModule';

@connect(({
	global,
	productManagement
}) => ({
	global,
	productManagement
}))

@Form.create()

class ProductManagement extends Component{
	
	state = {
		loading:false,
		visible:false,
		pageNum:1,
		pageSize:9,
		searchData:{},
		onceData:{},
		drawerType:''
	}
	
	componentDidMount(){
		this.getList(true);
	}
	
	//获取列表
	getList = (isFirst) => {
		const { dispatch } = this.props;
		const { searchData,pageNum,pageSize } = this.state;
		this.setState({loading:true});
		dispatch({
            type: 'productManagement/fetchGetProductionList',
            payload: {...searchData,pageNum,pageSize},
            callback:(res) => {
            	this.setState({loading:false},() => {
            		if(isFirst){
            			this.getRoleList();
            			this.getCompanys();
            		}
            	});
            }
        })
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//添加/编辑
	handleSave = () => {
		const { drawerType } = this.state;
		this.childModule.handleSubmit(() => {
			if(drawerType === 'edit'){
				this.getList();
			}else{
				this.handleReset();
			}
			this.handleClose();
		});
	}
	
	//获取角色列表
    getRoleList = () => {
    	const { dispatch } = this.props;
        dispatch({
            type: 'productManagement/fetchGetRoleList',
            payload:{}
        })
    }
    
    //获取企业列表
    getCompanys = () => {
        this.props.dispatch({
            type: 'productManagement/fetchGetCompanys',
            payload: {}
        })
    }
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['search_id','search_productName','search_bmAppId','search_roleName','search_companyName'],(err, values) => {
			const { search_id,search_productName,search_bmAppId,search_roleName,search_companyName } = values;
			const searchData = {
				id:search_id,
				productName:search_productName,
				bmAppId:search_bmAppId,
				roleName:search_roleName,
				companyName:search_companyName
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//重置
	handleReset = () => {
		const { form:{resetFields} } = this.props;
		this.setState({searchData:{},pageNum:1},() => {
			resetFields(['search_id','search_productName','search_bmAppId','search_roleName','search_companyName']);
			this.getList();
		})
	}
	
	//打开侧边栏
	handleOpen = (drawerType,onceData={}) => {
		this.setState({onceData,drawerType,visible:true});
	}
	
	//关闭侧边栏
	handleClose = () => {
		this.setState({onceData:{},drawerType:'',visible:false});
	}
	
	//搜索部分
	searchModule(){
		const searchList = [
        	{
				type:'Input',
				id:'search_id',
				domOptions:{placeholder:'产品编号'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_productName',
				domOptions:{placeholder:'产品名称'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_bmAppId',
				domOptions:{placeholder:'数据appid'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_roleName',
				domOptions:{placeholder:'关联角色'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_companyName',
				domOptions:{placeholder:'关联企业'},
				domStyle:{width: 150},
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
				btnTitle:'重置',
				iconType:'sync',
				domOptions:{onClick:this.handleReset}
			},
			{
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:() => this.handleOpen('add')}
			}
        ]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//表格
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { global,productManagement } = this.props;
		const { productionData={} } = productManagement;
		const { list=[],total=0 } = productionData;
		let columns = [
			{
				title: '产品编号',
				key: 'id',
				width:'10%',
				render: record => {
					let { id='' } = record;
					return(
						<span>{id}</span>
					)
				}
			},
			{
				title: '产品名称',
				key: 'productName',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { productName='' } = record;
					return(
						<span>{productName}</span>
					)
				}
			},
			{
				title: '数据appid',
				key: 'bmAppid',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { bmAppId='' } = record;
					return(
						<span>{bmAppId}</span>
					)
				}
			},
			{
				title: '关联角色',
				key: 'userRoleVosStr',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { userRoleVos=[] } = record;
					let roleTxt = '';
					userRoleVos.map((item,index) => {
						const { roleName='' } = item;
						const txt = index ? '/' + roleName : roleName;
						roleTxt += txt;
					})
					return(
						<span>{roleTxt}</span>
					)
				}
			},
			// {
			// 	title: '知识库项目',
			// 	key: 'knowledgeProjectNameStr',
			// 	width:'15%',
			// 	ellipsis:true,
			// 	render: record => {
			// 		let { knowledgeProjectName=[] } = record;
			// 		let projectTxt = '';
			// 		knowledgeProjectName.map((item,index) => {
			// 			const { knowledgeProjectName='' } = item;
			// 			const txt = index ? '/' + knowledgeProjectName : knowledgeProjectName;
			// 			projectTxt += txt;
			// 		})
			// 		return(
			// 			<span>{projectTxt}</span>
			// 		)
			// 	}
			// },
			{
				title: '关联企业',
				key: 'companyName',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { companyName='' } = record;
					return(
						<span>{companyName}</span>
					)
				}
			},
			{
				title: '备注',
				key: 'memo',
				width:'18%',
				ellipsis:true,
				render: record => {
					let { memo='' } = record;
					return(
						<span>{memo}</span>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				render: record => {
					return(
						<Button onClick={() => this.handleOpen('edit',record)}>编辑</Button>
					)
				}
			}
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			columns
		}	
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: pageSize,
	  		onChange: (current, pageSize) => {
      			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			})
      		},
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}
	
	//抽屉
	drawerModule(){
		const { visible,drawerType,onceData } = this.state;
		let drawerOptions,title;
		switch (drawerType){
			case 'add':
				drawerOptions = {
					content:(<HandleMoudle {...this.props} onRef={this.onRef} onceData={onceData} drawerType={drawerType} />),
					onCancel:this.handleClose,
					okText:'保存',
					onOk:this.handleSave,
				}
				title = '产品管理/新增';
				break;
			case 'edit':
				drawerOptions = {
					content:(<HandleMoudle {...this.props} onRef={this.onRef} onceData={onceData} drawerType={drawerType} />),
					onCancel:this.handleClose,
					okText:'提交',
					onOk:this.handleSave,
				}
				title = '产品管理/编辑';
				break;
			default:
				drawerOptions = {
					content:'',
					onCancel:() => {},
					okText:'',
					onOk:() => {}
				}
				title = '';
				break;	
		}
		let drawerProps = {
			title,
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
		return(
			<div style={{width:'100%'}}>
				{this.searchModule()}
				{this.tableModule()}
				{this.drawerModule()}
			</div>
		)
	}
}

export default ProductManagement;