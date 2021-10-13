import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Icon,
	message
} from 'antd';
import { lineBreak } from '@utils/utils';
import DrawerMount from '@components/DrawerMount';
import FormModule from '@components/FormModule';
import Region from '@components/Region';
import RelatedQuestions from '@components/RelatedQuestions';
import styles from './style.less';

const { TextArea } = Input;

/**
 * author：wsyue
 * onAddRef:绑定组件
 * handleRequest：保存后操作
 * initQuestion:初始化问句
 * customFieldName:自定义
 * drawerName:弹窗名字
 * **/


@Form.create()

class KnowledgeAdd extends Component{
	
	state = {
		similarList:[''],
		answerList:[{}],
		serviceType:undefined,
		selectedOnce:{},
		visible:false,
		similarOnce:undefined,
		regionVal:undefined
	}
	
	componentDidMount(){
		this.props.onAddRef(this);
		this.isSubmit = true;
	}

	//地区组件绑定
	onRegionRef = (ref) => {
		this.childRegionModule = ref;
	}

	//初始设置
	setInitVal = () => {
		const { similarOnce={} } = this.state;
		const { serviceType=undefined,knowledgeSimilarVos=[] } = similarOnce;
		let serviceArr = undefined;
		let similarList = [''];
		let selectedOnce = {};
		if(serviceType !== undefined){
			let obj = this.setServiceType(serviceType);
			selectedOnce = {serviceType:obj.type,serviceTypeName:obj.name};
			serviceArr = obj.newArr;
		}
		if(knowledgeSimilarVos.length){
			similarList = this.setKnowledgeSimilar(knowledgeSimilarVos,1);
		}
		this.setState({serviceType:serviceArr,similarList,selectedOnce});
	}

	//设置业务分类
	setServiceType = (serviceType) => {
		const { knowledgeBase:{serviceList,operationTree} } = this.props;
		const list = operationTree['05010600'] ? operationTree['05010600'] : [];
		let newArr,type,name;
		list.map((item,index) => {
			const { categoryCode,children=[],categoryName='' } = item;
			if(serviceType === categoryCode){
				newArr = [categoryCode];
				type = categoryCode;
				name = categoryName;
			}else{
				if(children.length){
					children.map((i,_index) => {
						if(serviceType === i.categoryCode){
							newArr = [categoryCode,i.categoryCode];
							type = i.categoryCode;
							name = i.categoryName;
						}else{
							if(i.children && i.children.length){
								i.children.map((l,l_index) => {
									if(serviceType === l.categoryCode){
										newArr = [categoryCode,i.categoryCode,l.categoryCode];
										type = l.categoryCode;
										name = l.categoryName;
									}
								})
							}
						}
					})
				}
			}
			
		})
		let obj = {
			newArr,
			type,
			name
		}
		if(!newArr){
			message.warning('所选知识无操作权限，请确认');
		}
		return obj;
	}

	//设置相似问句
	setKnowledgeSimilar = (data,type=0) => {    //type = 1,关联相似问句处理
		let newArr = [];
		data.map((item,index) => {
			const { question='' } = item;
			newArr.push(question);
		})
		if(!type){
			newArr.push('');
		}
		return newArr;
	}
	
