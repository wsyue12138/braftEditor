import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Icon,
	Button,
	message,
	Modal,
	Popover
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import ExcelExport from '@components/ExcelExport';
import ExcelUpload from '@components/ExcelUpload';
import { getUserData,setDateFormat,handleExport } from '@utils/utils';
import DrawerContent from './components/DrawerContent.js';
import styles from './QuickReply.less';

@connect(({
	global,
	quickReply
}) => ({
	global,
	quickReply
}))

@Form.create()

class QuickReply extends Component{
	
	state = {
		loading:false,
		searchData:{},
		pageNum:1,
		pageSize:10,
		visible:false,
		drawerType:'',
		onceData:{}
	}
	
	componentWillMount(){
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { loading,searchData,pageNum,pageSize } = this.state;
		const { dispatch,global } = this.props;
		const { productionId='' } = global;
		this.setState({loading:true});
		dispatch({
            type: 'quickReply/fetchGetQuickReplyPages',
            payload: {...searchData,productionId,pageNum,pageSize},
            callback:(res) => {
            	this.setState({loading:false});
            }
        })    
	}
	
	//删除请求
	deleteRrequest = (onceData) => {
		const { dispatch } = this.props;
		const { id } = onceData;
		dispatch({
            type: 'quickReply/fetchDeleteQuickReply',
            payload: {ids:id + ''},
            callback:(res) => {
            	const { success } = res;
            	if(success){
            		message.success('删除成功');
            		this.getList();
            	}else{
            		message.error('删除失败!');
            	}
            }
        })    
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//导出模板
	handleExportTemplate = () => {
		const { data={} } = getUserData();
		const { token='' } = data;
		const options = {
			action:'/icservice/quickReply/downloadQuickReplyDemo',
			method:'GET',
			headers:{
				'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			fileName:'快捷回复导入模板.xls'
		}
		handleExport(options);
	}
	
	//导入提示
	handleUpload = () => {
		const title = (
			<div className={styles.template}>
				导入表格需严格按照模板规范填写,导入将覆盖原有数据,请谨慎操作。
				<span onClick={this.handleExportTemplate}>下载导入模板+</span>
			</div>
		)
		Modal.confirm({
    		title,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			const uploadObj = document.getElementById('upload');
    			uploadObj.click();
    		}
  		});
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields,getFieldValue} } = this.props;
		validateFields(['search_keyword','search_content'],(err, values) => {
			const { search_keyword,search_content } = values;
			const searchData = {
				keyword:search_keyword,
				content:search_content
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//添加
	handleAdd = () => {
		this.setState({drawerType:'add',visible:true,onceData:{}});
	}
	
	//编辑
	handleEdit = (onceData) => {
		this.setState({drawerType:'edit',visible:true,onceData});
	}
	
	//删除
	handleDelete = (onceData) => {
		Modal.confirm({
    		title:'是否删除该条快捷回复？',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.deleteRrequest(onceData);
    		}
  		});
	}
	
	//关闭抽屉
	handleClose = () => {
		this.setState({drawerType:'',visible:false});
	}
	
	//抽屉确认
	handleOk = () => {
		const { drawerType } = this.state;
		const { form:{resetFields} } = this.props;
		this.childModule.handleOk(() => {
			let obj = {};
			if(drawerType === 'add'){
				resetFields(['search_keyword','search_content']);
				obj = {drawerType:'',visible:false,searchData:{},pageNum:1};
			}else{
				obj = {drawerType:'',visible:false};
			}
			this.setState(obj,() => {
				this.handleClose();
				this.getList();
			})
		});
	}
	
	//气泡提示
	popconfirmContent = (list) => {
		return(
			<div className={styles.contentVos}>
				{
					list.map((item,index) => {
						const { content,id } = item;
						return <div key={id}>{content}</div>
					})
				}
			</div>
		)
	}
	
	//导入模块
	uploadModule(){
		const { data={} } = getUserData();
		const { token='',productionId } = data;
		const options = {
			id:'upload',
			action:'/icservice/quickReply/importQuickReply',
			headers:{token},
			data:{productionId},
			successCallback:() => {
				this.setState({searchData:{},pageNum:1},() => {
					this.getList();
				})
			}
		}
		return(
			<div style={{width:0,overflow:'hidden'}}>
				<ExcelUpload {...options} />
			</div>
		)
	}
	
	//导出模块
	exportModule(){
		const { searchData } = this.state;
		const { data={} } = getUserData();
		const { token='',productionId=0 } = data;
		const params = {...searchData,productionId};
		const newTime = setDateFormat(new Date().getTime(),4);
		const options = {
			action:'/icservice/quickReply/exportQuickReply',
			headers:{
				'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			data:{...params},
			fileName:`人机协作快捷回复管理${newTime}`
		}
		return(
			<ExcelExport {...options} />
		)
		
	}
	
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_keyword',
				iconType:'edit',
				domOptions:{placeholder:'关键词'},
				domStyle:{width:200}
			},
			{
				type:'Input',
				id:'search_content',
				iconType:'edit',
				domOptions:{placeholder:'快捷回复'},
				domStyle:{width:200}
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
			},
			{
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:this.exportModule()
			},
			{
				type:'Dom',
				custom:(
					<Button onClick={this.handleUpload}>
			      		导入
			      		<Icon type="upload" />
			      	</Button>
				)
			}
		]
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//表格
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { quickReply:{quickReplyData} } = this.props;
		const { list=[],total=0 } = quickReplyData; 
		let columns = [
			{
				title: '关键词',
				key: 'keyWord',
				width:'25%',
				ellipsis:true,
				render: record => {
					const { keyword='' } = record;
					return(
						<span>{keyword}</span>
					)
				}
			},
			{
				title: '快捷回复',
				key: 'quickReply',
				ellipsis:true,
				render: record => {
					const { contentVos=[] } = record;
					const obj = contentVos[0];
					const { content='' } = obj;
					return(
						<Popover placement="bottomLeft" content={this.popconfirmContent(contentVos)} trigger="hover">
							<span>{content}</span>
						</Popover>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width:250,
				render: record => {
					return(
						<Fragment>
							<Button onClick={() => this.handleEdit(record)}>编辑</Button>
							<Button 
								type="danger" 
								ghost
								style={{marginLeft:12}}	
								onClick={() => this.handleDelete(record)}
							>
								删除
							</Button>
						</Fragment>
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
	  		pageSize,
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
	drawerModule(){
		const { visible,drawerType,onceData } = this.state;
		let drawerOptions = {
			content:(<DrawerContent {...this.props} type={drawerType} onRef={this.onRef} onceData={onceData} />),
			isOk:true,
			okText:'保存',
			onOk:this.handleOk,
			onCancel:this.handleClose
		}
		let drawerProps = {
			title:drawerType === 'add' ? '快捷回复管理/新增' : '快捷回复管理/编辑',
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
			<div className={styles.quickReplyBox}>
				{this.searchModule()}
				{this.tableModule()}
				{this.uploadModule()}
				{this.drawerModule()}
			</div>
		) 
	}
}

export default QuickReply;