import React,{ Component } from 'react';
import {
	message
} from 'antd';
import KnowledgeAdd from '@components/KnowledgeAdd';

class SingleAdd extends Component{
	
	componentDidMount(){
		this.props.onRef(this);
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'single/clearOnceData'
		})		
	}

	//地区组件绑定
	onAddRef = (ref) => {
		this.onAddRef = ref;
	}

	//新增
	handleRequest = (data,callback) => {
		const { global:{productionId},dispatch,getList } = this.props;
		dispatch({
			type:'single/fetchSingleAdd',
			payload:{...data,productionId},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success(`添加成功`);
					this.handleClose();
					getList(true);
				}else{
					message.error(`添加失败`);
				}
				callback && callback();
			}
		})	
	}

	handleSave = () => {
		this.onAddRef.handleSave();
	}
	
	//关闭添加弹窗
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:false}
		})	
	}
	
	render(){
		const { single } = this.props;
		const { customFieldName } = single;
		return <KnowledgeAdd
			onAddRef={this.onAddRef}
			handleRequest={this.handleRequest}
			initQuestion={undefined}
			customFieldName={customFieldName}
			drawerName='知识库管理'
			{...this.props}
		/>
	}
	
}
export default SingleAdd;