import React,{ Component } from 'react';
import { 
	Form
} from 'antd';
import SearchForm from '@components/SearchForm';
import ExcelExport from '@components/ExcelExport';
import { getUserData,setDateFormat } from '@utils/utils';

@Form.create()

class UnknownQuestionSearch extends Component{
	
	handleSearch = () => {
		const { form:{validateFields},handleSearch } = this.props;
		let servType = undefined;
		validateFields(['search_beginTm','search_qeustionlike','search_opName','search_servType'],(err, values) => {
			let { search_beginTm=[],search_qeustionlike,search_opName,search_servType='' } = values;
			let data = {
				questionlike:search_qeustionlike,
				opName:search_opName,
				servType:search_servType.trim()
			}
			if(search_beginTm.length){
				data.beginTm = search_beginTm[0].format('YYYY-MM-DD');
				data.endTm = search_beginTm[1].format('YYYY-MM-DD');
			}
			handleSearch(data);
		})
	}
	
	handleReset = () => {
		const { handleSearch,form } = this.props;
		form.resetFields();
		handleSearch();
	}

	//导出模块
	exportModule(){
		const { global:{appid},searchData } = this.props;
		const { data={} } = getUserData();
		const { token='' } = data;
		const newTime = setDateFormat(new Date().getTime(),4);
		const params = {
			...searchData,
			appid
		}
		const options = {
			action:'/icservice/UnknownQestion/exportUnknownQestion',
			headers:{
				'Access-Control-Request-Method': '*',
            	'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			data:{...params},
			fileName:`未知问题学习${newTime}`
		}
		return(
			<ExcelExport {...options} />
		)
	}
	
	render(){
		const searchList = [
			{
				type:'RangePicker',
				id:'search_beginTm',
				domOptions:{placeholder:'操作时间'},
				domStyle:{format:"YYYY-MM-DD",width: 250}
			},
			{
				type:'Input',
				id:'search_qeustionlike',
				domOptions:{placeholder:'问题'},
				domStyle:{width: 180},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_opName',
				domOptions:{placeholder:'操作人'},
				domStyle:{width: 120},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_servType',
				domOptions:{placeholder:'业务分类'},
				domStyle:{width: 120},
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
				domOptions:{onClick:this.handleReset}
			},
			{
				type:'Dom',
				custom:this.exportModule()
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
}

export default UnknownQuestionSearch;