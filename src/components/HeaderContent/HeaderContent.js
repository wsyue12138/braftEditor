import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { Layout,Dropdown,Menu,Icon,Drawer,Button,message,Modal } from 'antd';
import Store from 'store';
import router from 'umi/router';
import ReconnectingWebSocket from "reconnecting-websocket";
import WebsocketModule from '@components/WebsocketModule';
import DrawerMount from '../DrawerMount';
import UserInformation from '../UserInformation';
import ChangePassword from '../ChangePassword';
import UnreadMessage from '../UnreadMessage';

import { getUserData } from '@utils/utils';
import styles from './HeaderContent.less';


const { Header } = Layout;

@connect(({
	global,
	login,
	user,
	news,
	single,
	multiple,
	socketetModel
}) => ({
	global,
	login,
	user,
	news,
	single,
	multiple,
	socketetModel
}))

class HeaderContent extends Component{

	state = {
		_ws:null,
		visible:false,
		drawerType:'',
		drawerTitle:'',
		iconState:'down'
	}

	// componentWillMount(){
	// 	this.timer = null;
	// 	this.childModule = null;
	// }

	componentDidMount(){
		const { type='index' } = this.props;
		this.timer = null;
		this.takeOff = false;
		if(type === 'index'){
			clearInterval(this.timer);
			this.getNoticeCount();
			this.setCurrentProduct();
			this.timer = setInterval(() => {
				this.getNoticeCount();
			},120000);
		}
	}

	componentWillUnmount(){
		clearTimeout(this.timer);
	}

	//绑定组件
	onRef = (ref) => {
		this.childModule = ref;
	}

	//设置产品信息
	setCurrentProduct = () => {
		const { dispatch } = this.props;
		const {	data={} } = getUserData();
		const { productName='',bmAppId='',productionId='' } = data;
		dispatch({
			type:'global/setCurrentProduct',
			payload:{appid:bmAppId,productName,productionId}
		})
	}

	//获取消息
	getNoticeCount = () => {
		const { dispatch } = this.props;
		const {	data={} } = getUserData();
		const { productionId='' } = data;
		dispatch({
			type:'news/fetchGetUnreadedNoticeCount',
			payload:{productionId},
			callback:(res) => {

			}
		})
	}

	//抽屉
	onMenuClick = ({key}) => {
		let isDrawer = false;
		let drawerTitle = '';
		switch (key){
			case 'information':				//用户信息
				isDrawer = true;
				drawerTitle = '用户信息';
				break;
			case 'changePass':				//修改密码
				isDrawer = true;
				drawerTitle = '修改密码';
				break;
			case 'unread':					//未读消息
				isDrawer = true;
				drawerTitle = '消息通知';
				break;
			case 'examine':  				//待审核信息
				break;
			case 'handle':					//待处理信息
				break;
			case 'workOrder':				//工单信息
				break;
			default:
				break;
		}
		if(isDrawer){
			this.setState({
				iconState:'down',
				visible:true,
				drawerType:key,
				drawerTitle
			});
		}
  	}

