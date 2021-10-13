import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Button,
	Icon,
	Layout,
	List,
	Pagination,
	message
} from 'antd';
import noProducts from '@assets/noProducts.png';
import styles from './ProductModule.less';

@connect(({
	linkedDatas
}) => ({
	linkedDatas
}))

class LinkedDatasProduct extends Component{
	
	state = {
		loading:false,
		pageNum:1,
		pageSize:20,
		products:[]
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取产品列表
	getList = () => {
		const { pageNum,pageSize } = this.state;
		const { dispatch,user } = this.props;
		this.setState({loading:true});
		dispatch({
			type:'linkedDatas/fetchGetProductions',
			payload:{listType:2,pageNum,pageSize},
			callback:(res) => {
				this.setState({loading:false});
			}
		})
	}
	
	//选中
	handleSelectOnce = (item) => {
		const { products } = this.state;
		const { bmAppId } = item;
		const newList = JSON.parse(JSON.stringify(products));
		const _index = products.findIndex((val) => val.bmAppId === bmAppId);
		if(_index !== -1){
			newList.splice(_index,1);
		}else{
			newList.push(item);
		}
		this.setState({products:newList});
	}
	
	//保存
	handleSave = () => {
		const { products } = this.state;
		const { changeType } = this.props;
		if(products.length){
			changeType('datas',products);
		}else{
			message.warning('请选择你想关联统计数据的产品!');
		}
	}
	
	//列表部分
	listModule(){
		const { products,loading } = this.state;
		const { linkedDatas } = this.props;
		const { productData={} } = linkedDatas;
		const { list=[] } = productData;
		const productOnce = (item) => {
			const { productName='',bmAppId='' } = item;
			const isClicked = products.findIndex((val) => val.bmAppId === bmAppId);;
			const boxStyles = isClicked !== -1 ? styles.clickedOnce + ' ' + styles.productOnce : styles.productOnce;
			return(
				<div 
					className={boxStyles} 
					key={bmAppId} 
					onClick={() => {this.handleSelectOnce(item)}}
				>
					<div className={styles.itemContnet}>
						<div className={styles.onceName} title={productName}>
							<span className={styles.productName}>
								{
									isClicked !== -1 ? (
										<p className={styles.sign}>
											<span></span>
										</p>
									) : ''
								}
								{item.productName}
							</span>
						</div>
						<p className={styles.onceId} title={`${bmAppId}`}>{`appid: ${bmAppId}`}</p>
					</div>
					<div className={styles.clickSig}>
						<Icon type="check" />
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
		const { linkedDatas } = this.props;
		const { productData={} } = linkedDatas;
		const { total=0 } = productData;
		const pagination = {
      		defaultCurrent: 1,
      		defaultPageSize: pageSize,
      		showQuickJumper: true,
      		hideOnSinglePage: true,
      		current: pageNum,
      		pageSize,
      		onChange: (current, pageSize) => {
      			this.setState({pageNum:current},() => {
      				this.getList();
      			})
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
		const { moduleType='product' } = this.props;
		return(
			<div 
				className={styles.productBox} 
				style={{display:moduleType === 'product' ? '' : 'none'}}
			>
				<div className={styles.productContent}>
					<div className={styles.title}>选择你想关联数据统计的产品</div>
					{this.listModule()}
					<div className={styles.productBottom}>
						{this.pageModule()}
					</div>
				</div>
				<div className={styles.btnBox}>
					<Button type="primary" onClick={this.handleSave}>确定</Button>
				</div>
			</div>
		)
	}
}
 
export default LinkedDatasProduct; 
 