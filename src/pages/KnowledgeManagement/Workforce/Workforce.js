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
import Chart from './components/Chart';
import AddModule from './components/AddModule';
import HandleMoudle from './components/HandleMoudle';
import ProcessedModule from './components/ProcessedModule';
import styles from './Workforce.less';

@connect(({
	global,
	user,
	workforce,
	knowledgeBase
}) => ({
	global,
	user,
	workforce,
	knowledgeBase
}))

@Form.create()

class Workforce extends Component{
	
	state = {
		loading:false,
		visible:false,
		pageNum:1,
		pageSize:8,
		searchData:{},
		drawerType:''
	}
	
	componentDidMount(){
		this.isSubmit = true;
		this.getStatistics();
		this.getList();
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'workforce/clearWorkforce'
		})	
	}
	
	//获取列表
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { dispatch } = this.props;
		this.setState({loading:true});
		dispatch({
			type:'workforce/fetchWorkforceList',
			payload:{...searchData,pageNum,pageSize},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//获取统计信息
	getStatistics = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'workforce/fetchStatistics'
		})
	}

	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['search_itemName','search_workStatus','search_createTime','search_applyPersonName'],(err, values) => {
			const { search_itemName,search_workStatus,search_createTime=[],search_applyPersonName } = values;
			let searchData = {
				itemName:search_itemName,
				workStatus:search_workStatus,
				applyPersonName:search_applyPersonName
			}
			if(search_createTime.length){
				searchData.startTime = search_createTime[0].format('YYYY-MM-DD');
				searchData.endTime = search_createTime[1].format('YYYY-MM-DD');
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
	    });
	}
	
	//重置
	handleReset = () => {
		const { form:{resetFields} } = this.props;
		resetFields(['search_itemName','search_workStatus','search_createTime','search_applyPersonName']);
		this.setState({searchData:{},pageNum:1},() => {
			this.getList();
		})
	}
	
	//添加
	handleAdd = () => {
		this.setState({visible:true,drawerType:'add'});
	}
	
	//已处理
	handleProcessed = (data) => {
		const { dispatch } = this.props;
		const { workStatus } = data;
		if(workStatus){
			this.setState({visible:true,drawerType:'processed'},() => {
				dispatch({
					type:'workforce/saveOnceData',
					payload:{onceData:data}
				})
			});
		}
	}
	
	//处理
	hanleUnProcessed = (data) => {
		const { dispatch } = this.props;
		this.setState({visible:true,drawerType:'handle'},() => {
			dispatch({
				type:'workforce/saveOnceData',
				payload:{onceData:data}
			})
		});
	}
	
	//删除请求
	deleteRequest = (data) => {
		const { dispatch } = this.props;
		const { id } = data;
		dispatch({
			type:'workforce/fetchDeleteWorkforce',
			payload:{id},
			callback:(res) => {
				const { success } = res;
				if(success){
					this.getList();
					message.success('删除成功');
				}else{
					message.error('删除失败');
				}
			}
		})
	}
	
	//关闭抽屉
	handleClose = () => {
		this.setState({visible:false,drawerType:''});
	}
	
	//保存
	handleSave = () => {
		this.childModule.handleSave(() => {
			this.setState({visible:false},() => {
				this.getStatistics();
				this.getList();
			})
		});
	}
	
	//删除提醒
	hanleDelete = (data) => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		Modal.confirm({
    		title:'是否确认删除',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.deleteRequest(data);
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
	}
	
	//搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_itemName',
				domOptions:{placeholder:'事项名称'},
				domStyle:{width: 120},
				iconType:'edit'
			},
			{
				type:'Select',
				id:'search_workStatus',
				domOptions:{placeholder:'状态'},
				domStyle:{width: 120},
				optionList:[{val:1,label:'已处理'},{val:2,label:'未处理'}],
				valueName:'val',
				labelName:'label'
			},
			{
				type:'RangePicker',
				id:'search_createTime',
				domOptions:{placeholder:'操作时间'},
				domStyle:{format:"YYYY-MM-DD",width: 250}
			},
			{
				type:'Input',
				id:'search_applyPersonName',
				domOptions:{placeholder:'申请人员'},
				domStyle:{width: 120},
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
				domOptions:{onClick:this.handleAdd}
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//表格
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { global,workforce:{workforceData},user:{userdata} } = this.props;
		const { workforceAuthority } = global;
		const { list=[],total=0 } = workforceData;
		const _width = '14%';
		let columns = [
			{
				title: '事项名称',
				key: 'itemName',
				ellipsis:true,
				width:_width,
				render: record => {
					let { itemName='' } = record;
					return(
						<span>{itemName}</span>
					)
				}
			},
			{
				title: '业务分类',
				key: 'categoryName',
				ellipsis:true,
				width:_width,
				render: record => {
					let { categoryName='' } = record;
					return(
						<span>{categoryName}</span>
					)
				}
			},
			{
				title: '申请内容',
				key: 'content',
				ellipsis:true,
				width:_width,
				render: record => {
					let { content='' } = record;
					return(
						<span>{content}</span>
					)
				}
			},
			{
				title: '申请人员',
				key: 'applyPersonName',
				ellipsis:true,
				width:_width,
				render: record => {
					let { applyPersonName='' } = record;
					return(
						<span>{applyPersonName}</span>
					)
				}
			},
			{
				title: '日期',
				key: 'createTime',
				ellipsis:true,
				width:_width,
				render: record => {
					let { createTime='' } = record;
					return(
						<span>{createTime}</span>
					)
				}
			},
			{
				title: '状态',
				key: 'resultStatus',
				ellipsis:true,
				width:_width,
				render: record => {
					let { workStatus } = record;
					let txt = workStatus ? '已处理' : '未处理';
					return(
						<span 
							className={workStatus ? styles.processed : ''}
							onClick={() => this.handleProcessed(record)}
						>
							{txt}
						</span>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width:_width,
				render: record => {
					let { workStatus,applyPersonId } = record;
					return(
						<Fragment>
							{
								workforceAuthority.handleBtn ? (
									<Button 
										onClick={() => this.hanleUnProcessed(record)}
										disabled={workStatus ? true : false}
									>
										处理
									</Button>
								) : ''
							}
							{
								!workStatus && applyPersonId === userdata.id ? (
									<Button 
										type="danger" 
										ghost
										style={{marginLeft: workforceAuthority.handleBtn ? 12 : 0}}
										onClick={() => this.hanleDelete(record)}
										disabled={workStatus ? true : false}
									>
										删除
									</Button>
								) : ''
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
			dataSource:list
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize,
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
		const { visible,drawerType } = this.state;
		let drawerOptions,title;
		switch (drawerType){
			case 'add':
				drawerOptions = {
					content:(<AddModule {...this.props} onRef={this.onRef} />),
					onCancel:this.handleClose,
					okText:'保存',
					onOk:this.handleSave,
				}
				title = '工单管理/新增';
				break;
			case 'handle':
				drawerOptions = {
					content:(<HandleMoudle {...this.props} onRef={this.onRef} />),
					onCancel:this.handleClose,
					okText:'提交',
					onOk:this.handleSave,
				}
				title = '工单管理/处理';
				break;
			case 'processed':
				drawerOptions = {
					content:(<ProcessedModule {...this.props} />),
					onCancel:this.handleClose,
					isOk:false
				}
				title = '工单管理/已处理';
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
		const { global } = this.props;
		const { workforceAuthority } = global;
		return(
			<div style={{width:'100%'}}>
				{
					workforceAuthority.handleBtn ? (
						<Chart {...this.props} />
					) : ''
				}
				{this.searchModule()}
				{this.tableModule()}
				{this.drawerModule()}
			</div>
		)
	}
}

export default Workforce;