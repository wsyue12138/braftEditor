import React,{ Component } from 'react';
import {
	message
} from 'antd';
import KnowledgeAdd from '@components/KnowledgeAdd';

class UnresolvedQuestionAdd extends Component{
	
	componentDidMount(){
		this.props.onRef(this);
		this.isSubmit = true;
	}

	//地区组件绑定
	onAddRef = (ref) => {
		this.onAddRef = ref;
	}
	
	//新增/编辑请求
	handleRequest = (data,callback) => {
		const { dispatch,global:{productionId},unresolvedQuestion:{onceData},getList } = this.props;
		const { id,unQuestion } = onceData;
		dispatch({
			type:'unresolvedQuestion/fetchCreateKnowledge',
			payload:{...data,productionId,unQuestionid:id,inQuestion:unQuestion},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('新增成功');
					getList();
					this.handleClose();
				}else{
					message.error('新增失败');
				}
				callback && callback();
			}
		})	
	}

	handleSave = () => {
		this.onAddRef.handleSave();
	}
	
	//关闭弹窗
	handleClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'unresolvedQuestion/setVisible',
			payload:{visible:false},
		})	
	}
	
	render(){
		const { unresolvedQuestion:{onceData},single } = this.props;
		const { customFieldName } = single;
		const { unQuestion='' } = onceData;
		return <KnowledgeAdd
			onAddRef={this.onAddRef}
			handleRequest={this.handleRequest}
			initQuestion={unQuestion}
			customFieldName={customFieldName}
			drawerName='未解决问题学习'
			{...this.props}
		/>
	}
}

export default UnresolvedQuestionAdd;