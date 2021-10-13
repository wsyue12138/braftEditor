import React,{ Component } from 'react';
import { connect } from 'dva';
import { Form } from 'antd';
import FormModule from '../FormModule';

function UserInformation(props){
	
	const { user } = props;
	const { userdata={} } = user;
	const { personName='',userName='',jobNum='',department='',userMobile='',userSection='',roleName='',userRoleVos=[] } = userdata;
	const setRole = () => {
		let roleList = userRoleVos ? userRoleVos : [];
		let roleNameTxt = '';
		if(roleList.length){
			roleList.map((item,index) => {
				if(index){
					roleNameTxt += `\\${item.roleName}`;
				}else{
					roleNameTxt += item.roleName;
				}
			})
		}else{
			roleNameTxt = roleName;
		}
		return roleNameTxt;
	}
	const formList = [
		{
			type:'Input',
			label:'姓名',
			id:'userName',
			options:{initialValue:personName || userName},
			domOptions:{disabled:true}
		},
		{
			type:'Input',
			label:'工号',
			id:'jobNum',
			options:{initialValue:jobNum},
			domOptions:{disabled:true}
		},
		{
			type:'Input',
			label:'部门',
			id:'userSection',
			options:{initialValue:userSection},
			domOptions:{disabled:true}
		},
		{
			type:'Input',
			label:'手机',
			id:'userMobile',
			options:{initialValue:userMobile},
			domOptions:{disabled:true}
		},
		{
			type:'Input',
			label:'角色',
			id:'userRoleVos',
			options:{initialValue:setRole()},
			domOptions:{disabled:true}
		}
	]
	return(
		<div style={{width:'100%',padding:'20px 40px'}}>
			<FormModule {...props} formList={formList} />
		</div>
	)
}

export default UserInformation = Form.create()(UserInformation);