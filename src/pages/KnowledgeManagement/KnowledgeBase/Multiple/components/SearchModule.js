import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Form
} from 'antd';
import { getUserData,modalContent,setDateFormat } from '@utils/utils';
import SearchForm from '@components/SearchForm';
import ExcelExport from '@components/ExcelExport';
import ExcelUpload from '@components/ExcelUpload';
import Region from '@components/Region';
import Bus from '@utils/eventBus';
import styles from './style.less';

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

@Form.create()

class MultipleSearch extends Component{
	
	constructor(props){
		super(props)
		this.state = {
			nodeContent:props.multiple.multipleSearch.nodeContent,
			regionVal:undefined
		}
	}
	
	componentWillReceiveProps(nextProps){
		if(nextProps.knowledgeBase.productKey !== this.props.knowledgeBase.productKey){         //点选业务分类
			this.setState({nodeContent:undefined},() => {
				const { form } = this.props;
				form.resetFields();
			})
		}
	}
	
	componentDidMount(){
		this.isSubmit = true;
		Bus.addListener('jumpMultiple', this.jumpMultiple);
	}

	componentWillUnmount(){
		Bus.removeListener('jumpMultiple',this.jumpMultiple);
	}

	//消息跳转来
	jumpMultiple = (data) => {
		const { form } = this.props;
		const { content='' } = data;
		this.setState({nodeContent:content},() => {
			form.resetFields();
		})
	}
	
	//搜索
	handleSearch = () => {
		const { regionVal } = this.state;
		const { dispatch,form:{validateFields},getList } = this.props;
		validateFields(['search_keyWord','search_updatePersonName','search_knowledgeStatus'],(err, values) => {
			let searchData = {
				nodeContent:values.search_keyWord,
				lastUpdatePersonName:values.search_updatePersonName,
				nodeStatus:values.search_knowledgeStatus
			}
			if(regionVal){
				const { regionCode } = regionVal;
				searchData.regionCode = regionCode;
			}
			dispatch({
				type:'multiple/setMultipleSearch',
				payload:{multipleSearch:searchData}
			})
			dispatch({
				type:'multiple/setMultiplePage',
				payload:{multiplePageNum:1}
			})	
			setTimeout(() => {
				getList();
			})
		})
	}
	
	//清除全部条件
	clearSearch = () => {
		const { dispatch,form,getList } = this.props;
		form.resetFields(['search_keyWord','search_updatePersonName','search_knowledgeStatus']);
		dispatch({
			type:'multiple/setMultipleSearch',
			payload:{multipleSearch:{}}
		})
		dispatch({
			type:'multiple/setMultiplePage',
			payload:{multiplePageNum:1}
		})	
		setTimeout(() => {
			getList();
		})
	}
	
	//导入模块
	uploadModule(){
		const { data={} } = getUserData();
		const { token='',productionId } = data;
		const options = {
			action:'/icservice/knowledge/qaKnowledge/importQaKnowledges',
			headers:{token},
			data:{productionId},
			successCallback:() => {
				this.clearSearch();
			}
		}
		return(
			<ExcelUpload {...options} />
		)
	}
	
	//导出模块
	exportModule(){
		const { multiple:{multipleSearch},serviceType } = this.props;
		const { data={} } = getUserData();
		const { token='',productionId=0 } = data;
		const params = {...multipleSearch,productionId,serviceType};
		const newTime = setDateFormat(new Date().getTime(),4);
		const options = {
			action:'/icservice/knowledge/qaKnowledge/exportQaKnowledges',
			headers:{
				'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			data:{...params},
			fileName:`知识库多轮导出${newTime}`
		}
		return(
			<ExcelExport {...options} />
		)
	}

	//选择地区
	handleRegionChange = (regionVal) => {
		this.setState({regionVal});
	}
	
	render(){
		const { nodeContent } = this.state;
		const { global,getList } = this.props;
		const { knowledgeAuthority } = global;
		const searchList = [
			{
				type:'Input',
				id:'search_keyWord',
				onceOptions:{initialValue:nodeContent},
				domOptions:{placeholder:'关键词'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Dom',
				id:'search_region',
				onceStyle:{width: 150},
				custom:(
					<Region 
						id='search'
						regionType={2}
						initStatus='add'
						placeholder='地区' 
						onChange={this.handleRegionChange}
						{...this.props} 
					/>
				)
			},
			{
				type:'Input',
				id:'search_updatePersonName',
				domOptions:{placeholder:'最近更新人'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Select',
				id:'search_knowledgeStatus',
				domOptions:{placeholder:'状态'},
				domStyle:{width: 150},
				optionList:[
					{val:0,label:'停用'},
					{val:1,label:'启用'},
					{val:1001,label:'审核通过'},
					{val:1000,label:'待审核'},
					{val:1002,label:'操作中'},
					{val:1003,label:'待生效'}
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
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:knowledgeAuthority.exportBtn ? this.exportModule() : ''
			},
			{
				type:'Dom',
				custom:knowledgeAuthority.exportBtn ? this.uploadModule() : ''
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
}

export default MultipleSearch;