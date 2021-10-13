import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import ProductModule from './components/ProductModule';
import DatasModule from './components/DatasModule';
import styles from './LinkedDatas.less';

@connect(({
	linkedDatas
}) => ({
	linkedDatas
}))

class LinkedDatas extends Component{
	
	state = {
		products:[],
		moduleType:'product'
	}
	
	//切换状�
	changeType = (moduleType,products) => {
		let changeObj = {moduleType};
		if(moduleType === 'datas'){
			changeObj.products = products;
		}
		this.setState(changeObj);
	}
	
	render(){
		const { moduleType,products } = this.state;
		return(
			<div style={{width:'100%',height:'100%'}}>
				<ProductModule 
					moduleType={moduleType} 
					changeType={this.changeType}
				/>
				{
					moduleType === 'datas' ? (
						<DatasModule 
							products={products}
							changeType={this.changeType}
						/>
					) : ''
				}
			</div>
		)
	}
}

export default LinkedDatas;
