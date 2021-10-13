import React,{ Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Button,
	Icon,
	Select,
	DatePicker, 
	Table,
	Pagination 
} from 'antd';
import router from 'umi/router';
import Bus from '@utils/eventBus';
import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({
	global,
	news
}) => ({
	global,
	news
}))

@Form.create()

class UnreadMessage extends Component{
	
	state = {
		loading:true,
		pageNum:1,
		pageSize:10
	}
	
	componentWillMount(){
		this.searchData = {
			applyPersonName:''
		}
	}
	
	componentDidMount(){
		this.getList();
		this.firstReload = false;
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'news/clearNoticePages'
		})	
	}
	
	//获取列表
	getList = () => {
		const { dispatch,global,news } = this.props;
		const { productionId='' } = global;
		const { newsCount:{unreadedNoticeCount} } = news;
		const { pageNum,pageSize } = this.state;
		this.setState({loading:true});
		let payload = {...this.searchData,productionId,pageNum,pageSize};
		dispatch({
			type:'news/fetchGetNoticePages',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success && !this.firstReload && unreadedNoticeCount){
					this.setReadNotice();
				}
				this.firstReload = true;
				this.setState({loading:false});
			}
		})	
	}
	
	//设置当前用户未读通知为已读
	setReadNotice = () => {
		const { dispatch,global } = this.props;
		const { productionId='' } = global;
		dispatch({
			type:'news/fetchsetReadNotice',
			payload:{productionId}
		})	
	}
	
	//搜索
	handleSearch = () => {
		const { form } = this.props;
		form.validateFields(['noticeType','applyPersonName','createTime'],(err, values) => {
			let { noticeType,applyPersonName='',createTime=[] } = values;
			let searchData = {
				noticeType,
				applyPersonName
			}
			if(createTime.length){
				searchData.startTime = createTime[0].format('YYYY-MM-DD');
				searchData.endTime = createTime[1].format('YYYY-MM-DD');
			}
			this.searchData = searchData;
			this.setState({pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//重置
	handleReset = () => {
		this.props.form.resetFields();
		this.searchData = {
			applyPersonName:''
		}
		this.setState({pageNum:1},() => {
			this.getList();
		})
	}
	
	//进入知识库
	handleIntoKnowledge = (data) => {
		const { dispatch,handleClose } = this.props;
		const { knowledgeContent='',knowledgeId,noticeType } = data;
		let urlStr;
		//分类初始
		// dispatch({
		// 	type:'knowledgeBase/setFromNewsData',
		// 	payload:{id:new Date().getTime()}
		// })
		let status = '';
		if(noticeType === 1 || noticeType === 2){
			status = 'jumpSingle';
			dispatch({
				type:'single/setFromNewsData',
				payload:{id:knowledgeId,question:knowledgeContent}
			})
			urlStr = '/knowledgeManagement/knowledgeBase/single';
		}else
		if(noticeType === 3 || noticeType === 4){
			status = 'jumpMultiple';
			dispatch({
				type:'multiple/setFromNewsData',
				payload:{id:knowledgeId,nodeContent:knowledgeContent}
			})
			urlStr = '/knowledgeManagement/knowledgeBase/multiple';
		}
		router.replace(urlStr);
		Bus.emit(status,{content:knowledgeContent});
		handleClose();
	}
	
	//搜索部分
	searchModule(){
		const { form:{getFieldDecorator} } = this.props;
		
		return(
			<div className={styles.searchModule}>
				<Form layout="inline">
					<Form.Item style={{marginRight:10}}>
						{getFieldDecorator('noticeType')(
							<Select 
								allowClear
								style={{ width: 145 }}
								allowClear={true}
								placeholder="提示信息类别"
							>
      							<Option value="1">单轮审核</Option>
      							<Option value="2">单轮处理</Option>
      							<Option value="3">多轮审核</Option>
      							<Option value="4">多轮处理</Option>
      							<Option value="5">工单通知</Option>
    						</Select>
          				)}
					</Form.Item>	
					<Form.Item style={{marginRight:10}}>
						{getFieldDecorator('applyPersonName')(
            				<Input
              					placeholder="发起人员"
              					style={{width:120}}
            				/>
          				)}
					</Form.Item>
					<Form.Item style={{marginRight:20}}>
						{getFieldDecorator('createTime')(
							<RangePicker format="YYYY-MM-DD" style={{ width: 250 }} />
          				)}
					</Form.Item>
					<Form.Item>
						<Button 
							type="primary"
							style={{marginRight:20}}
							onClick={this.handleSearch}
						>
							查询
							<Icon type="search" />
						</Button>
						<Button 
							style={{marginRight:20}}
							onClick={this.handleReset}
						>
							重置
							<Icon type="sync" />
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}
	
	//表格
	tableModule(){
		const { loading } = this.state;
		const { news } = this.props;
		const { newsData={} } = news;
		const { list=[] } = newsData;
		const columns = [
			{
				title: '提示信息类别',
    			key: 'category',
    			align:'center',
    			width:160,
    			render: text => {
    				let { noticeType,readStatus } = text;
    				let noticeTxt = '';
    				switch (noticeType){
    					case 1:
    						noticeTxt = '单轮审核';
    						break;
    					case 2:
    						noticeTxt = '单轮处理';
    						break;
    					case 3:
    						noticeTxt = '多轮审核';
    						break
    					case 4:
    						noticeTxt = '多轮处理';
    						break;
    					case 5:
    						noticeTxt = '工单通知';
    					default:
    						break;
    				}
    				return(
    					<span className={styles.noticeType}>
    						{
    							!readStatus ? (
    								<span></span>
    							) : ''
    						}
    						{noticeTxt}
    					</span>
    				)
    			},
			},
			{
				title: '发起人员',
    			key: 'originator',
    			align:'center',
    			width:120,
    			render: text => {
    				let { applyPersonId,applyPersonName } = text;
    				return(
    					<span 
    						className={styles.tableSpan} 
    						title={applyPersonName}
    					>
    						{applyPersonName}
    					</span>
    				)
    			}
			},
			{
				title: '环节人员',
    			key: 'linkPersonnel',
    			align:'center',
    			width:120,
    			render: text => {
    				let { operatorPersonId,operatorPersonName } = text;
    				return(
    					<span 
    						className={styles.tableSpan} 
    						title={operatorPersonName}
    					>
    						{operatorPersonName}
    					</span>
    				)
    			},
			},
			{
				title: '日期',
    			key: 'dateNum',
    			align:'center',
    			width:160,
    			render: text => {
    				let { createTime } = text;
    				return(
    					<span>{createTime}</span>
    				)
    			},
			},
			{
				title: '内容',
    			key: 'content',
    			align:'center',
    			width:190,
    			render: text => {
    				let { noteContent='' } = text;
    				return(
    					<span 
    						className={styles.tableSpan} 
    						title={noteContent}
    					>
    						{noteContent}
    					</span>
    				)
    			}
			},
			{
				title: '关联知识',
    			key: 'relation',
    			align:'center',
    			render: text => {
    				let { noticeType,knowledgeId=0,knowledgeContent='' } = text;
    				return(
    					<span 
    						className={styles.tableSpan} 
    						style={{color:noticeType === 5 ? '' : '#507CF1',cursor:'pointer'}}
    						title={knowledgeContent}
    						onClick={() => this.handleIntoKnowledge(text)}
    					>
    						{noticeType === 5 ? '' : knowledgeContent}
    					</span>
    				)
    			}
			}
		]
		return(
			<Table
				rowKey={record => record.id} 
				loading={loading} 
				columns={columns} 
				dataSource={list} 
				pagination={false}
				tableLayout='fixed'
			/>
		)
	}
	
	//分页部分
	pageModule(){
		const { pageNum,pageSize } = this.state; 
		const { news } = this.props;
		const { newsData={} } = news;
		const { total=0 } = newsData;
		const pagination = {
      		defaultCurrent: 1,
      		defaultPageSize: 10,
      		showQuickJumper: true,
      		hideOnSinglePage: true,
      		current: pageNum,
      		pageSize: pageSize,
      		onChange: (current, pageSize) => {
      			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			});
      		},
      		total
    	};
		return(
			<div className={styles.pageModule}>
				<Pagination size="small" {...pagination} />
			</div>
		)
	}
	
	render(){
		return(
			<div className={styles.unreadMessageBox}>
				<div className={styles.contentBox}>
					{this.searchModule()}
					{this.tableModule()}
				</div>
				{this.pageModule()}
			</div>
		)
	}
}

export default UnreadMessage;