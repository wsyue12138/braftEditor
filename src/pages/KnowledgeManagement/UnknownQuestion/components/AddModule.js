import React,{ Component } from 'react';
import {
	message
} from 'antd';
import KnowledgeAdd from '@components/KnowledgeAdd';

class UnknownQuestionAdd extends Component{

	componentDidMount(){
		this.props.onRef(this);
	}

	//地区组件绑定
	onAddRef = (ref) => {
		this.onAddRef = ref;
	}
	
	//新增
	handleRequest = (data,callback) => {
		const { dispatch,global:{productionId},unknownQuestion:{onceData},getList } = this.props;
		const { id,unQuestion } = onceData;
		dispatch({
			type:'unknownQuestion/fetchCreateKnowledge',
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
			type:'unknownQuestion/setVisible',
			payload:{visible:false},
		})	
	}

	render(){
		const { unknownQuestion:{onceData},single } = this.props;
		const { customFieldName } = single;
		const { unQuestion='' } = onceData;
		return <KnowledgeAdd
			onAddRef={this.onAddRef}
			handleRequest={this.handleRequest}
			initQuestion={unQuestion}
			customFieldName={customFieldName}
			drawerName='未知问题学习'
			{...this.props}
		/>
	}
}

export default UnknownQuestionAdd;