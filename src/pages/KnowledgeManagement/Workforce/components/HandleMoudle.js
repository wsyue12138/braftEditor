import React,{ Component } from 'react';
import { 
	Form,
	message
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

@Form.create()

class WorkforceHandle extends Component{
	
	state = {
		isRequired:false
	}
	
	componentDidMount(){
		this.props.onRef(this);
		this.isSubmit = true;
	}
	
	//保存请求
	handleRequest = (payload,callback) => {
		const { dispatch,workforce:{onceData} } = this.props;
		const { id } = onceData;
		dispatch({
			type:'workforce/fetchHandleWorkforce',
			payload:{...payload,id},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('操作成功');
					callback();
				}else{
					message.error('操作失败');
				}
				this.isSubmit = true;
			}
		})	
	}
	
	//保存
	handleSave = (callback) => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { selectedOnce } = this.state;
		const { form:{validateFields} } = this.props;
		validateFields(['resultStatus','handleDescription'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			this.handleRequest(values,callback);
	    });
	}
	
	//处理说明
	validatorContent = (rule, val='', callback) => {
		const { isRequired } = this.state;
		if(isRequired){
			if(val.length && val.length <= 300){
	    		callback();
	    	}else{
	    		this.isSubmit = true;
	    		callback('要求0-300个字符');
	    	}
		}else{
			if(val.length <= 300){
	    		callback();
	    	}else{
	    		this.isSubmit = true;
	    		callback('要求最多300个字符');
	    	}
		}
    	
	}
	
	//结果选择
	handleChange = (val) => {
		let isRequired = false;
		if(val === 2){
			isRequired = true;
		}
		this.setState({isRequired});
	}
	
	render(){
		const { isRequired } = this.state;
		const { form:{getFieldDecorator},workforce:{onceData} } = this.props;
		const { itemName='',content='' } = onceData;
		const formList = [
			{
				type:'Input',
				label:'事项名称',
				id:'itemName',
				options:{initialValue:itemName},
				domOptions:{disabled:true}
			},
			{
				type:'TextArea',
				label:'申请内容',
				id:'content',
				options:{initialValue:content},
				domOptions:{rows:6,placeholder:"最多输入300个字",disabled:true}
			},
			{
				type:'Select',
				label:'工单处理结果',
				id:'resultStatus',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
		        			message:'请选择处理结果'
		        		}
		        	]
		        },
				domOptions:{placeholder:"请选择处理结果",onChange:this.handleChange},
				optionList:[{value:1,label:'已处理'},{value:2,label:'无法处理'}],
				valueName:'value',
				labelName:'label'
			},
			{
				type:'TextArea',
				label:'处理说明: (无法处理必填)',
				id:'handleDescription',
				options:{
		        	rules: [
		        		{ 
		        			required: isRequired,
		        			validator:this.validatorContent
		        		}
		        	]
		        },
				domOptions:{rows:8,placeholder:"最多输入300个字"}
			}
		]
		return(
			<div className={styles.formContent}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default WorkforceHandle;