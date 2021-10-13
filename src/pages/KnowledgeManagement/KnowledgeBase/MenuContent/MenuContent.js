import React,{ Component } from 'react';
import { connect } from 'dva';
import { Cascader  } from 'antd';
import router from 'umi/router';
import styles from './MenuContent.less';

@connect(({
	global,
	knowledgeBase,
	single,
	multiple
}) => ({
	global,
	knowledgeBase,
	single,
	multiple
}))

class KnowledgeBaseMenu extends Component{
	
	state = {
		openKeys:[],
		selectedKeys:['-1'],
		menuH:'100%'
	}
	
	componentDidMount(){
		this.timer = null;
		this.getList();
	}
	
	//获取菜单
	getList = () => {
		const { global:{productionId} } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetCatagoryTree',
			payload:{productionId},
			callback:() => {
				this.getTreeByPermission();
			}
		})
	}

	//获取新增、编辑、审核类目组
	getTreeByPermission = () => {
		const { global:{productionId} } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetTreeByPermission',
			payload:{productionId}
		})
	}
	
	//路由切换
	handleChangeType = (currentType) => {
		const { type='single',dispatch } = this.props;
		if(type !== currentType){
			router.replace(`/knowledgeManagement/knowledgeBase/${currentType}`);
		}
	}
	
	//切换类目
	handleChangeProduct = (value=[], selectedOptions) => {
		const _len = value.length;
		let productKey = undefined;
		if(_len){
			const _index = _len - 1;
			productKey = value[_index];
		}
		this.setProductKey(productKey,value);
	}
	
  //关闭流程图
  closeProcedure = () => {
  	const { dispatch } = this.props;
  	dispatch({
  		type:'multiple/setDetailState',
  		payload:{setDetailState:false}
  	})
  }
  
	//保存菜单key
	setProductKey = (productKey,productValue) => {
		const { dispatch,type } = this.props;
		clearTimeout(this.timer);
		dispatch({
			type:'knowledgeBase/setProductKey',
			payload:{productKey,productValue}
		})
		if(type === 'single'){
			dispatch({
				type:'single/clearSingle'
			})	
		}else{
			dispatch({
				type:'multiple/clearMultiple'
			})	
			this.closeProcedure();
		}
	}
	
	render(){
		const { type='single',knowledgeBase } = this.props;
		const { productList=[],productValue=[] } = knowledgeBase;
		return(
			<div className={styles.knowledgeBaseMenu}>
				<div className={styles.btnBox}>
					<div 
						className={type === 'single' ? styles.clicked : ''}
						onClick={() => this.handleChangeType('single')}
					>
						单轮
					</div>
					<div 
						className={type === 'multiple' ? styles.clicked : ''}
						onClick={() => this.handleChangeType('multiple')}
					>
						多轮
					</div>
				</div>
				<div className={styles.functionBox}>
					<div className={styles.once}>
						业务分类 :
						<Cascader 
							options={productList} 
							onChange={this.handleChangeProduct} 
							defaultValue={productValue}
							value={productValue}
							expandTrigger="hover"
							changeOnSelect
							fieldNames={{label: 'categoryName',value: 'categoryCode',children: 'children'}}
							placeholder="请选择业务分类" 
							style={{marginLeft:10}}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default KnowledgeBaseMenu;