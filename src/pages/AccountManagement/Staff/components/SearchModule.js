import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Form
} from 'antd';
import SearchForm from '@components/SearchForm';
import styles from './style.less';

@connect(({
	user,
	accountManagement
}) => ({
	user,
	accountManagement
}))

@Form.create()

class StaffSearch extends Component{
	
	componentDidMount(){
		const { dispatch,user={} } = this.props;
    const { userdata={} } = user;
		const { belongCompanyId } = userdata;
		dispatch({
			type:'accountManagement/fetchGetRolesByComOrProduct',
			payload:{companyId:belongCompanyId}
		})
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields},callback } = this.props;
		validateFields(['search_personName','search_jobNum','search_userMobile','search_userSection','search_userName'],(err, values) => {
			let searchData = {
				personName:values.search_personName,
				jobNum:values.search_jobNum,
				userMobile:values.search_userMobile,
				userSection:values.search_userSection,
				userName:values.search_userName
			}
	    	callback(searchData)
	    });
	}
	
	//新增
	handleAdd = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/drawerChange',
			payload:{visible:true,drawerType:'add'}
		})	
	}
	
	render(){
		const searchList = [
			{
				type:'Input',
				id:'search_personName',
				iconType:'edit',
				domOptions:{placeholder:'员工姓名'},
				domStyle:{width:120}
			},
			{
				type:'Input',
				id:'search_jobNum',
				iconType:'edit',
				domOptions:{placeholder:'工号'},
				domStyle:{width:120}
			},
			{
				type:'Input',
				id:'search_userMobile',
				iconType:'edit',
				domOptions:{placeholder:'手机号'}
			},
			{
				type:'Input',
				id:'search_userSection',
				iconType:'edit',
				domOptions:{placeholder:'部门'}
			},
			{
				type:'Input',
				id:'search_userName',
				iconType:'edit',
				domOptions:{placeholder:'登录账号'}
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.handleSearch}
			},
			{
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:this.handleAdd}
			},
		]
		return(
			<SearchForm {...this.props} searchList={searchList} />
		)
	}
}

export default StaffSearch;