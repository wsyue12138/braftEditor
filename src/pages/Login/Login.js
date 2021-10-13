import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button } from 'antd';
import router from 'umi/router';
import Store from 'store';
import { encryption } from '@utils/jsencrypt';
import styles from './Login.less';

const FormItem = Form.Item;

@connect(({
	login,
	user
}) => ({
	login,
	user
}))

@Form.create()

class Login extends Component{

	state = {
		isErr:false
	}

	componentWillMount(){
		//禁止重复提交
		this.isSubmit = true;
	}

  componentDidMount(){

  }

	//输入框得焦
	handleFocus = (e) => {
		e.stopPropagation();
		this.setState({isErr:false});
	}

	//获取公钥
	getPublicKey = (data) => {
		const { form,dispatch } = this.props;
		let { username,password } = data;
		dispatch({
			type:'user/fetchGetPublicKey',
			callback:(res) => {
				let { success } = res;
				if(success){
					let { data:{publicKey} } = res.data;
					this.handleRequest({userName:username,userPwd:encryption(publicKey,password),publicKey});
				}else{
					form.resetFields(['password']);
				}
			}
		})
	}

	//请求
	handleRequest = (payload) => {
		const { form,dispatch } = this.props;
		dispatch({
			type:'login/fetchLogin',
			payload,
    		callback:(res) => {
    			let { success } = res;
    			if(success){
    				let { data=null } = res.data;
    				this.setStore(data);
    				this.setUserData(data);
    			}else{
      				this.setState({isErr:true},() => {
						this.isSubmit = true;
						form.resetFields(['password']);
					})
    			}
    		}
		})
	}

	//登录
	handleLogin = (e) => {
		e.preventDefault();
		if(!this.isSubmit){
			return
		}
		const { dispatch,form } = this.props;
		form.validateFields(['username','password'],(err, fieldsValue) => {
			if(err){
    			console.log('err')
    		}
			this.getPublicKey(fieldsValue);
		})
	}

	//设置个人信息
	setUserData = (data) => {
		if(data != null){
			const { dispatch } = this.props;
			let { user={} } = data;
			let { loginStatus=0 } = user;
			dispatch({
				type:'user/setUserData',
				payload:user
			});
			setTimeout(() => {
				if(loginStatus){
          router.replace('/common/product');
				}else{
          router.replace('/user/reset');
				}
			})
		}
	}

	//本地存储
	setStore = (data) => {
		if(data != null){
			let { token='',user={} } = data;
			let { id=0 } = user;
			let userData = {
				data:{
					token,
					userId:id,
					loginSuccess:0     //0未选择产品  1以选择  2重新选择
				},
				time:new Date().getTime()
			}
			Store.set('userData', JSON.stringify(userData));
		}
	}

	render(){
		const { isErr } = this.state;
		const { form:{getFieldDecorator} } = this.props;
		return(
			<div className={styles.loginBox}>
				<div className={styles.title}>
					智能服务平台
				</div>
				<div className={styles.FormBox}>
					<div className={styles.loginTxt}>登录</div>
					<Form id='loginForm' layout="inline" style={{width:220}} onSubmit={this.handleLogin}>
						<Form.Item>
					        {getFieldDecorator('username')(
					            <Input
					            	className={styles.fromImput}
					              	prefix={<Icon type="user" style={{ fontSize:'16px',color: '#fff' }} />}
					              	placeholder="账号"
					              	onFocus={this.handleFocus}
					            />,
					        )}
					    </Form.Item>
				        <Form.Item style={{marginTop: 25}}>
				          	{getFieldDecorator('password')(
				            	<Input
				            		className={styles.fromImput}
				              		prefix={<Icon type="lock" style={{ fontSize:'16px',color: '#fff' }} />}
				              		type="password"
				              		placeholder="密码"
				              		onFocus={this.handleFocus}
				            	/>,
				          	)}
				        </Form.Item>
				        <Form.Item style={{marginTop: 30}}>
				        	{
				        		isErr ? (
				        			<span className={styles.loginErr}>账号或密码错误</span>
				        		) : ''
				        	}
							<Button className={styles.loginBtn} htmlType="submit">登录</Button>
							<span className={styles.rorgetPass}>若忘记密码,请联系管理员重置密码</span>
						</Form.Item>
					</Form>
				</div>
			</div>
		)
	}
}

export default Login;
