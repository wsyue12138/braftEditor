import React,{ Component } from 'react';
import { connect } from 'dva';
import SearchModule from './components/SearchModule';
import TableModule from './components/TableModule';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';
import EditModule from './components/EditModule';
import DetailModule from './components/DetailModule';
import ExamineModule from './components/ExamineModule';
import HandleModule from './components/HandleModule';
import SimilarModule from './components/SimilarModule';
import HistoryModule from '../components/HistoryModule';
import { getUserData } from '@utils/utils';
import Bus from '@utils/eventBus';
import styles from './Single.less';

@connect(({
	global,
	user,
	knowledgeBase,
	single,
	region
}) => ({
	global,
	user,
	knowledgeBase,
	single,
	region
}))


class SingleModule extends Component{

	constructor(props){
		super(props)
		this.state = {
			productKey:props.knowledgeBase.productKey,
			loading:true,
			drawerWidth:422,
			selectedRowKeys:[],
			selectedRows:[],
			expandedRowKeys:[],
			userPermission:{}
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.knowledgeBase.productKey !== this.props.knowledgeBase.productKey){         //点选业务分类
			this.setState({productKey:nextProps.knowledgeBase.productKey},() => {
				this.getList();
			})
		}
	}

	componentDidMount(){
		Bus.addListener('jumpSingle', this.jumpSingle);
		this.getUserPermission();
		this.getList();
		this.getLabelName();
	}

	componentWillUnmount(){
		const { dispatch } = this.props;
		Bus.removeListener('jumpSingle',this.jumpSingle);
		dispatch({
			type:'single/clearSingle'
		})
	}

	aa = () => {
		console.log('jumpSingle')
	}

	//绑定组件
	onRef = (ref) => {
		this.childModule = ref;
	}

	//绑定搜索组件
	onSearchRef = (ref) => {
		this.searchModule = ref;
	}

	//获取列表
	getList = (isReoladRegion) => {
		const { productKey } = this.state;
		const {
			dispatch,
			single:{singleSearch,singlePageNum,singlePageSize},
			global:{productionId}
		} = this.props;

		let payload = {...singleSearch};
		payload.pageNum = singlePageNum;
		payload.pageSize = singlePageSize;
		payload.productionId = productionId;
		payload.serviceType = productKey === '-1' ? undefined : productKey;
		this.setState({loading:true});
		dispatch({
			type:'single/fetchGetSingleKnowledgePages',
			payload,
			callback:(res) => {
				let { success } = res;
				this.setState({loading:false,selectedRowKeys:[],selectedRows:[],expandedRowKeys:[]},() => {
					isReoladRegion && this.getRegionTree();
				});
			}
		})
	}

	//操作权限查询
	getUserPermission = () => {
		const { dispatch,global,user:{userdata} } = this.props;
		const { productionId } = global;
		const { id } = userdata;
		dispatch({
			type:'single/fetchUserKnowledgePermission',
			payload:{productionId,userId:id},
			callback:(res) => {
				const { success } = res;
				if(success){
					const { data } = res.data;
					this.setState({userPermission:data ? data : {}});
				}
			}
		})
	}

	//消息跳转来
	jumpSingle = (data) => {
		setTimeout(() => {
			this.getList();
		})
	}

	//搜索获取地区列表
    getRegionTree = () =>{
        const { dispatch,global } = this.props;
		const { productionId } = global;
        dispatch({
			type:'region/fetchGetRegionTree',
			payload:{regionType:1,productionId}
		})
    }

	//刷新列表
	reloadList = () => {
		this.searchModule.clearSearch();
	}

	//设置表格展开
	setExpandedRow = (expandedRowKeys) => {
		this.setState({expandedRowKeys});
	}

	//设置表格选择
	setSelectedRow = (selectedRowKeys,selectedRows) => {
		this.setState({selectedRowKeys,selectedRows});
	}

	//获取补充说明label
	getLabelName = () => {
		const { dispatch } = this.props;
		const { data={} } = getUserData();
		const { productionId } = data;
		dispatch({
			type:'single/fetchGetCustomFieldName',
			payload:{productionId}
		})
	}

