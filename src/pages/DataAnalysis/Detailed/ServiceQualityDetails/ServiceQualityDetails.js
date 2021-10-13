import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form,
	message
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';

@connect(({
	global,
	unknownQuestion,
	knowledgeBase,
	serviceQualityDetails
}) => ({
	global,
	unknownQuestion,
	knowledgeBase,
	serviceQualityDetails
}))

@Form.create()

class ServiceQualityDetails extends Component{
	
	state = {
		loading:false,
		searchData:{},
		orderStype:undefined,
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.getList();
		this.getGroup();
	}
	
	//获取列表
	getList = () => {
		const { dispatch,global:{appid} } = this.props;
		const { searchData,pageNum,pageSize,orderStype } = this.state;
		let payload = {...searchData,pageNum,pageSize,appid};
		payload.order = orderStype;
		this.setState({loading:true});
		dispatch({
			type:'serviceQualityDetails/fetchGetQaQuality',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}
	
	//获取业务分类
	getGroup = () => {
		const { global:{productionId} } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetCatagoryTree',
			payload:{productionId}
		})
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['group','question'],(err, values) => {
			const { group=[],question } = values;
			let searchData = {
				group:this.handleServiceTypeChange(group),
				question
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//重置
	handleReact = () => {
		const { form } = this.props;
		form.resetFields();
		this.setState({searchData:{},pageNum:1},() => {
			this.getList();
		})
	}
	
	//表格排序
	handleTableChange = (pagination, filters, sorter) => {
		const { order=-1 } = sorter;
		let orderStype = undefined;
		if(order === 'ascend'){
			orderStype = 1;
		}else
		if(order === 'descend'){
			orderStype = 0;
		}
    	this.setState({filteredInfo: filters,sortedInfo: sorter,orderStype,pageNum:1},() => {
    		this.getList();
    	});
	}
	
	//业务分类
	displayRender = (label,selectedOptions) => {
		return label[label.length - 1];
	}
	
	//业务分类选择
	handleServiceTypeChange = (selectedOptions=[]) => {
		if(selectedOptions.length){
			let onceData = selectedOptions[selectedOptions.length - 1];
			return onceData;
		}else{
			return undefined;
		}
	}
	
	//搜索部分
	searchModule(){
		const { knowledgeBase:{serviceList},unknownQuestion } = this.props;
		const { groupList=[] } = unknownQuestion;
		const searchList = [
			{
				type:'Cascader',
				id:'group',
				domOptions:{
					options:serviceList,
					allowClear:true,
					expandTrigger:"click",
					fieldNames:{ label:'categoryName', value:'categoryName', children:'children' },
					placeholder:'业务分类',
					displayRender:this.displayRender
				},
				domStyle:{width: 120}
			},
			{
				type:'Input',
				id:'question',
				domOptions:{placeholder:'标准问句'},
				domStyle:{width:150},
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
				domOptions:{onClick:this.handleReact}
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//表格
	tableModule(){
		let { loading,sortedInfo,filteredInfo,pageNum,pageSize } = this.state;
		const { serviceQualityDetails:{qaQualityData} } = this.props;
		let { list=[],total=0 } = qaQualityData;
		sortedInfo = sortedInfo || {};
    	filteredInfo = filteredInfo || {};
		const columns = [
			{
				title: '业务类别',
				key: 'group',
				width:'20%',
				render: record => {
					let { group='' } = record;
					return(
						<span>{group}</span>
					)
				}
			},
			{
				title: '标准问句',
				key: 'name',
				width:'20%',
				render: record => {
					let { name='' } = record;
					return(
						<span>{name}</span>
					)
				}
			},
			{
				title: '咨询量',
				key: 'allConsult',
				width:'20%',
				sorter:true,
				sortOrder:sortedInfo.columnKey === 'allConsult' && sortedInfo.order,
				render: record => {
					let { allConsult=0 } = record;
					return(
						<span>{allConsult}</span>
					)
				}
			},
			{
				title: '已解决评价次数',
				key: 'solve',
				width:'20%',
				render: record => {
					let { allConsult=0,notSolvedNum=0 } = record;
					let solveNum = allConsult - notSolvedNum;
					return(
						<span>{solveNum}</span>
					)
				}
			},
			{
				title: '未解决评价次数',
				key: 'notSolvedNum',
				width:'20%',
				render: record => {
					let { notSolvedNum=0 } = record;
					return(
						<span>{notSolvedNum}</span>
					)
				}
			}
		]
		
		const tableOptions = {
			onceKey:'order',
			loading, 
			columns,
			dataSource:list,
			onChange:this.handleTableChange
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
	
	render(){
		return(
			<div style={{width:'100%'}}>
				{this.searchModule()}
				{this.tableModule()}
			</div>
		)
	}
}
export default ServiceQualityDetails;