import React,{ Component } from 'react';
import { 
	Button,
	Table,
	Popover,
	Pagination,
} from 'antd';
import styles from './detail.less';

export default class ConversationDetail extends Component{
	
	state = {
		loading:false,
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { pageNum,pageSize } = this.state;
		const { dispatch,conversation:{onceData} } = this.props;
		const { chatPackSeq } = onceData;
		this.setState({loading:true});
		dispatch({
			type:'conversation/fetchGetChatDetails',
			payload:{chatPackSeq,pageNum,pageSize},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//列表
	listModule(){
		const { loading } = this.state;
		const { conversation } = this.props;
		const { chatDetails={} } = conversation;
		const { list=[] } = chatDetails;
		let columns = [
			{
				title: '姓名',
				key: 'name',
				ellipsis:true,
				align:'center',
				width:'20%',
				render: record => {
					let { fromPersonName='',fromPersonId='' } = record;
					let name = fromPersonName ? fromPersonName : fromPersonId;
					return(
						<span title={name}>{name}</span>
					)
				}
			},
			{
				title: '时间',
				key: 'time',
				ellipsis:true,
				align:'center',
				width:'25%',
				render: record => {
					let { createTime='' } = record;
					return(
						<span>{createTime}</span>
					)
				}
			},
			{
				title: '内容',
				key: 'content',
				ellipsis:true,
				align:'center',
				render: record => {
					let { msg='' } = record;
					const content = (
						<span>{msg}</span>
					)
					return(
						<Popover placement="top" title='' content={content} trigger="hover">
							<span>{msg}</span>
						</Popover>
					)
				}
			}
		]
		
		return(
			<div className={styles.tableModule}>
				<Table 
					rowKey={record => record.id} 
					loading={loading} 
					columns={columns} 
					dataSource={list} 
					pagination={false}
					tableLayout='fixed'
				/>
			</div>
		)
	}
	
	//分页
	pageModule(){
		const { pageNum,pageSize } = this.state;
		const { conversation } = this.props;
		const { chatDetails={} } = conversation;
		const { total=0 } = chatDetails;
		let pagination = {
			defaultCurrent: 1,
      		defaultPageSize: 10,
      		showQuickJumper: true,
      		hideOnSinglePage: true,
      		current: pageNum,
      		pageSize: pageSize,
      		onChange: (current, pageSize) => {
      			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			})
      		},
      		total
		}
		return(
			<div className={styles.pageModule}>
				<Pagination size="small" {...pagination} />
			</div>
		)
	}
	
	render(){
		return(
			<div className={styles.detail}>
				{this.listModule()}
				{this.pageModule()}
			</div>
		)
	}
}
