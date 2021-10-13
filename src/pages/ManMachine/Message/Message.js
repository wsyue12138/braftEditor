import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Input,
	Select,
	DatePicker,
	Button,
	Icon,
	Table,
	Pagination,
	Modal,
	message
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import DrawerContent from './components/DrawerContent';
import styles from './Message.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({
	global,
	user,
	message
}) => ({
	global,
	user,
	message
}))

@Form.create()

class ManMachineMessage extends Component{
	
	state = {
		loading:false,
		searchData:{},
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { dispatch,global } = this.props;
		const { searchData,pageNum,pageSize } = this.state;
		const { appid='' } = global;
		const payload = {...searchData,pageNum,pageSize};
		this.setState({loading:true});
		dispatch({
			type:'message/fetchGetCommentGroupPage',
			payload:{...searchData,appId:appid,pageNum,pageSize},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//忽略/终止请求
	deleteRequest = (id,commentStatus) => {
		const { dispatch } = this.props;
		dispatch({
			type:'message/fetchIgnoreOrTerminateComment',
			payload:{id,commentStatus},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('操作成功');
					this.getList();
				}else{
					message.error('操作失败');
				}
			}
		})
		
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields,getFieldValue} } = this.props;
		validateFields(['uId','personInfo','latestComment','search_createTime','commentStatus','replyPersonName'],(err, values) => {
			const { search_createTime=[] } = values;
			let searchData = {...values};
			if(search_createTime.length){
				searchData.startTime = search_createTime[0].format('YYYY-MM-DD');
				searchData.endTime = search_createTime[1].format('YYYY-MM-DD');
			}
			searchData.search_createTime = undefined;
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//重置
	handleReset = () => {
		const { form:{resetFields} } = this.props;
		resetFields(['uId','personInfo','search_createTime','latestComment','commentStatus','replyPersonName']);
		this.setState({searchData:{},pageNum:1},() => {
			this.getList();
		})
	}
	
	//发送
	handleSend = () => {
		this.childModule.handleSend();
	}
	
	//忽略/终止提示
	handleDelete = (commentGroupId,commentStatus) => {
		const title = commentStatus === 3 ? '终止' : '忽略';
		Modal.confirm({
    		title: `是否确认${title}`,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.deleteRequest(commentGroupId,commentStatus);
    		}
  		});
	}
	
	//打开抽屉
	handleOpen = (drawerType,onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'message/visibleChange',
			payload:{visible:true,drawerType,onceData}
		})
	}
	
	//关闭抽屉
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'message/visibleChange',
			payload:{visible:false}
		})
	}
	
	//搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'uId',
				iconType:'edit',
				domOptions:{placeholder:'Uid'},
				domStyle:{width:120}
			},
			{
				type:'Input',
				id:'personInfo',
				iconType:'edit',
				domOptions:{placeholder:'用户信息'},
				domStyle:{width:180}
			},
			{
				type:'RangePicker',
				id:'search_createTime',
				domOptions:{format:"YYYY-MM-DD",placeholder:['提交时间','']},
				domStyle:{width:250}
			},
			{
				type:'Input',
				id:'latestComment',
				iconType:'edit',
				domOptions:{placeholder:'留言内容'},
				domStyle:{width:130}
			},
			{
				type:'Select',
				id:'commentStatus',
				domOptions:{placeholder:'状态'},
				domStyle:{width:130},
				optionList:[
					{val:2,label:'已回复'},
					{val:1,label:'未回复'},
					{val:4,label:'已忽略'},
					{val:3,label:'已终止'}
				],
				valueName:'val',
				labelName:'label'
			},
			{
				type:'Input',
				id:'replyPersonName',
				iconType:'edit',
				domOptions:{placeholder:'处理人'},
				domStyle:{width:130}
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
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { message } = this.props;
		const { messageData } = message;
		const { list=[],total=0 } = messageData;
		const columns = [
			{
				title: 'Uid',
    			key: 'uid',
    			width:100,
    			render: record => {
    				let { uId } = record;
    				return(
    					<span title={uId}>{uId}</span>
    				)
    			}
			},
			{
				title: '用户信息',
    			key: 'personInfo',
    			ellipsis:true,
    			width:180,
    			render: record => {
    				let { personInfo } = record;
    				return(
    					<span title={personInfo}>{personInfo}</span>
    				)
    			}
			},
			{
				title: '留言内容',
    			key: 'latestComment',
    			ellipsis:true,
    			width:180,
    			render: record => {
    				let { latestComment } = record;
    				return(
    					<span title={latestComment} >{latestComment}</span>
    				)
    			}
			},
			{
				title: '提交时间',
    			key: 'createTime',
    			width:180,
    			render: record => {
    				let { createTime } = record;
    				return(
    					<span>{createTime}</span>
    				)
    			}
			},
			{
				title: '分类',
    			key: 'commentCategory',
    			ellipsis:true,
    			width:120,
    			render: record => {
    				let { commentCategory } = record;
    				return(
    					<span title={commentCategory}>{commentCategory}</span>
    				)
    			}
			},
			{
				title: '状态',
    			key: 'commentStatus',
    			width:100,
    			render: record => {
    				let { commentStatus } = record;
    				let statusTxt = '';
    				if(commentStatus === 1){
    					statusTxt = '未回复';
    				}else
    				if(commentStatus === 2){
    					statusTxt = '已回复'
    				}else
    				if(commentStatus === 3){
    					statusTxt = '已终止'
    				}else{
    					statusTxt = '已忽略'
    				}
    				return(
    					<span>{statusTxt}</span>
    				)
    			}
			},
			{
				title: '回复内容',
    			key: 'latestReply',
    			ellipsis:true,
    			width:180,
    			render: record => {
    				let { latestReply } = record;
    				return(
    					<span title={latestReply}>{latestReply}</span>
    				)
    			}
			},
			{
				title: '处理人',
    			key: 'replyPersonName',
    			ellipsis:true,
    			width:120,
    			render: record => {
    				let { replyPersonName } = record;
    				return(
    					<span title={replyPersonName}>{replyPersonName}</span>
    				)
    			}
			},
			{
				title: '更新时间',
    			key: 'updateTime',
    			width:180,
    			render: record => {
    				let { updateTime } = record;
    				return(
    					<span>{updateTime}</span>
    				)
    			}
			},
			{
				title: '操作',
    			key: 'operation',
    			render: record => {
    				let { id,commentStatus } = record;
    				return(
    					<Fragment>
    						<Button onClick={() => this.handleOpen('detail',record)}>查看</Button>
    						{
    							commentStatus < 3 ? (
    								<Button onClick={() => this.handleOpen('reply',record)} style={{marginLeft:12}}>回复</Button>
    							) : ''
    						}
	    					{
	    						commentStatus === 1 ? (
	    							<Button type="danger" ghost onClick={() => this.handleDelete(id,4)} style={{marginLeft:12}}>忽略</Button>
	    							
	    						) : ''
	    					}
	    					{
	    						commentStatus === 2 ? (
	    							<Button onClick={() => this.handleDelete(id,3)} style={{marginLeft:12}}>终止对话</Button>
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
			dataSource:list,
			columns,
			rowClassName:(record) => {
				const { commentStatus } = record;
				return commentStatus === 3 || commentStatus === 4 ? styles.rowDisabled : '';
			}
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
		const { message:{visible,drawerType} } = this.props;
		let drawerOptions = {
			content:(<DrawerContent {...this.props} onRef={this.onRef} getList={this.getList} />),
			onCancel:this.handleClose,
		}
		let title;
		switch (drawerType){
			case 'detail':
				drawerOptions.isOk = false;
				title = '留言记录/查看';
				break;
			case 'reply':
				drawerOptions.okText = '发送';
				drawerOptions.onOk = this.handleSend;
				title = '留言记录/回复';
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
			<div className={styles.messageBox}>
				{this.searchModule()}
				{this.tableModule()}
				{this.drawerModule()}
			</div>
		)
	}
}
export default ManMachineMessage;