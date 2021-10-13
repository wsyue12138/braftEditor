import React,{ Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Button,
	Layout,
	message
} from 'antd';
import router from 'umi/router';
import HeaderContent from '@components/HeaderContent/HeaderContent';
import { getUserData } from '@utils/utils';
import { encryption } from '@utils/jsencrypt';
import styles from './Reset.less';

const { Content } = Layout;

@connect(({
	login,
	user
}) => ({
	login,
	user
}))

@Form.create()

class ResetContent extends Component{

	state = {
		loading:false
	}

	componentWillMount(){
		this.isSubmit = true;
		this.newPass = '';
	}

	componentDidMount(){
		const { dispatch,login,user } = this.props;
		let { userdata=null } = user;
		if(userdata === null){
      router.push('/user/login');
		}else{
			this.userData = getUserData();
			let { data:{loginSuccess} } = this.userData;
			let { loginStatus } = userdata;
			if(loginStatus === 1){		   											//非首次登录
				if(loginSuccess === 0){												//未选择产品
					router.push('/common/product');
				}else{																//已登录
					router.push('/');
				}
			}
		}
	}

	//新密码验证
	validatorNewPass = (rule, val='', callback) => {
    	var reg = /[\u4E00-\u9FA5]/g;
    	if(val.length >= 6 && val.length <= 20 && !reg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('密码要求非中文,长度为6-20位');
    	}
	}

	//确认密码验证
	validatorConfirmPass = (rule, val='', callback) => {
    	if(val === this.newPass){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('两次密码输入不同');
    	}
	}

	handleChange = (e) => {
		let val = e.target.value;
		this.newPass = val;
	}

	//提交
	handleReset = (e) => {
		e.preventDefault();
		const { form } = this.props;
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		form.validateFields(['newPass','confirmPass'],(err,values) => {
      		if (err) {
        		this.isSubmit = true;
      		}else{
      			let { newPass } = values;
      			this.getPublicKey(newPass);
      		}
    	});
	}

	//获取公钥
	getPublicKey = (newPass) => {
		const { dispatch } = this.props;
		dispatch({
			type:'user/fetchGetPublicKey',
			callback:(res) => {
				let { success } = res;
				if(success){
					let { data:{publicKey} } = res.data;
					this.putResetPass(encryption(publicKey,newPass),publicKey);
				}else{
					message.error('重置失败');
					this.isSubmit = true;
				}
			}
		})
	}

	//重置密码请求
	putResetPass = (userPwd,publicKey) => {
		const { dispatch,user } = this.props;
		const { userdata:{userName,id,euid} } = user;
		let payload = {
			id,
			euid,
			userName,
			userPwd,
			publicKey
		}
		dispatch({
			type:'login/fetchChangePwd',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success){
					router.push('/common/product');
				}else{
					message.error('重置失败');
				}
				this.isSubmit = true;
			}
		})
	}

	render(){
		const { form:{getFieldDecorator},user } = this.props;
		const { userdata={} } = user
		const { userName='' } = userdata;
		return(
			<Layout className={styles.resetBox}>
				<HeaderContent type="login" />
				<Layout className={styles.resetContent}>
					<Content>
						<div className={styles.content}>
							<div className={styles.signRoute}>
								<span>登录 > </span>
								<span style={{color:'#262626'}}>重置密码</span>
							</div>
							<div className={styles.resetFromBox} >
								<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
									<Form.Item label="账号">
          								{getFieldDecorator('userName', {
            								initialValue:userName,
          								})(
          									<Input
          										disabled
          									/>
          								)}
        							</Form.Item>
        							<Form.Item label="新密码">
          								{getFieldDecorator('newPass', {
            								rules: [
												{
													validator:this.validatorNewPass
												}
											]
          								})(
          									<Input
          										type="password"
          										placeholder="请输入新密码"
          										onChange={this.handleChange}
          									/>
          								)}
        							</Form.Item>
        							<Form.Item label="确认新密码">
          								{getFieldDecorator('confirmPass',{
            								rules: [
												{
													validator:this.validatorConfirmPass
												}
											]
          								})(
          									<Input
          										type="password"
          										placeholder="请输入新密码"
          									/>
          								)}
        							</Form.Item>
        							<Form.Item>
        								<Button className={styles.resetBtn} type="primary" onClick={this.handleReset} >
            								提交
          								</Button>
        							</Form.Item>
								</Form>
							</div>
						</div>
					</Content>
				</Layout>
			</Layout>
		)
	}
}

export default ResetContent;
