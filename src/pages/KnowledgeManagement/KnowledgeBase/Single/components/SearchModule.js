import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Form
} from 'antd';
import { getUserData,modalContent,setDateFormat } from '@utils/utils';
import SearchForm from '@components/SearchForm';
import Region from '@components/Region';
import ExcelExport from '@components/ExcelExport';
import Bus from '@utils/eventBus';

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

@Form.create()

class SingleSearch extends Component{

	constructor(props){
		super(props)
		this.state = {
			question:props.single.singleSearch.question,
			regionVal:undefined
		}
	}

	componentWillReceiveProps(nextProps){
		if(nextProps.knowledgeBase.productKey !== this.props.knowledgeBase.productKey){         //点选业务分类
			this.setState({question:undefined},() => {
				const { form } = this.props;
				form.resetFields();
			})
		}
	}

	componentDidMount(){
		this.props.onRef(this);
		this.isSubmit = true;
		Bus.addListener('jumpSingle', this.jumpSingle);
	}

	componentWillUnmount(){
		Bus.removeListener('jumpSingle',this.jumpSingle);
	}

	//消息跳转来
	jumpSingle = (data) => {
		const { form } = this.props;
		const { content='' } = data;
		this.setState({question:content},() => {
			form.resetFields();
		})
	}

	//查询
	handleSearch = () => {
		const { dispatch,form:{validateFields},getList } = this.props;
		const { regionVal } = this.state;
		validateFields(['search_question','search_answer','search_customField','search_updatePersonName','search_knowledgeStatus','search_sourceType'],(err, values) => {
			let searchData = {
				question:values.search_question,
				answer:values.search_answer,
				customField:values.search_customField,
				updatePersonName:values.search_updatePersonName,
				knowledgeStatus:values.search_knowledgeStatus,
				sourceType:values.search_sourceType,
				regionCode:regionVal ? regionVal.regionCode : undefined
			}
			dispatch({
				type:'single/setSingleSearch',
				payload:{singleSearch:searchData}
			})
			dispatch({
				type:'single/setSinglePage',
				payload:{singlePageNum:1}
			})
			setTimeout(() => {
				getList();
			})
		})
	}

	//新增
	handleAdd = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:true,singleDrawerType:'add'}
		})

	}

	//清除全部条件
	clearSearch = () => {
		const { dispatch,form,getList } = this.props;
		form.resetFields(['search_question','search_answer','search_customField','search_updatePersonName','search_knowledgeStatus','search_sourceType']);
		dispatch({
			type:'single/setSingleSearch',
			payload:{singleSearch:{}}
		})
		dispatch({
			type:'single/setSinglePage',
			payload:{singlePageNum:1}
		})
		setTimeout(() => {
			getList();
		},500)
	}

	//导出模块
	exportModule(){
		const { single:{singleSearch},serviceType } = this.props;
		const { data={} } = getUserData();
		const { token='',productionId=0 } = data;
		const params = {...singleSearch,productionId,serviceType};
		const newTime = setDateFormat(new Date().getTime(),4);
		const options = {
			action:'/icservice/knowledge/single/exportSingleKnowledges',
			headers:{
				'Access-Control-Request-Method': '*',
            	'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			data:{...params},
			fileName:`知识库单轮导出${newTime}`
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
		const { question='' } = this.state;
		const { global,userPermission } = this.props;
		const { knowledgeAuthority } = global;
		const searchList = [
			{
				type:'Input',
				id:'search_question',
				onceOptions:{initialValue:question},
				domOptions:{placeholder:'问句'},
				domStyle:{width: 180},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_answer',
				domOptions:{placeholder:'答案'},
				domStyle:{width: 180},
				iconType:'edit'
			},
			{
				type:'Dom',
				id:'search_region',
				onceStyle:{width: '120px'},
				custom:(
					<Region 
						id='search'
						regionType={1}
						initStatus='add'
						placeholder='地区' 
						onChange={this.handleRegionChange}
						{...this.props} 
					/>
				)
			},
			{
				type:'Select',
				id:'search_knowledgeStatus',
				domOptions:{placeholder:'状态'},
				domStyle:{width: 120},
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
				type:'Select',
				id:'search_sourceType',
				domOptions:{placeholder:'来源'},
				domStyle:{width: 120},
				optionList:[
					{val:1,label:'系统'},
					{val:2,label:'用户'}
				],
				valueName:'val',
				labelName:'label'
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.handleSearch}
			}
		]
		if(knowledgeAuthority.exportBtn){
			const exportObj = {
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:this.exportModule()
			}
			searchList.push(exportObj);
		}
		if(knowledgeAuthority.changeBtn){
			const pushObj = {
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:this.handleAdd}
			}
			searchList.push(pushObj);
		}

		return <SearchForm {...this.props} searchList={searchList} />
	}
}

export default SingleSearch;
