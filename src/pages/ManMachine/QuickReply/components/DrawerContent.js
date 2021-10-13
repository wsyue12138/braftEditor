import React,{ Component,Fragment } from 'react';
import { 
	Icon,
	message
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

export default class QuickReplyDrawer extends Component{
	
	state = {
		quickReplyList:['']
	}
	
	componentDidMount(){
		const { type,onRef } = this.props;
		this.isSubmit = true;
		onRef(this);
		if(type === 'edit'){
			this.setInit();
		}
	}
	
	//请求
	handleRequest = (data,callback) => {
		const { dispatch,type,global,onceData } = this.props;
		const { productionId='' } = global;
		const { id } = onceData;
		let name,urlName,payload;
		if(type === 'add'){
			name = '新增';
			urlName = 'fetchAddQuickReply';
			payload = {...data,productionId};
		}else{
			name = '编辑';
			urlName = 'fetchUpdateQuickReply';
			payload = {...data,id};
		}
		dispatch({
            type: `quickReply/${urlName}`,
            payload,
            callback:(res) => {
            	const { success,code } = res;
            	if(success){
            		message.success(`${name}成功`);
            		callback();
            	}else{
            		if(code === 11018){
            			message.error('关键词不可重复！');
            		}else{
            			message.error(`${name}失败!`);
            		}
            		this.isSubmit = true;
            	}
            }
        })    
	}
	
	//提交
	handleOk = (callback) => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { quickReplyList } = this.state;
		const { form:{validateFields,setFields} } = this.props;
		const formList = this.setFormList(quickReplyList);
		const field = [...formList,'keyword'];
		validateFields(field,(err, values) => {
			if(!err){
				const { keyword } = values;
				const contents = quickReplyList.filter((item) => item.trim() != '');
				if(contents.length){
					this.handleRequest({keyword,contents},callback);
				}else{
					setFields({
						'quickReply0': {
		                	value: '',
		                	errors: [new Error('请输入快捷回复')],
		              	}
		            });
		            this.isSubmit = true;
				}
			}else{
				this.isSubmit = true;
			}
		})
	}
	
	//编辑初始化
	setInit = () => {
		const { onceData } = this.props;
		const { contentVos=[] } = onceData;
		const quickReplyList = contentVos.reduce((prev, cur) => {
		    cur.content.trim() !== '' && prev.push(cur.content);
		    return prev;
		},[]);
		if(quickReplyList.length){
			this.setState({quickReplyList});
		}
	}
	
	//关键词校验
	keywordValidator = (rule, val='', callback) => {
		let _len = val.length;
		if(val && _len <= 20 && _len > 0){
    		callback();
    	}else{
    		this.isSubmit = true;
    		callback('关键词要求1-20个字');
    	}
	}
	
	//文字改变
	handleChange = (e,index) => {
		const { quickReplyList } = this.state;
		const val = e.target.value;
		let list = JSON.parse(JSON.stringify(quickReplyList));
		list.splice(index,1,val);
		this.setState({quickReplyList:list});
	}
	
	//设置快捷回复表单id数组
	setFormList = (data) => {
		const list = data.reduce(function (prev, cur,index) {
		    prev.push('quickReply' + index);
		    return prev;
		},[]);
		return list;
	}
	
	//添加
	handleAdd = () => {
		const { quickReplyList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(quickReplyList));
		resetFields(this.setFormList(list));
		list.push('');
		this.setState({quickReplyList:list});
	}
	
	//删除
	handleDelete = (index) => {
		const { quickReplyList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(quickReplyList));
		resetFields(this.setFormList(list));
		list.splice(index,1);
		this.setState({quickReplyList:list});
	}
	
	render(){
		const { quickReplyList } = this.state;
		const { type,onceData } = this.props;
		const { keyword } = onceData;
		const len = quickReplyList.length;
		let formList = [
			{
				type:'Input',
				label:'关键词',
				id:'keyword',
				options:{
		        	initialValue:keyword,
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.keywordValidator
		        		}	
		        	]
		        },
				domOptions:{placeholder:"请输入关键词"}
			},
			{
				type:'Dom',
				label:(
					<span>
						快捷回复 
						<span style={{color:'#bfbfbf',fontSize:12,paddingLeft:8}}>
							(同一关键词快捷回复最多可添加五条)
						</span>
					</span>
				),
				id:'title',
				onceStyle:{margin:0},
				options:{
		        	rules:[{required: true}]
		        },
				custom:(<span></span>)
			}
		]
		//拼接快捷回复
		quickReplyList.map((item,index) => {
			const id = 'quickReply' + index;
			const isDelete = index === 0 && len === 1;
			let obj = {
				type:'TextArea',
				label:'',
				id,
				isDelete:!isDelete,
				deleteFun:() => this.handleDelete(index),
				options:{
		        	initialValue:item,
		        	rules: [
		        		{ 
		        			min:1,
		        			max:100,
		        			message:'快捷回复最多100个字'
		        		}	
		        	]
		        },
				domOptions:{rows:4,placeholder:"请输入快捷回复",onChange:(e) => this.handleChange(e,index)}
			}
			if(index === (len - 1)){
				obj.onceStyle = {margin:0}
			}
			formList.push(obj);
		})
		//新增按钮
		if(len < 5){
			formList.push({
				type:'Dom',
				label:'',
				id:'add',
				onceStyle:{margin:0},
				custom:(<span className={styles.add} onClick={this.handleAdd}>新增快捷回复+</span>)
			})
		}
		return(
			<div className={styles.quickReplyDrawer}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}
