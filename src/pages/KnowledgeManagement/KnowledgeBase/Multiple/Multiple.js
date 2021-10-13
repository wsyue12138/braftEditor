import React,{ Component } from 'react';
import { connect } from 'dva';
import SearchModule from './components/SearchModule';
import TableModule from './components/TableModule';
import DrawerMount from '@components/DrawerMount';
import ProcedureModule from './components/ProcedureModule';
import HistoryModule from '../components/HistoryModule';
import KeywordModule from './components/KeywordModule';
import QuestionModule from './components/QuestionModule';
import AnswerModule from './components/AnswerModule';
import { getUserData } from '@utils/utils';
import Bus from '@utils/eventBus';
import styles from './Multiple.less';

@connect(({
	global,
	user,
	knowledgeBase,
	multiple,
	region
}) => ({
	global,
	user,
	knowledgeBase,
	multiple,
	region
}))


class MultipleModule extends Component{

	constructor(props){
		super(props)
		this.state = {
			productKey:props.knowledgeBase.productKey,
			loading:true,
			expandedRowKeys:[]
		}
	}

	state = {
		loading:false
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.knowledgeBase.productKey !== this.props.knowledgeBase.productKey){         //点选业务分类
			this.setState({productKey:nextProps.knowledgeBase.productKey},() => {
				this.getList();
			})
		}
	}

	componentDidMount(){
		Bus.addListener('jumpMultiple', this.jumpMultiple);
		this.getList();
		this.getLabelName();
	}

	componentWillUnmount(){
		const { dispatch } = this.props;
		Bus.removeListener('jumpMultiple',this.jumpMultiple);
		dispatch({
			type:'multiple/clearMultiple'
		})
	}

	//获取列表
	getList = (isReoladRegion) => {
		const { productKey } = this.state;
		const {
			dispatch,
			multiple:{multipleSearch,multiplePageNum,multiplePageSize},
			global:{productionId}
		} = this.props;

		let payload = {...multipleSearch};
		payload.pageNum = multiplePageNum;
		payload.pageSize = multiplePageSize;
		payload.productionId = productionId;
		payload.serviceType = productKey === '-1' ? undefined : productKey;
		this.setState({loading:true});
		dispatch({
			type:'multiple/fetchGetQaKnowledgePage',
			payload,
			callback:(res) => {
				let obj = {loading:false};
				if(!isReoladRegion){
					obj.expandedRowKeys = [];
				}
				this.setState(obj,() => {
					isReoladRegion && this.getRegionTree();
				});
			}
		})
	}

	//消息跳转来
	jumpMultiple = (data) => {
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
			payload:{regionType:2,productionId}
		})
    }

	//获取补充说明label
	getLabelName = () => {
		const { dispatch } = this.props;
		const { data={} } = getUserData();
		const { productionId } = data;
		dispatch({
			type:'multiple/fetchGetCustomFieldName',
			payload:{productionId}
		})
	}

	//更新流程图
	updateProcedure = () => {
		this.procedureModule.setFlowChart();
	}

	//绑定组件
	onRef = (ref) => {
		this.childModule = ref;
	}

	//绑定流程图组件
	onProcedure = (ref) => {
		this.procedureModule = ref;
	}

	//关闭抽屉
	handleClose = () => {
		const { dispatch,multiple:{onceData} } = this.props;
		dispatch({
			type:'multiple/setMultipleVisible',
			payload:{multipleVisible:false,onceData}
		})
	}

	//抽屉确定
	handleAdd = () => {
		this.childModule.handleSave();
	}

	//不通过
	handleAuditFailed = () => {
		this.childModule.handleFailed();
	}

	//设置表格展开
	setExpandedRow = (expandedRowKeys) => {
		this.setState({expandedRowKeys});
	}

	//弹窗
	drawerModule(){
		const { multiple:{multipleVisible,nodeType,multipleDrawerType,originKnowledge,onceData} } = this.props;
		let title,typeTxt,isOk,okText;
		let moreBtnData = [];
		switch (multipleDrawerType){
			case 'edit':
				isOk = true;
				okText = '提交';
				typeTxt = '编辑';
				break;
			case 'examine':
				isOk = true;
				okText = '审核通过';
				typeTxt = '审核';
				moreBtnData = [
					{
						text:'审核不通过',
						type:'',
						onClick:this.handleAuditFailed
					}
				]
				break;
			case 'handle':
				isOk = true;
				okText = '开始处理';
				typeTxt = '处理';
				moreBtnData = [
					{
						text:'无法处理',
						type:'',
						onClick:this.handleAuditFailed
					}
				]
				break;
			case 'complete':
				isOk = true;
				okText = '处理完成';
				typeTxt = '处理完成';
				break;
			case 'takeEffect':
				isOk = true;
				okText = '生效';
				typeTxt = '生效';
				break;
			case 'history':
				isOk = false;
				okText = '';
				typeTxt = '历史记录';
				break;
			default:
				isOk = false;
				okText = '';
				typeTxt = '';
				break;
		}
		let drawerOptions = {
			content:'',
			onCancel:this.handleClose,
			isOk,
			okText,
			moreBtnData,
			onOk:isOk ? this.handleAdd : () => {},
			size:(nodeType === 1 && originKnowledge != null) || multipleDrawerType === 'history' ? 'large' : 'medium'
		}

		switch (nodeType){
			case 1:														//关键字
				drawerOptions.content = (<KeywordModule onRef={this.onRef} {...this.props} updateProcedure={this.updateProcedure} />);
				title = `知识库管理/关键词${typeTxt}`;
				break;
			case 2:														//问句
				drawerOptions.content = (<QuestionModule onRef={this.onRef} {...this.props} updateProcedure={this.updateProcedure} />);
				title = `知识库管理/问句${typeTxt}`;
				break;
			case 4:														//回答
				drawerOptions.content = (<AnswerModule onRef={this.onRef} {...this.props} updateProcedure={this.updateProcedure} />);
				title = `知识库管理/答案${typeTxt}`;
				break;
			default:
				if(multipleDrawerType === 'history'){					//历史记录
					drawerOptions.content = (<HistoryModule onRef={this.onRef} {...this.props} onceData={onceData} parentType='multiple' />);
					title = `知识库管理/${typeTxt}`;
				}
				break;
		}
		let drawerProps = {
			title,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible:multipleVisible
		}
		return(
			<DrawerMount
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}

	render(){
		const { loading,productKey,expandedRowKeys } = this.state;
		const { multiple:{detailState} } = this.props;
		return(
			<div className={styles.multipleModule}>
				<div className={styles.content}>
					<div className={styles.multipleBox} style={{display:detailState ? 'none' : ''}}>
						<SearchModule {...this.props} getList={this.getList} serviceType={productKey === '-1' ? undefined : productKey} />
						<TableModule 
							{...this.props} 
							loading={loading} 
							getList={this.getList} 
							expandedRowKeys={expandedRowKeys} 
							setExpandedRow={this.setExpandedRow}
						/>
						{this.drawerModule()}
					</div>
					{
						detailState ? (
							<div className={styles.procedureBox}>
								<ProcedureModule {...this.props} onRef={this.onProcedure} getList={this.getList} />
							</div>
						) : ''
					}

				</div>
			</div>
		)
	}
}

export default MultipleModule;
