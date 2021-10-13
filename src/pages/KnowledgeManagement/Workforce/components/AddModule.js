import React,{ Component } from 'react';
import { 
	Form,
	message
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

@Form.create()

class WorkforceAdd extends Component{
	
	state = {
		selectedOnce:{}
	}
	
	componentDidMount(){
		this.props.onRef(this);
		this.getCatagoryTree();
		this.isSubmit = true;
	}
	
	//获取菜单
	getCatagoryTree = () => {
		const { global:{productionId} } = this.props;
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetCatagoryTree',
			payload:{productionId}
		})
	}
	
	//保存请求
	handleRequest = (payload,callback) => {
		const { dispatch } = this.props;
		dispatch({
			type:'workforce/fetchCreateWorkforce',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('添加成功');
					callback();
				}else{
					message.error('添加失败');
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
		validateFields(['itemName','content'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			const { catagoryId,categoryName } = selectedOnce;
			let datas = {...values,catagoryId,categoryName};
			this.handleRequest(datas,callback);
	    });
	}
	
	//事项名称
	validatorName = (rule, val='', callback) => {
		var reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
    	if(val && val.length <= 15 && reg.test(val)){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('要求中、英、数 最多15个字符');
    	}
	}
	
	//申请内容
	validatorContent = (rule, val='', callback) => {
    	if(val.length && val.length <= 300){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('要求最多300个字符');
    	}
	}
	
	//业务分类
	displayRender = (label,selectedOptions) => {
		return label[label.length - 1];
	}
	
	//业务分类选择
	handleServiceTypeChange = (val,selectedOptions=[]) => {
		let selectedOnce = {};
		if(selectedOptions.length){
			let onceData = selectedOptions[selectedOptions.length - 1];
			let { categoryCode,categoryName } = onceData;
			selectedOnce = {catagoryId:categoryCode,categoryName};
		}
		
		this.setState({selectedOnce});
	}
	
	render(){
		const { knowledgeBase:{serviceList} } = this.props;
		
		const formList = [
			{
				type:'Input',
				label:'事项名称',
				id:'itemName',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.validatorName
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入事项名称"}
			},
			{
				type:'Cascader',
				label:'业务分类',
				id:'serviceType',
				domOptions:{
					placeholder:'请选择业务分类', 
	        		allowClear:true,
				    options:serviceList,
				    expandTrigger:"click",
				    fieldNames:{ label:'categoryName', value:'categoryCode', children:'children' },
				    displayRender:this.displayRender,
				    onChange:this.handleServiceTypeChange
				}
			},
			{
				type:'TextArea',
				label:'申请内容',
				id:'content',
				options:{
		        	rules: [
		        		{ 
		        			required: true,
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

export default WorkforceAdd;