	//保存
	handleSave = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { selectedOnce,similarList,regionVal,similarOnce } = this.state;
		const { form:{validateFields},handleRequest } = this.props;
		validateFields(['question','region','serviceType','linkUrl','customField'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			if(this.setRegionRepeat()){
				const { regionCode,regionFullName,regionShortName } = regionVal;
				delete values.region;
				values.regionCode = regionCode;
				values.regionFullName = regionFullName;
				values.regionName = regionShortName;
			}else{
				this.isSubmit = true;
	            return false;
			}
			const childAnswers = this.setAnswerList();
			if(!childAnswers.length || !regionVal){
	            this.isSubmit = true;
	            return false;
			}else{
				values.childAnswers = childAnswers;
			}
			if(similarOnce){
                const { question='',serviceType,serviceTypeName,id } = similarOnce;
				values.question = question;
				values.serviceType = serviceType;
                values.serviceTypeName = serviceTypeName;
                values.groupKnowledgeId = id;
			}else{
				const { serviceType,serviceTypeName } = selectedOnce;
				values.serviceType = serviceType;
				values.serviceTypeName = serviceTypeName;
			}
            values.similarQuestion = similarList;
			handleRequest(values,() => this.isSubmit = true);
		})
	}

	//判断地区重复
	setRegionRepeat = () => {
		const { form:{setFields} } = this.props;
		const { regionVal={},similarOnce={} } = this.state;
		const { regionCode } = regionVal;
		const regionDisabled = this.setRegioArr(similarOnce);
		let isReturn = true;
		if(regionDisabled.length){
			const _index = regionDisabled.findIndex((item,index) => {
				return item.regionCode === regionCode;
			})
			if(_index !== -1){
				const { value=[] } = regionVal;
				setFields({
					region: {
						value,
	                	errors: [new Error('地区不可重复')],
	              	}
				});
				isReturn = false;
			}
		}  
		return isReturn;
	}
	
	//删除
	handleRemoveInput = (_index) => {
		const { similarList } = this.state;
		let newList = [...similarList];
		newList.splice(_index,1);
		this.setState({similarList:newList});
	}
	
	//得焦
	handleFocus = (_index) => {
		const { similarList } = this.state;
		let newList = [...similarList];
		let _len = similarList.length;
		if((_len - 1) === _index){
			newList.push('');
		}
		this.setState({similarList:newList});
	}
	
	//相似问句
	handleChange = (e,_index) => {
		const { similarList } = this.state;
		const val = e.target.value;
		let newList = [...similarList];
		newList[_index] = val;
		this.setState({similarList:newList});
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
			selectedOnce = {serviceType:categoryCode,serviceTypeName:categoryName};
		}
		
		this.setState({selectedOnce});
	}
	
	//设置答案表单id数组
	setFormList = (data) => {
		const list = data.reduce(function (prev, cur,index) {
		    prev.push('answer_' + index);
		    return prev;
		},[]);
		return list;
	}
	
	//答案改变
	handleAnswerChange = (e,index) => {
		const { answerList } = this.state;
		const answer = e.target.value;
		let list = JSON.parse(JSON.stringify(answerList));
		let obj = answerList[index];
		obj.answer = answer;
		list.splice(index,1,obj);
		this.setState({answerList:list});
	}
	
	//答案判断
	setAnswerList = () => {
		const { form:{setFields} } = this.props;
		const { answerList } = this.state;
		let childAnswers = [];
		let isReturn = true;
		answerList.map((item,index) => {
			const { answer='',id } = item;
			if(answer.trim() != ''){
				let obj = {id,answer:lineBreak(answer)};
				childAnswers.push(obj);
			}else{
				isReturn = false;
				setFields({
					['answer_' + index]: {
	                	value: '',
	                	errors: [new Error('答案不可为空')],
	              	}
	            });
			}
		})
		return isReturn ? childAnswers : [];
	}
	
	//添加答案
	handleAdd = () => {
		const { answerList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(answerList));
		resetFields(this.setFormList(list));
		list.push({});
		this.setState({answerList:list});
	}
	
	//删除答案
	handleDelete = (index) => {
		const { answerList } = this.state;
		const { form:{resetFields} } = this.props;
		let list = JSON.parse(JSON.stringify(answerList));
		list.splice(index,1);
		resetFields(this.setFormList(list));
		this.setState({answerList:list});
	}

	//选择地区
	handleRegionChange = (regionVal) => {
		const { form:{setFieldsValue} } = this.props;
		this.setState({regionVal},() => {
			//setFieldsValue({region:regionVal})
		});
	}

	//构造地址数组
	setRegioArr = (similarOnce) => {
		const { childKnowledges=[],regionCode,regionName='全国' } = similarOnce;
		let arr = [];
		if(childKnowledges.length){
			childKnowledges.map((item,index) => {
				arr.push({regionCode:item.regionCode,regionName:item.regionName});
			})
		}else{
			regionCode && arr.push({regionCode,regionName});
		}
		return arr;
	}

	//地区提示
	setRegionTip = (regionDisabled) => {
		let txt = '已有地区: ';
		regionDisabled.map((item,index) => {
			txt += index ? '、' + item.regionName : item.regionName;
		})
		return(
			<div className={styles.regionContent}>
				<Icon type="exclamation-circle" theme='filled' className={styles._tip} />
				<div className={styles._content} title={txt}>
					{`( ${txt} )`}
				</div>
			</div>
		)
	}
	
	//删除关联问句
	handleRemoveQuestion = () => { 
		const { form:{resetFields} } = this.props;
		this.setState({similarOnce:undefined,similarList:[''],serviceType:undefined,selectedOnce:{}},() => {
			resetFields(['question','serviceType','region']);
			this.childRegionModule.clearValue();
		});
	}

	//打开关联问句
	handleSimilarOpen = () => {
		this.setState({visible:true});
	}

	//关闭关联问句
	handleSimilarClose = (type=0,similarOnce) => {
		const { form:{resetFields} } = this.props;
		if(type){
			this.setState({visible:false,similarOnce},() => {
				resetFields(['question','serviceType','region']);
				this.childRegionModule.clearValue();
				this.setInitVal();
			});
		}else{
			this.setState({visible:false});
		}
	}

	//表单
	formModule(){
		const { similarList,similarOnce={},answerList,serviceType } = this.state;
		const { form:{getFieldDecorator},customFieldName='',knowledgeBase:{serviceList,operationTree},initQuestion='' } = this.props;
		const { question='' } = similarOnce;
		const answerLen = answerList.length;
		const similarLen = Object.keys(similarOnce).length;
		const questionSuffix = similarLen ? <Icon type="close" style={{cursor:'pointer',color:'#f5222d'}} onClick={() => this.handleRemoveQuestion()} /> : <span />;
		const isDisabled = similarLen ? true : false;
		const regionDisabled = this.setRegioArr(similarOnce);
		const formList = [
			{
				type:'Input',
				label:'标准问句',
				id:'question',
				onceStyle:{marginBottom:similarLen ? 18 : 0},
				options:{
		        	initialValue:similarLen ? question : initQuestion,
		        	rules: [
		        		{ 
		        			required: true,
		        			message:'请输入标准问句'
		        		}
		        	]
		        },
				domOptions:{
					placeholder:"请输入标准问句",
					disabled:isDisabled,
					suffix:questionSuffix,
					title:similarLen ? question : ''
				}
			},
			{
				type:'Dom',
				label:'',
				id:'addQuestion',
				onceStyle:{margin:0},
				custom:(
					<span className={styles.add} onClick={this.handleSimilarOpen}>
						关联已有问句
						<Icon type="swap"/>
					</span>
				)
			},
			{
				type:'Dom',
				label:'相似问句',
				id:'similarQuestion',
				onceStyle:{marginBottom:0},
				custom:(
					<span></span>
				)
			},
			{
				type:'Dom',
				label:'',
				id:'list',
				onceStyle:{marginBottom:0},
				custom:(
					<Fragment>
						{
							similarList.map((item,index) => {
					    		let _len = similarList.length - 1;
					    		const suffix = index === _len || similarLen ?  <span /> : <Icon type="close" style={{cursor:'pointer',color:'#f5222d'}} onClick={() => this.handleRemoveInput(index)} />;
					    		return(
					    			 <Input 
					    			 	key={index}
					    			 	value={item}
										placeholder='输入新的相似问句' 
										disabled={isDisabled}
						        		style={{marginBottom:18}}
						        		suffix={suffix} 
						        		onFocus={() => this.handleFocus(index)}
						        		onChange={(e) => this.handleChange(e,index)}
						        	/>
					    		)
					    	})
						}	
					</Fragment>
				)
			},
			{
				type:'Dom',
				label:'地区',
				id:'region',
				options:{rules: [{ required: true,message:'请选择地区' }]},
				onceOther:regionDisabled && regionDisabled.length ? this.setRegionTip(regionDisabled) : '',
				custom:(
					<Region 
						id='region'
						initStatus='add' 
						onRegionRef={this.onRegionRef}
						onChange={this.handleRegionChange}
						{...this.props} 
					/>
				)
			},
			{
				type:'Cascader',
				label:'业务分类',
				id:'serviceType',
				options:{
					initialValue:serviceType,
		        	rules: [
		        		{ 
		        			required: true,
		        			message:'请选择业务分类'
		        		}
		        	]
		        },
				domOptions:{
					placeholder:'请选择业务分类', 
					disabled:isDisabled,
				    options:operationTree['05010800'] ? operationTree['05010800'] : [],
				    expandTrigger:"click",
				    fieldNames:{ label:'categoryName', value:'categoryCode', children:'children' },
				    displayRender:this.displayRender,
				    onChange:this.handleServiceTypeChange
				}
			},
			{
				type:'Dom',
				label:'答案',
				id:'answerTitle',
				options:{rules: [{ required: true }]},
				onceStyle:{marginBottom:0},
				custom:(
					<span></span>
				)
			},
			{
				type:'Other',
				id:'answerList',
				custom:(
					<Fragment>
						{
							answerList.map((item,index) => {
								const { answer='',id='',answerStatus=0 } = item;
								//是否为一条答案
				    			const isDelete = index === 0 && answerLen === 1;
								return(
									<div className={styles.answerOnceBox} key={index} >
					    				{
					    					!isDelete ? (
					    						<Icon type="close" className={styles.deleteAnswer} onClick={() => this.handleDelete(index)} />
					    					) : ''
					    				}
					    				<Form.Item label='' style={{marginBottom:index === (answerLen - 1) && answerLen !== 5 ? 0 : 18}} >
									        {getFieldDecorator('answer_' + index,{
									        	initialValue:answer.replace(/\\n/g, " \n"),
									        	rules: [
									        		{ 
									        			min:1
									        		}
									        	]
									        })(
									        	<TextArea 
									        		rows={6} 
									        		placeholder="请输入答案" 
									        		style={{resize: 'none'}} 
									        		onChange={(e) => this.handleAnswerChange(e,index)}
									        	/>
									        )}
									    </Form.Item>
					    			</div>
								)
							})
						}
						{
					    	answerLen < 5 ? (
					    		<Form.Item label='' style={{margin:0}}>
							        {getFieldDecorator('addBtn')(
							        	<span className={styles.add} onClick={this.handleAdd}>新增答案+</span>
							        )}
						    	</Form.Item>
					    	) : ''
					    }
	    			</Fragment>
				)
			},
			{
				type:'TextArea',
				label:'链接',
				id:'linkUrl',
				domOptions:{rows:2,placeholder:"请输入链接"}
			},
			{
				type:'TextArea',
				label:customFieldName,
				id:'customField',
				domOptions:{rows:4,placeholder:"请输入内容"}
			}
		]
		similarLen && formList.splice(1,1);
		return <FormModule {...this.props} formList={formList} />
	}

	//抽屉
	drawerModule(){
        const { visible } = this.state;
        const { drawerName='' } = this.props;
		let drawerOptions={
			size:'large',
			content:(<RelatedQuestions onRef={this.onRef} {...this.props} handleSimilarClose={this.handleSimilarClose} />),
			onCancel:this.handleSimilarClose,
		}
		let drawerProps = {
			title:`${drawerName}/新增/关联问句`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleSimilarClose,
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
		
		return(
			<div className={styles.addBox}>
				{this.formModule()}
				{this.drawerModule()}
			</div>
		)
	}
}

export default KnowledgeAdd;