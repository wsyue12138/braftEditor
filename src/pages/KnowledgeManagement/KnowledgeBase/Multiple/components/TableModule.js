import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Button,
	Popover,
	Modal,
	message
} from 'antd';
import TableContent from '@components/TableContent';
import Region from '@components/Region';
import styles from './style.less';

@connect(({
	global,
	user,
	knowledgeBase,
	multiple
}) => ({
	global,
	user,
	knowledgeBase,
	multiple
}))

class MultipleTable extends Component{

	constructor(props){
		super(props)
		this.isSubmit = true;
	}
	
	//查看
	handleIntoDetail = (onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'multiple/setDetailState',
			payload:{detailState:true,onceData}
		})	
	}
	
	//历史记录
	handleIntoHistory = (onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'multiple/setMultipleVisible',
			payload:{multipleVisible:true,multipleDrawerType:'history',drawerWidth:810,onceData}
		})	
	}

	//删除请求
	dletetRequest = (id) => {
		const { dispatch,getList } = this.props;
		dispatch({
			type:'multiple/fetchDelQaKnowLedges',
			payload:{id},
			callback:(res) => {
				const { success,code } = res;
				this.isSubmit = true;
				if(success){
					message.success('删除成功');
					getList();
				}else{
					if(code === 11038){
						message.error('删除失败,该知识有多轮关联问句');
					}else{
						message.error('删除失败');
					}
				}
			}
		})	
	}

	
	//更新时间排序
	handleTableChange = (pagination, filters, sorter) => {
		const { dispatch,multiple,getList } = this.props;
		const { multipleSearch={} } = multiple;
		const { order='descend' } = sorter;
		let lastUpdateTimeSort = undefined;
		if(order === 'ascend'){
			lastUpdateTimeSort = 'asc';
		}else
		if(order === 'descend'){
			lastUpdateTimeSort = 'desc';
		}
		let datas = {...multipleSearch};
		datas.lastUpdateTimeSort = lastUpdateTimeSort;
		dispatch({
			type:'multiple/setMultipleSearch',
			payload:{multipleSearch:datas}
		})	
		dispatch({
			type:'multiple/setMultiplePage',
			payload:{multiplePageNum:1}
		})	
		setTimeout(() => {
			getList();
		})
	}
	
	setStateContent = (record) => {
		const { flowCode,nodeStatus='' } = record;
		let txt='';
		switch (flowCode){
			case '-1':
				txt = nodeStatus ? '启用' : '停用';
				break;
			default:
				txt = '待变更';
				break;
		}
		return txt;
	}

	//展开、收起
	handleMoreRegion = (id,_index) => {
		const { setExpandedRow,expandedRowKeys } = this.props;
		const list = [...expandedRowKeys];
		if(_index !== -1){
			list.splice(_index,1); 
		}else{
			list.push(id);
		}
		setExpandedRow(list);
	}

	//多地区其他项显示
	otherContent = (data,reactDom) => {
		const { childList=[] } = data;
		return (
			<Fragment>
				{
					childList && childList.length ? (
						<span>-</span>
					) : reactDom
				}
			</Fragment>
		)
	}

	//删除提醒
	handleDelete = (data) => {
		const { id } = data;
		Modal.confirm({
			title:`是否删除该知识`,
			content: '',
			className:'selfModal',
			centered:true,
			okText: '是',
			cancelText: '否',
			onOk:() => {
				if(!this.isSubmit){
					return false;
				}
				this.isSubmit = false;
				this.dletetRequest(id);
			},
			onCancel:() => {
				this.isSubmit = true;
			}
		});
	}

	//子集
	expandedRowRender = (datas) => {
		const { global } = this.props;
		const { knowledgeAuthority={} } = global;
		const { childList=[],id } = datas;
		return(
			<div className={styles.childContent}>
				<span className={styles.onceSplit}></span>
				{
					childList.map((item,index) => {
						const { regionName,regionFullName,serviceTypeName,lastUpdateTime,lastUpdatePersonName } = item;
						const _id = id + '_' + item.id;
						return(
							<div className={styles.onceBox} key={_id}>
								<div className={styles.leftBox}>
									<div className={styles.onceSign} style={{width:'13%'}}>
										{
											index ? (
												<div></div>	
											) : (<div className={styles.firstSign}><span></span></div>)
										}
										
									</div>
									<div className={styles.childOnce} style={{width:'13%'}}>
										{
                                            regionName !== '全国' ? (
												<Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
													<span className={styles.regionName}>{regionName}</span>
												</Popover>
											) : (<span>{regionName}</span>)
                                        }
									</div>
									<div className={styles.childOnce} style={{width:'13%'}} title={serviceTypeName}>{serviceTypeName}</div>
									<div className={styles.childOnce} style={{width:'18%'}}>{lastUpdateTime}</div>
									<div className={styles.childOnce} style={{width:'13%'}}>{lastUpdatePersonName}</div>
									<div className={styles.childOnce} style={{width:'18%'}}>
										{
											knowledgeAuthority.changeBtn && (
												<span className={styles.onceBtn} onClick={() => this.handleIntoDetail(item)}>查看</span>
											)
										}
										<span className={styles.onceBtn} onClick={() => this.handleIntoHistory(item)}>历史记录</span>
									</div>
									<div className={styles.childOnce} style={{width:'12%'}}>
										{this.setStateContent(item)}
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		);
	}
	
	render(){
		const { dispatch,loading,multiple,global,user:{userdata},getList,expandedRowKeys } = this.props;
		const { knowledgeAuthority={} } = global;
		const { multipleData={},multipleSearch={},multiplePageNum,multiplePageSize=10 } = multiple;
		const { list=[],total=0 } = multipleData;
		const { lastUpdateTimeSort='desc' } = multipleSearch;
		const { userCode } = userdata;
		const columns = [
			{
				title: '关键词',
				key: 'keyWord',
				width:'13%',
				render: record => {
					const { nodeContent='' } = record;
					return(
						<div>{nodeContent}</div>
					)
				}
			},
			{
				title: '地区',
				key: 'region',
				width:'13%',
				render: record => {
					const { id,regionName='全国',regionFullName='全国',childList=[] } = record;
					const _index = expandedRowKeys.findIndex((item) => item === id);
					const btnTxt = _index !== -1 ? '收起' : '多地区展开';
					const setRegion = () => {
						return(
							<Fragment>
								{
									regionName !== '全国' ? (
										<Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
											{regionName}
										</Popover>
									) : (<span>{regionName}</span>)
								}
							</Fragment>
						)
					}
					return(
						<Fragment>
                            {
                               	childList && childList.length ? (
									<span className={styles.regionBtn} onClick={() => this.handleMoreRegion(id,_index)}>{btnTxt}</span>
							   	) : setRegion()
                            }
                        </Fragment>
					)
				}
			},
			{
				title: '业务分类',
				key: 'business',
				width:'13%',
				render: record => {
					const { serviceTypeName='' } = record;
					return(
						<div>{serviceTypeName}</div>
					)
				}
			},
			{
				title: '最近更新时间',
				key: 'updateTime',
				sorter:true,
				sortOrder:lastUpdateTimeSort === 'desc' ? 'descend' : 'ascend',
				sortDirections: ['descend', 'ascend'],
				render: record => {
					let { lastUpdateTime='' } = record;
					return this.otherContent(record,(<span>{lastUpdateTime}</span>))
				}
			},
			{
				title: '最近更新人',
				key: 'lately',
				width:'13%',
				render: record => {
					let { lastUpdatePersonName='' } = record;
					return this.otherContent(record,(<span>{lastUpdatePersonName}</span>))
				}
			},
			{
				title: '操作',
				key: 'operation',
				width:'18%',
				render: record => {
					const { childList=[] } = record;
					const deleteContent = (<Button style={{marginRight:12}} type="danger" ghost onClick={() => this.handleDelete(record)}>删除</Button>);
					const setContent = (isSuper) => {
						return(
							<Fragment>
								{
									knowledgeAuthority.changeBtn ? (
										<Button style={{marginRight:12}} onClick={() => this.handleIntoDetail(record)}>查看</Button>
									) : ''
								}
								{ isSuper && deleteContent }
								<Button onClick={() => this.handleIntoHistory(record)}>历史记录</Button>
							</Fragment>
						)
					}
					return (
						<Fragment>
							{
								userCode === 'super_admin' ? (
									<Fragment>
										{
											childList && childList.length ? deleteContent : setContent(true)
										}
									</Fragment>
								) : this.otherContent(record,setContent())
							}
						</Fragment>
					)
				}
			},
			{
				title: '状态',
				key: 'state',
				width:'12%',
				render: record => {
					return this.otherContent(record,(<div>{this.setStateContent(record)}</div>))
				}
			}
			
		]

		//二级
		const expandedRowRender = (record) => {
			return this.expandedRowRender(record);
		}
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list,
			onChange:this.handleTableChange,
			expandIcon:data => {
				return null
			},
			expandedRowKeys,
			expandedRowRender
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: multiplePageNum,
	  		pageSize:multiplePageSize,
	  		onChange: (current, pageSize) => {
	  			dispatch({
					type:'multiple/setMultiplePage',
					payload:{multiplePageNum:current,multiplePageSize:pageSize}
				})	
				setTimeout(() => {
					getList();
				})
	  		},
	  		total
		}
		
		return (
			<div className={styles.tableBox}>
				<TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
			</div>
		)
	}

}

export default MultipleTable;