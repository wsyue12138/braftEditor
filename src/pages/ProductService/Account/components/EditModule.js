import React,{ Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	message
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

@connect(({
	global,
	user,
	productAccount
}) => ({
	global,
	user,
	productAccount
}))

@Form.create()

class AccountEditModule extends Component{
	
	state = {
		changePassword:false
	}
	
	componentWillMount(){
		this.isSubmit = true;
	}
	
	componentDidMount(){
		this.props.onRef(this);
	}
	
	//工号验证
	jobNumValidator = (rule, val='', callback) => {
		let reg = /^[0-9a-zA-Z]+$/;
		let _len = val.length;
		if(val && _len <= 10 && _len > 0 && reg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('工号要求数字或英文最大10位');
    	}
	}
	
	//姓名验证
	personNameValidator = (rule, val='', callback) => {
		let reg = /^[\u4e00-\u9fa5a-zA-Z]+$/;
		let _len = val.length;
		if(val && _len <= 10 && _len > 0 && reg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('姓名要求中文或英文最大10位');
    	}
	}
	
	//密码验证
	validatorNewPass = (rule, val='', callback) => {
		let reg = /[\u4E00-\u9FA5]/g;
		let nullReg = /\s+/g;
    	if(val.length >= 6 && val.length <= 20 && !reg.test(val) && !nullReg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('密码要求非中文且不可有空格,长度为6-20位');
    	}
	}
	
	//显示修改密码
	handleChangePaw = () => {
		this.setState({changePassword:true})
	}
	
	//保存操作
	handleSave = () => {
		if(!this.isSubmit){return false};
		this.isSubmit = false;
		const { form:{validateFields},type } = this.props;
		const { changePassword } = this.state;
		let formArr = [];
		if(type === 'add'){
			formArr = ['cid','cname','cpwd'];
		}else{
			if(changePassword){
				formArr = ['cname','cpwd'];
			}else{
				formArr = ['cname'];
			}
		}
		validateFields(formArr,(err, values) => {
			if(err){
				this.isSubmit = true;
			}else{
				if(type === 'add'){
					this.addSave(values);
				}else{
					this.editSave(values);
				}
			}
		})
	}
	
	//新增请求
	addSave = (data) => {
		const { form,global,user,dispatch,callback } = this.props;
		const { appid='' } = global;
		const { userdata:{euid} } = user;
		dispatch({
			type:'productAccount/fetchAccountCreate',
			payload:{...data,appid,euid},
			callback:(res) => {
				let { success,code } = res;
				if(success){
					callback();
				}else{
					if(code === 11026){
						form.setFields({
							'cid': {
			                	value: data.cid,
			                	errors: [new Error('工号不可重复')],
			              	},
						})
					}else{
						message.error('新增失败');
					}
				}
				this.isSubmit = true;
			}
		})
	}
	
	//编辑请求
	editSave = (data) => {
		const { onceData,dispatch,callback } = this.props;
		const { appid,euid,cid } = onceData;
		dispatch({
			type:'productAccount/fetchAccountUpdate',
			payload:{...data,appid,euid,cid},
			callback:(res) => {
				let { success } = res;
				if(success){
					callback();
				}else{
					message.error('编辑失败');
				}
				this.isSubmit = true;
			}
		})
	}
	
	render(){
		const { changePassword } = this.state;
		const { type,onceData } = this.props;
		const { cid,cname='' } = onceData;
		let passShow = true;
		if(type === 'edit' && !changePassword){
			passShow = false;
		}
		const formList = [
			{
				type:'Input',
				label:'登录工号',
				id:'cid',
				options:{
		        	initialValue:type === 'edit' ? cid : '',
		        	rules: [
		        		{ 
		        			required: type !== 'edit',
		        			validator:this.jobNumValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入工号",disabled:type === 'edit'}
			},
			{
				type:'Input',
				label:'姓名',
				id:'cname',
				options:{
		        	initialValue:type === 'edit' ? cname : '',
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.personNameValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入姓名"}
			},
			{
				type:passShow ? 'Input' : 'Dom',
				label:'密码',
				id:passShow ? 'cpwd' : 'cpwdBtn',
				options:{
		        	rules: passShow ? [
		        		{ 
		        			required: true,
		        			validator:this.validatorNewPass
		        		}
		        	] : [{required: true}]
		        },
				domOptions:{type:"password",placeholder:"请输入密码"},
				custom:passShow ? '' : (
					<div className={styles.changeBtn}>
						<span onClick={this.handleChangePaw}>点击修改</span>
					</div>)
			}
		]
		return(
			<div className={styles.editModuleBox}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default AccountEditModule;