	//退出提醒
	handleloginOutMessage = () => {
		Modal.confirm({
    		title: '是否确认退出登录',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.handleloginOut();
    		}
  		});
	}

	//退出登录
	handleloginOut = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'login/fetchLogout',
			callback:(res) => {
				let { success } = res;
				if(success){
					router.replace('/user/login');
					Store.remove('userData');
				}else{
					message.error(res.message);
				}
			}
		})
	}

	//用户部分
	userContent(){
		const { iconState } = this.state;
		const { user } = this.props;
		const { userdata={} } = user;
		const { personName='',userName='' } = userdata;
		const handleDropdownChange = (state) => {
			this.setState({iconState:state ? 'up' : 'down'});
		}
		const menu = (
      		<Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        		<Menu.Item key="information">用户信息</Menu.Item>
        		<Menu.Item key="changePass">修改密码</Menu.Item>
      		</Menu>
    	);
		return(
			<div className={styles['header-function']}>
				<div className={styles.userLabel}>
					<Icon type="user" className={styles.userLabelContent} />
				</div>
		        <Dropdown
		        	overlayClassName={styles.headerDropdown}
		        	overlay={menu}
		        	placement="bottomCenter"
		        	onVisibleChange={handleDropdownChange}
		        >
		            <div className={styles['user-name']}>
	                	{personName || userName}
	                	<Icon type={iconState} style={{fontSize:10,marginLeft:8}} />
	            	</div>
		        </Dropdown>
			</div>
		)
	}

	//消息部分
	newsContent(){
		let examine = 34;
		let handle = 34;
		let workOrder = 34;
		const { news } = this.props;
		const { newsCount:{unreadedNoticeCount} } = news;
		return(
			<div className={styles.headerOnce}>
				<div className={styles.newsSign}>
					<Icon type="mail" className={styles.newsSignContent} />
				</div>
				<div className={styles.newsContent} onClick={() => this.onMenuClick({key:'unread'})} title='消息通知'>
					{
						unreadedNoticeCount != 0 ? (
							<span className={styles.newsNum}>
								{unreadedNoticeCount > 99 ? '99+' : unreadedNoticeCount}
							</span>
						) : ''
					}
					消息
				</div>
			</div>
		)
	}

	//产品部分
	productContent(){
		const { global } = this.props;
		const { productName='',appid='' } = global;
		//选择产品
		const handleChangeProduct = () => {
			const { dispatch } = this.props;
			router.replace('/common/product');
		}
		return(
			<Fragment>
				{
					productName === '' && appid === '' ? (
						<Button onClick={handleChangeProduct}>选择产品</Button>
					) : (
						<div className={styles.productContent}>
							<div>
								<span className={styles.label}>
									当前产品 :
								</span>
								<span className={styles.product}>
									{productName}
								</span>
							</div>
							<div style={{paddingLeft:30}}>
								<span className={styles.label}>
									appid :
								</span>
								<span className={styles.product}>
									{appid}
								</span>
							</div>
							<div style={{paddingLeft:30}}>
								<span
									className={styles.changeProduct}
									onClick={handleChangeProduct}
									style={{color:'#E99113'}}
								>
									返回主页
								</span>
							</div>
						</div>
					)
				}
			</Fragment>
		)
	}

	//抽屉
	drawerContent(){
		const { drawerTitle,drawerType,visible } = this.state;
		//关闭
		const handleClose = () => {
			this.setState({visible:false});
		}
		//确定
		const handleOk = () => {
			this.childModule.handleSave();
		}
		let content = '',isOk=true,okText='确定',drawerWidth=633;
		if(drawerType === 'information'){
			content = (<UserInformation {...this.props} />);
			isOk = false;
		}else
		if(drawerType === 'changePass'){
			content = (<ChangePassword onRef={this.onRef} />);
			okText = '保存';
		}else
		if(drawerType === 'unread'){
			content = (<UnreadMessage handleClose={handleClose} />);
			isOk = false;
			drawerWidth = 1000;
		}
		let drawerOptions = {
			content,
			isOk,
			okText,
			onOk:handleOk,
			onCancel:handleClose
		}
		let drawerProps = {
			title:drawerTitle,
	        width:drawerWidth,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:handleClose,
	        visible:visible
		}

		return(
			<Fragment>
				<DrawerMount
					drawerProps={drawerProps}
					{...drawerOptions}
				/>
			</Fragment>
		)
	}

	render(){
		const { type='index',user } = this.props;
		const { userdata={} } = user;
		const { belongCompanyName='' } = userdata;
		return(
			<div className={styles['header-box']}>
				<Header className={styles['basic-header']}>
              	<WebsocketModule headerType={type} />
			        <div className={styles['header-home-link']}>
			            <span>{belongCompanyName}</span>
			        </div>
			        <div className={styles.headerOnce} style={{padding:0}}>
						<div
							className={styles.loginOut}
							onClick={this.handleloginOutMessage}
						>
							退出
						</div>
					</div>
					<div className={styles.headerOnce}>
						{this.userContent()}
					</div>
			        {
			        	type === 'index' ? (
			        		<Fragment>
								{this.newsContent()}
								<div className={styles.headerOnce}>
									{this.productContent()}
								</div>
							</Fragment>
			        	) : ''
			        }
			        {this.drawerContent()}
			    </Header>
		    </div>
		)
	}
}

export default HeaderContent;
