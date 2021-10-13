import React,{ Component } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	Button,
	Icon,
	Layout,
	List,
	Pagination
} from 'antd';
import router from 'umi/router';
import Store from 'store';
import { getUserData } from '@utils/utils';
import noProducts from '@assets/noProducts.png';
import styles from './ProductSelection.less';

const { Content } = Layout;
const FormItem = Form.Item;

@connect(({
	product,
	login,
	user
}) => ({
	product,
	login,
	user
}))

@Form.create()

class ProductContent extends Component{

	state = {
		loading:false,
		productName:'',
		bmAppId:'',
		pageNum:1,
		pageSize:20
	}

	componentWillMount(){
		this.isSearch = true;
		this.firstReady = true;
	}

	componentDidMount(){
		const { dispatch } = this.props;
		this.userData = getUserData();
		//this.getUserInfo();
		this.getList();
	}

	//获取列表
	getList = (data) => {
		const { dispatch,user } = this.props;
		const { productName='',bmAppId='',pageNum=1,pageSize=25 } = this.state;
		this.setState({loading:true});
		dispatch({
			type:'product/fetchGetProductions',
			payload:{productName,bmAppId,pageNum,pageSize},
			callback:(res) => {
				const { success } = res;
				if(success){
					const { userdata={} } = user;
					const { roleId=0 } = userdata;
					const { data=[] } = res.data;
					if(data.length === 1 && this.firstReady && roleId === 0){
						this.handleSelectOnce(data[0]);
					}else{
						this.setState({loading:false});
					}
				}
				this.firstReady = false;
				this.isSearch = true;
			}
		})
	}

	//获取个人信息
	getUserInfo = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'user/fetchGetUserInfo',
			callback:(res) => {

			}
		})
	}

	//搜索
	handleSearch = (e) => {
		if(!this.isSearch){
			return
		}
		this.isSearch = false;
		e.preventDefault();
		const { form } = this.props;
		form.validateFields(['productName','bmAppId'],(err, values) => {
			if(err){return false}
			const { productName='',bmAppId='' } = values;
			this.setState({productName,bmAppId,pageNum:1},() => {
				this.getList();
			});
		})
	}

	//选择登录
	handleSelectOnce = (data) => {
		const { dispatch } = this.props;
		let { productName,bmAppId,id } = data;
		this.userData.data.loginSuccess = 1;
		this.userData.data.productName = productName;
		this.userData.data.bmAppId = bmAppId;
		this.userData.data.productionId = id;
		Store.set('userData', JSON.stringify(this.userData));
		router.push('/');
	}

	//搜索部分
	searchModule(){
		const { form:{getFieldDecorator},user,product } = this.props;
		const { userdata={} } = user;
		const { roleId=0 } = userdata;
		return(
			<div className={styles.searchModule}>
				<Form layout="inline">
					<Form.Item style={{marginRight:20}}>
						{getFieldDecorator('productName')(
            				<Input
              					prefix={<Icon type="edit" style={{color:'#C5C5C5'}} />}
              					placeholder="产品名称"
              					allowClear
              					style={{width:223}}
            				/>,
          				)}
					</Form.Item>
					<Form.Item style={{marginRight:20}}>
						{getFieldDecorator('bmAppId')(
            				<Input
              					placeholder="appid"
              					allowClear
              					style={{width:223}}
            				/>,
          				)}
					</Form.Item>
					<Form.Item>
						<Button
							type="primary"
							style={{marginRight:15}}
							onClick={this.handleSearch}
						>
							查询
							<Icon type="search" />
						</Button>
					</Form.Item>
				</Form>
			</div>
		)
	}

	//列表部分
	listModule(){
		const { loading } = this.state;
		const { product } = this.props;
		const { productList={} } = product;
		const { list=[] } = productList;
		const { data={} } = getUserData();
		const { bmAppId } = data;
		const productOnce = (item) => {
			const isClicked = item.bmAppId === bmAppId;
			const boxStyles = isClicked ? styles.clickedOnce + ' ' + styles.productOnce : styles.productOnce;
			return(
				<div
					className={boxStyles}
					key={item.bmAppId}
					onClick={() => {this.handleSelectOnce(item)}}
				>
					<div className={styles.itemContnet}>
						<div className={styles.onceName} title={item.productName}>
							<span className={styles.productName}>
								{
									isClicked ? (
										<p className={styles.sign}>
											<span></span>
										</p>
									) : ''
								}
								{item.productName}
							</span>
						</div>
						<p className={styles.onceId} title={`${item.bmAppId}`}>{`appid: ${item.bmAppId}`}</p>
					</div>
				</div>
			)
		}

		const emptyText = (
			<div className={styles.noProducts}>
				<img src={noProducts} />
				<p>产品列表为空</p>
			</div>
		)

		return(
			<div className={styles.listModule}>
				<List
					grid={{
      					gutter: 24,
      					xs: 4,
      					sm: 4,
      					md: 4,
      					lg: 4,
      					xl: 4,
      					xxl: 4,
    				}}
					locale={{emptyText}}
				    dataSource={list}
				    loading={loading}
				    split={false}
				    renderItem={item => (
				    	<List.Item>
				        	{productOnce(item)}
				      	</List.Item>
				    )}
				/>
			</div>
		)
	}

	//分页部分
	pageModule(){
		const { pageNum,pageSize } = this.state;
		const { product } = this.props;
		const { productList={} } = product;
		const { total=0 } = productList;
		const pagination = {
      		defaultCurrent: 1,
      		defaultPageSize: 20,
      		showQuickJumper: true,
      		hideOnSinglePage: true,
      		current: pageNum,
      		pageSize: pageSize,
      		onChange: (current, pageSize) => {
      			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			});
      		},
      		total
    	};
		return(
			<div className={styles.pageModule}>
				<Pagination size="small" {...pagination} />
			</div>
		)
	}

	render(){
		return(
			<div className={styles.content}>
				<div className={styles.contentList}>
					<div className={styles.productTop}>
						{this.searchModule()}
						{this.listModule()}
					</div>
					<div className={styles.productBottom}>
						{this.pageModule()}
					</div>
				</div>
			</div>
		)
	}
}

export default ProductContent;