	//关闭抽屉
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:false}
		})
	}

	//抽屉确定
	handleAdd = () => {
		const { single:{singleDrawerType} } = this.props;
		this.childModule.handleSave();
	}

	//不通过
	handleAuditFailed = () => {
		this.childModule.handleFailed();
	}

	//弹窗
	drawerModule(){
		const { single:{singleVisible,singleDrawerType,originKnowledge,onceData} } = this.props;
		let drawerOptions,title
		switch (singleDrawerType){
			case 'add':										//新增
				drawerOptions = {
					content:(<AddModule onRef={this.onRef} {...this.props} getList={this.reloadList} />),
					onCancel:this.handleClose,
					okText:'申请新增',
					onOk:this.handleAdd,
					size:'x-medium'
				}
				title = '知识库管理/新增';
				break;
			case 'edit':									//编辑
				drawerOptions = {
					content:(<EditModule onRef={this.onRef} {...this.props} getList={this.getList} />),
					onCancel:this.handleClose,
					okText:'申请修改',
					onOk:this.handleAdd,
					size:'x-medium'
				}
				title = '知识库管理/编辑';
				break;
			case 'detail':
				drawerOptions = {
					content:(<DetailModule onRef={this.onRef} {...this.props} />),
					onCancel:this.handleClose,
					isOk:false,
					size:'medium'
				}
				title = '知识库管理/查看';
				break;
			case 'examine':   								//审核
				drawerOptions = {
					content:(<ExamineModule onRef={this.onRef} {...this.props} getList={this.getList} />),
					onCancel:this.handleClose,
					okText:'审核通过',
					onOk:this.handleAdd,
					moreBtnData:[
						{
							text:'审核不通过',
							type:'',
							onClick:this.handleAuditFailed
						}
					],
					size:originKnowledge != null ? 'large' : 'medium'
				}
				title = '知识库管理/审核';
				break;
			case 'handle':									//处理
				drawerOptions = {
					content:(<HandleModule onRef={this.onRef} {...this.props} getList={this.getList} />),
					onCancel:this.handleClose,
					okText:'开始处理',
					onOk:this.handleAdd,
					moreBtnData:[
						{
							text:'无法处理',
							type:'',
							onClick:this.handleAuditFailed
						}
					],
					size:originKnowledge != null ? 'large' : 'medium'
				}
				title = '知识库管理/处理';
				break;
			case 'similar':									//关联相似
				drawerOptions = {
					content:(<SimilarModule onRef={this.onRef} {...this.props} getList={this.getList} />),
					onCancel:this.handleClose,
					isOk:false,
					size:'large'
				}
				title = '知识库管理/关联相似';
				break;
			case 'history':									//历史记录
				drawerOptions = {
					content:(<HistoryModule onRef={this.onRef} {...this.props} onceData={onceData} parentType='single' />),
					onCancel:this.handleClose,
					isOk:false,
					size:'large'
				}
				title = '知识库管理/历史记录';
				break;
			default:
				drawerOptions = {
					content:'',
					onCancel:() => {},
					okText:'',
					onOk:() => {},
					size:'medium'
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
	        visible:singleVisible
		}
		return(
			<DrawerMount
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}

	render(){
		const { loading,productKey,selectedRowKeys,selectedRows,expandedRowKeys,userPermission } = this.state;
		return(
			<div className={styles.singleModule}>
				<div className={styles.content}>
					<div className={styles.singleBox}>
						<SearchModule
							onRef={this.onSearchRef}
							getList={this.getList}
							userPermission={userPermission}
							serviceType={productKey === '-1' ? undefined : productKey}
						/>
						<TableModule 
							loading={loading} 
							userPermission={userPermission}
							getList={this.getList} 
							expandedRowKeys={expandedRowKeys}
							selectedRowKeys={selectedRowKeys} 
							selectedRows={selectedRows} 
							setSelectedRow={this.setSelectedRow}
							setExpandedRow={this.setExpandedRow}
						/>
						{this.drawerModule()}
					</div>
				</div>
			</div>
		)
	}
}

export default SingleModule;
