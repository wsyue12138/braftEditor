import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Input,
	Button,
	Select, 
	Icon,
	DatePicker,
	Table,
	Pagination,
	message,
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import DetailModule from './components/DetailModule';
import { setTimeFormat } from '@utils/utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({
	global,
	conversation
}) => ({
	global,
	conversation
}))

@Form.create()

class Conversation extends Component{
	
	state = {
		loading:false,
		visible:false,
		searchData:{},
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({loading:true});
		dispatch({
			type:'conversation/fetchGetChatHistory',
			payload:{...searchData,appId:appid,pageNum,pageSize},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['search_uid','search_createTime','search_receiver','search_evaluate'],(err, values) => {
			const { search_uid,search_createTime=[],search_receiver,search_evaluate } = values;
			let searchData = {
				contactsId:search_uid,
				staffName:search_receiver,
				satisfaction:search_evaluate
			}
			if(search_createTime.length){
				searchData.queryStartTime = search_createTime[0].format('YYYY-MM-DD');
				searchData.queryEndTime = search_createTime[1].format('YYYY-MM-DD');
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//重置
	handleReset = () => {
		const { form:{resetFields} } = this.props;
		resetFields(['search_uid','search_createTime','search_receiver','search_evaluate']);
		this.setState({searchData:{},pageNum:1},() => {
			this.getList();
		})
	}
	
	//详情
	hanleIntoDetail = (onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'conversation/setOnceData',
			payload:{onceData}
		})
		this.setState({visible:true});
	}
	
	//关闭详情
	handleClose = () => {
		const { dispatch } = this.props;
		this.setState({visible:false},() => {
			dispatch({
				type:'conversation/clearOnce'
			})
		});
	}
	
	//搜索
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_uid',
				iconType:'edit',
				domOptions:{placeholder:'Uid'},
				domStyle:{width:120}
			},
			{
				type:'RangePicker',
				id:'search_createTime',
				domOptions:{format:"YYYY-MM-DD",placeholder:['转人工时间','']},
				domStyle:{width:250}
			},
			{
				type:'Input',
				id:'search_receiver',
				iconType:'edit',
				domOptions:{placeholder:'接待客服'},
				domStyle:{width:150}
			},
			{
				type:'Select',
				id:'search_evaluate',
				domOptions:{placeholder:'状态'},
				domStyle:{width:150},
				optionList:[
					{val:3,label:'满意'},
					{val:2,label:'一般'},
					{val:1,label:'不满意'},
					{val:-1,label:'未评价'}
				],
				valueName:'val',
				labelName:'label'
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
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//列表
	listModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { conversation } = this.props;
		const { conversationData={} } = conversation;
		const { list=[],total=0 } = conversationData;
		let columns = [
			{
				title: 'Uid',
				key: 'uid',
				width:'14%',
				render: record => {
					let { contactsId='' } = record;
					return(
						<span>{contactsId}</span>
					)
				}
			},
			{
				title: '转人工时间',
				key: 'timer',
				width:'20%',
				render: record => {
					let { createTime='' } = record;
					return(
						<span>{createTime}</span>
					)
				}
			},
			{
				title: '接待客服',
				key: 'receiver',
				width:'16%',
				render: record => {
					let { staffName='' } = record;
					return(
						<span>{staffName}</span>
					)
				}
			},
			{
				title: '会话时长',
				key: 'duration',
				width:'16%',
				render: record => {
					let { endTime='',createTime='' } = record;
					return(
						<span>{setTimeFormat(endTime,createTime)}</span>
					)
				}
			},
			{
				title: '满意度',
				key: 'evaluate',
				width:'16%',
				render: record => {
					const { satisfaction } = record;
					let satisfactionTxt = '';
					switch (satisfaction){
						case 1:
							satisfactionTxt = '不满意';
							break;
						case 2:
							satisfactionTxt = '一般';
							break;
						case 3:
							satisfactionTxt = '满意';
							break;
						default:
							satisfactionTxt = '未评价';
							break;
					}
					return(
						<span>
							{satisfactionTxt}
						</span>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				render: record => {
					return(
						<Button 
							onClick={() => this.hanleIntoDetail(record)}
						>
							查看
						</Button>
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
      			})
	  		},
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}
	
	//抽屉
	drawerModule(){
		const { visible } = this.state;
		let drawerOptions = {
			content:(<DetailModule {...this.props} />),
			onCancel:this.handleClose,
			isOk:false
		}
		let drawerProps = {
			width:886,
			title:'历史会话/查看',
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
				{this.listModule()}
				{this.drawerModule()}
			</div>
		)
	}
}

export default Conversation;