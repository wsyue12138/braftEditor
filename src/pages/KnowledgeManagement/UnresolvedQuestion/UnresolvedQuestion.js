import React,{ Component } from 'react';
import { connect } from 'dva';
import DrawerMount from '@components/DrawerMount';
import SearchModule from './components/SearchModule';
import TableModule from './components/TableModule';
import AddModule from './components/AddModule';
import SimilarModule from './components/SimilarModule';

@connect(({
	global,
	single,
	knowledgeBase,
	unresolvedQuestion,
	region
}) => ({
	global,
	single,
	knowledgeBase,
	unresolvedQuestion,
	region
}))

class UnresolvedQuestion extends Component{
	
	state = {
		loading:false,
		searchData:{},
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.firstReload = true;
		this.getList();
	}
	
	//获取数据
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { dispatch,global:{appid} } = this.props;
		this.setState({loading:true});
		dispatch({
			type:'unresolvedQuestion/fetchGetUnresolvedQestion',
			payload:{...searchData,pageNum,pageSize,appid},
			callback:(res) => {
				const { success } = res;
				if(success){
					this.setState({loading:false},() => {
						if(this.firstReload){
							this.getTreeByPermission();
							this.getLabelName();
							this.firstReload = false;
						}
					});
				}
			}
		})
	}
	
	//获取菜单
	// getCatagoryTree = () => {
	// 	const { global:{productionId} } = this.props;
	// 	const { dispatch } = this.props;
	// 	dispatch({
	// 		type:'knowledgeBase/fetchGetCatagoryTree',
	// 		payload:{productionId}
	// 	})
	// }
	//获取新增、编辑、审核类目组
	getTreeByPermission = () => {
		const { global:{productionId} } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetTreeByPermission',
			payload:{productionId}
		})
	}
	
	//获取补充说明label
	getLabelName = () => {
		const { dispatch } = this.props;
		const { global:{productionId} } = this.props;
		dispatch({
			type:'single/fetchGetProductions',
			payload:{id:productionId}
		})	
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//搜索
	handleSearch = (searchData={}) => {
		this.setState({searchData,pageNum:1},() => {this.getList()});
	}
	
	//翻页
	handleChangePage = (pageNum,pageSize) => {
		this.setState({pageNum,pageSize},() => {this.getList()});
	}
	
	//关闭抽屉
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'unresolvedQuestion/setVisible',
			payload:{visible:false},
		})	
	}
	
	//抽屉确定
	handleAdd = () => {
		this.childModule.handleSave();
	}
	
	//抽屉
	drawerModule(){
		const { unresolvedQuestion:{drawerType,visible} } = this.props;
		let drawerOptions,title;
		if(drawerType === 'add'){
			drawerOptions = {
				content:(<AddModule onRef={this.onRef} {...this.props} getList={this.getList} />),
				onCancel:this.handleClose,
				okText:'申请新增',
				onOk:this.handleAdd
			}
			title = '未解决问题学习/新增';
		}else
		if(drawerType === 'similar'){
			drawerOptions = {
				content:(<SimilarModule {...this.props} getList={this.getList} type='unresolvedQuestion' />),
				onCancel:this.handleClose,
				isOk:false
			}
			title = '未解决问题学习/关联相似';
		}else{
			drawerOptions = {
				content:'',
				onCancel:() => {},
				okText:'',
				onOk:() => {}
			}
			title = '';
		}
		drawerOptions.size = drawerType === 'similar' ? 'large' : 'x-medium';
		let drawerProps = {
			title,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount  
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}
	
	render(){
		const { loading,pageNum,pageSize,searchData } = this.state;
		return(
			<div style={{width:'100%'}}>
				<SearchModule {...this.props} handleSearch={this.handleSearch} searchData={searchData} />
				<TableModule 
					{...this.props} 
					loading={loading} 
					pageNum={pageNum}
					pageSize={pageSize}
					getList={this.getList} 
					changePage={this.handleChangePage}
				/>
				{this.drawerModule()}
			</div>
		)
	}
}

export default UnresolvedQuestion;