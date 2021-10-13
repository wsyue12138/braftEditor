import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Icon,
	Modal,
	message
} from 'antd';
import { getUserData,modalContent,setDateFormat } from '@utils/utils';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import ExcelExport from '@components/ExcelExport';
import ExcelUpload from '@components/ExcelUpload';

@connect(({
	global,
	serviceDetails
}) => ({
	global,
	serviceDetails
}))

@Form.create()

class ServiceDetails extends Component{

	state = {
		loading:false,
		searchData:{},
		orderStype:undefined,
		pageNum:1,
		pageSize:10
	}

	componentDidMount(){
		this.isSubmit = true;
		this.getList();
	}

	getList = () => {
		const { searchData,orderStype,pageNum,pageSize } = this.state;
		const { global:{appid},dispatch } = this.props;
		let payload = {...searchData,pageNum,pageSize,appid};
		payload.order = orderStype;
		this.setState({loading:true});
		dispatch({
			type:'serviceDetails/fetchGetServiceConsult',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})

	}

	//搜索操作
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['servName'],(err, values) => {
			const { servName='' } = values;
			this.setState({searchData:values,pageNum:1},() => {
				this.getList();
			})
		})
	}

	//表格排序
	handleTableChange = (pagination, filters, sorter) => {
		const { order=-1,columnKey } = sorter;
		let orderStype = undefined;
		if(order){
			if(columnKey === 'allConsult'){
				if(order === 'ascend'){
					orderStype = 1;
				}else
				if(order === 'descend'){
					orderStype = 0;
				}
			}else
			if(columnKey === 'star'){
				if(order === 'ascend'){
					orderStype = 3;
				}else
				if(order === 'descend'){
					orderStype = 2;
				}
			}
		}
    	this.setState({filteredInfo: filters,sortedInfo: sorter,orderStype,pageNum:1},() => {
    		this.getList();
    	});
	}

	//导入模块
	uploadModule(){
		const { global:{appid} } = this.props;
		const { data={} } = getUserData();
		const { token='' } = data;
		const options = {
			action:'/icservice/data/uploadServ',
			headers:{token},
			data:{appid},
			successCallback:() => {
				this.getList();
			}
		}
		return(
			<ExcelUpload {...options} />
		)
	}

	//导出模块
	exportModule(){
		const { global:{appid} } = this.props;
		const { data={} } = getUserData();
		const { token='' } = data;
		const options = {
			action:'/icservice/data/downloadServ?appid=' + appid,
			method:'GET',
			headers:{
                token
			},
			fileName:'服务功能明细'
		}
		return(
			<ExcelExport {...options} />
		)
	}

	//搜索部分
	searchModule(){
		const { global } = this.props;
		const { serviceAuthority={} } = global;
		const searchList = [
			{
				type:'Input',
				id:'servName',
				domOptions:{placeholder:'功能名称'},
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
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:serviceAuthority.handleBtn ? this.exportModule() : ''
			},
			{
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:serviceAuthority.handleBtn ? this.uploadModule() : ''
			}
		]

		return <SearchForm {...this.props} searchList={searchList} />
	}

	//表格
	tableModule(){
		let { loading,sortedInfo, filteredInfo,pageNum,pageSize } = this.state;
		const { serviceDetails:{serviceConsultData} } = this.props;
    	sortedInfo = sortedInfo || {};
    	filteredInfo = filteredInfo || {};
    	const { list=[],total=0 } = serviceConsultData;
		const columns = [
			{
				title: '排名序号',
				key: 'order',
				width:'20%',
				render: record => {
					let { order='' } = record;
					return(
						<span>{order}</span>
					)
				}
			},
			{
				title: '功能名称',
				key: 'servName',
				width:'25%',
				render: record => {
					let { servName='' } = record;
					return(
						<span>{servName}</span>
					)
				}
			},
			{
				title: '咨询量',
				key: 'allConsult',
				width:'25%',
				sorter:true,
				sortOrder:sortedInfo.columnKey === 'allConsult' && sortedInfo.order,
				render: record => {
					let { allConsult='' } = record;
					return(
						<span>{allConsult}</span>
					)
				}
			},
			{
				title: '热度',
				key: 'star',
				width:'30%',
				sorter:true,
				sortOrder:sortedInfo.columnKey === 'star' && sortedInfo.order,
				render: record => {
					let { star=0 } = record;
					let starContent = [];
					if(star){
						for(let i = 0;i < star;i++){
							starContent.push(<Icon type="star" theme="filled" key={i} style={{color:'#FFCC40'}} />);
						}
					}else{
						starContent = '';
					}
					return(
						<Fragment>
							{starContent}
						</Fragment>
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

export default ServiceDetails;
