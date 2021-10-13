import React,{ Component } from 'react';
import { connect } from 'dva';
import { Form,message } from 'antd';
import router from 'umi/router';
import Store from 'store';
import { encryption } from '@utils/jsencrypt';
import FormModule from '../FormModule';

@connect(({
	user
}) => ({
	user
}))

@Form.create()

class ChangePassword extends Component{
	
	componentWillMount(){
		const { user } = this.props;
		const { userdata={} } = user;
		this.userdata = userdata;
		this.newPass = '';
		this.isSubmit = true;
	}
	
	componentDidMount(){
		this.props.onRef(this);
	}
	
	//原密码验证
	validatorUserPwd = (rule, val='', callback) => {
		const { userPwd='' } = this.userdata;
		if(val && val === userPwd){
			callback();
		}else{
			this.isSubmit = true;
			callback('请输入正确原密码');
		}
	}
	
	//新密码验证
	validatorNewUserPwd = (rule, val='', callback) => {
		var reg = /[\u4E00-\u9FA5]/g;
    	if(val.length >= 6 && val.length <= 20 && !reg.test(val)){
    		let { userPwd } = this.userdata;
    		if(val === userPwd){
    			callback('新密码不得与原密码相同');
    		}else{
    			callback();
    		}
    	}else{
    		this.isSubmit = true;
    		callback('密码要求非中文,长度为6-20位');
    	}
	}
	
	//重复密码验证
	validatorRepeatUserPwd = (rule, val='', callback) => {
		if(val === this.newPass){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('两次密码输入不同');
    	}
	}
	
	//记录新密码
	handleChange = (e) => {
		let val = e.target.value;
		this.newPass = val;
	}
	
	//保存
	handleSave = (e) => {
		const { form } = this.props;
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		form.validateFields(['userPwd','newUserPwd','repeatUserPwd'],(err,values) => {
      		if (err) {
        		this.isSubmit = true;
      		}else{
      			let { userPwd,newUserPwd } = values;
      			this.getPublicKey(userPwd,newUserPwd);
      		}
    	});
	}
	
	//获取公钥
	getPublicKey = (userPwd,newUserPwd) => {
		const { dispatch } = this.props;
		dispatch({
			type:'user/fetchGetPublicKey',
			callback:(res) => {
				let { success } = res;
				if(success){
					let { data:{publicKey} } = res.data;
					this.putResetPass(encryption(publicKey,userPwd),encryption(publicKey,newUserPwd),publicKey);
				}else{
					message.error('密码修改失败');
					this.isSubmit = true;
				}
			}
		})	
	}
	
	//修改密码请求
	putResetPass = (originPassWord,userPwd,publicKey) => {
		const { form,dispatch,user } = this.props;
		const { userdata:{userName,id,euid} } = user;
		let payload = {
			id,
			euid,
			userName,
			userPwd,
			originPassWord,
			publicKey
		}
		dispatch({
			type:'login/fetchChangePwd',
			payload,
			callback:(res) => {
				const { success,code } = res; 
				if(success){
					message.success('密码修改成功，请重新登录');
					Store.remove('userData');
					router.push('/user/login');
				}else{
					if(code === 11023){
						form.setFields({
			              	'userPwd': {
			                	value: '',
			                	errors: [new Error('原密码错误,请重新输入')],
			              	},
			            });
					}else{
						message.error('密码修改失败');
					}
				}
				this.isSubmit = true;
			}
		})		
	}
	
	render(){
		const { personName='',userName='',jobNum='' } = this.userdata;
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
				label:'原密码',
				id:'userPwd',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
		        			message:'请输入原密码'
		        		}
		        	]
		        },
				domOptions:{type:"password"}
			},
			{
				type:'Input',
				label:'新密码',
				id:'newUserPwd',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.validatorNewUserPwd
		        		}
		        	]
		        },
				domOptions:{type:"password",onChange:this.handleChange}
			},
			{
				type:'Input',
				label:'重复新密码',
				id:'repeatUserPwd',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
				        	validator:this.validatorRepeatUserPwd
		        		}
		        	]
		        },
				domOptions:{type:"password"},
			}
		]
		return(
			<div style={{width:'100%',padding:'20px 40px'}}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default ChangePassword;