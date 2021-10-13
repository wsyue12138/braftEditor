import React,{ Component,Fragment } from 'react';
import { 
	Row,
	Col,
	Icon,
	Form,
	Input,
	message
} from 'antd';
import styles from './Dimension.less';

@Form.create()

class StatisticalDimension extends Component{
	
	state = {
		dimensionList:[{}]
	}
	
	componentWillMount(){
		this.categoryFromList = [];
	}
	
	componentDidMount(){
		const { onDimensionRef } = this.props;
		onDimensionRef(this);
		this.isSubmit = true;
		this.saveList = [];
		this.setInit();
	}
	
	//初始化
	setInit = () => {
		const { productManagement } = this.props;
		const { dimensionList } = productManagement;
		const list = JSON.parse(JSON.stringify(dimensionList));
		dimensionList.map((item,index) => {
			const { dimensionFields=[] } = item;
			if(dimensionFields.length){
				list[index].dimensionFields.push({});
			}
		})
		list.push({});
		this.setState({dimensionList:list});
	}
	
	//保存
	handleSave = (callback) => {
		const { dimensionList } = this.state;
		const { form:{resetFields,validateFields},dispatch,setDimension } = this.props;
		validateFields([...this.categoryFromList],(err, values) => {
			if(!err){
				this.isSubmit = true;
				this.saveList = [];
				resetFields(this.categoryFromList);
				this.outerLayerValidator();
				if(this.isSubmit){
					setDimension(this.saveList,dimensionList);
					callback();
				}
			}
		})
	}
	
	//外层校验
	outerLayerValidator = () => {
		const { dimensionList } = this.state;
		const { form:{setFields} } = this.props;
		const newList = [...dimensionList];
		let isNext = true;
		newList.map((item,index) => {
			const { dimensionName='',dimensionKey='',dimensionFields=[] } = item;
			const nameVal = dimensionName.trim();
			const dimensionVal = dimensionKey.trim();
			if(nameVal.length === 0 && dimensionVal.length === 0){
				isNext = false;
				if(dimensionFields.length){   //有子集没有维度和统计量
					const isHasVal = dimensionFields.some((item) => {
						const { dimensionFieldName='',dimensionCode='' } = item;
						const fieldVal = dimensionFieldName.trim();
						const codeVal = dimensionCode.trim();
						return fieldVal.length > 0 || codeVal.length > 0;
					});
					if(isHasVal){
						this.isSubmit = false;
						setFields({
							['dimension_' + index]: {
			                	value: '',
			                	errors: [new Error('请输入对应统计量')],
			              	},
			              	['name_' + index]: {
			                	value: '',
			                	errors: [new Error('请输入维度名称')],
			              	}
			           	});
					}
				}
			}else{
				if(nameVal.length === 0){  //没有维度
					isNext = false;
					this.isSubmit = false;
					setFields({
						['name_' + index]: {
		                	value: '',
		                	errors: [new Error('请输入维度名称')],
		              	}
		            });
				}else{
					const isNameRepeat = dimensionList.some((item,i) => {     //维度重复
						return i !== index && item.dimensionName == dimensionName;
					})
					const isKeyRepeat = dimensionList.some((item,i) => {     //统计量重复
						return i !== index && item.dimensionKey == dimensionKey;
					})
					if(isNameRepeat){
						isNext = false;
						this.isSubmit = false;
						setFields({
							['name_' + index]: {
			                	value: dimensionName,
			                	errors: [new Error('维度名称不可重复')],
			              	}
			            });
					}
					if(isKeyRepeat){
						isNext = false;
						this.isSubmit = false;
						setFields({
							['dimension_' + index]: {
			                	value: dimensionKey,
			                	errors: [new Error('应统计量不可重复')],
			              	}
			            });
					}
				}
				if(dimensionVal.length === 0){    //没有统计量
					isNext = false;
					this.isSubmit = false;
					setFields({
						['dimension_' + index]: {
		                	value: '',
		                	errors: [new Error('请输入对应统计量')],
		              	}
		           	});
				}
				if(nameVal.length !== 0 && dimensionVal.length !== 0){
					if(dimensionFields.length){   						//无子集
						const isHasVal = dimensionFields.some((item) => {
							const { dimensionFieldName='',dimensionCode='' } = item;
							const fieldVal = dimensionFieldName.trim();
							const codeVal = dimensionCode.trim();
							return fieldVal.length > 0 || codeVal.length > 0;
						});
						if(!isHasVal){
							isNext = false;
							this.isSubmit = false;
							setFields({
								['field_' + index + '0']: {
				                	value: '',
				                	errors: [new Error('请输入维度字段')],
					            },
					            ['code_' + index + '0']: {
					                value: '',
					                errors: [new Error('请输入字段编码')],
					            }
				            });
						}
					}else{
						isNext = false;
						this.isSubmit = false;
						setFields({
			              	['name_' + index]: {
			                	value: dimensionName,
			                	errors: [new Error('请添加字段')],
			              	}
			            });
					}
				}
			}
			if(isNext){
				let obj = {
					dimensionName,
					dimensionKey
				}
				this.saveList.push(obj);
				if(dimensionFields.length){
					this.innerLayerValidator(dimensionFields,index);
				}
			}
		})
	}
	
	//内层校验
	innerLayerValidator = (list,_index) => {
		const { form:{setFields} } = this.props;
		list.map((item,index) => {
			const { dimensionFieldName='',dimensionCode='' } = item;
			const fieldVal = dimensionFieldName.trim();
			const codeVal = dimensionCode.trim();
			if(fieldVal.length !== 0 || codeVal.length !== 0){
				if(fieldVal.length === 0){		//没有字段
					this.isSubmit = false;
					setFields({
						['field_' + _index + index]: {
		                	value: '',
		                	errors: [new Error('请输入维度字段')],
		              	}
		            });
				}else
				if(codeVal.length === 0){		//没有编码
					this.isSubmit = false;
					setFields({
						['code_' + _index + index]: {
		                	value: '',
		                	errors: [new Error('请输入字段编码')],
		              	}
		            });
				}else{
					const isFieldRepeat = list.some((item,i) => {   //字段重复
						return i !== index && item.dimensionFieldName == dimensionFieldName;
					})
					const isCodeRepeat = list.some((item,i) => {   //字段重复
						return i !== index && item.dimensionCode == dimensionCode;
					})
					if(isFieldRepeat || isCodeRepeat){
						this.isSubmit = false;
						if(isFieldRepeat){
							setFields({
								['field_' + _index + index]: {
				                	value: dimensionFieldName,
				                	errors: [new Error('同维度下维度字段不可重复')],
				              	}
				            });
						}
						if(isCodeRepeat){
							setFields({
								['code_' + _index + index]: {
				                	value: dimensionCode,
				                	errors: [new Error('同维度下字段编码不可重复')],
				              	}
				            });
						}
					}else{
						const newList = [...this.saveList];
						const _len = newList.length - 1;
						const obj = newList[_len];
						const { dimensionFields=[] } = obj;
						dimensionFields.push({dimensionFieldName,dimensionCode});
						this.saveList[_len].dimensionFields = dimensionFields;
					}
				}
			}
		})
	}
	
	//字数判断
	validator = (rule, val='', callback) => {
		const value = val.trim();
		if(value.length <= 15){
    		callback();
    	}else{
    		callback('最多15字符');
    	}
	}
	
	//统计量验证
	dimensionValidator = (rule, val='', callback) => {
		const value = val.trim();
		const reg = /[^a-zA-Z]/g;
		if(value.length <= 15 && !reg.test(value)){
    		callback();
    	}else{
    		callback('要求英文最大15位');
    	}
	}
	
	//新增
	handleAdd = (type,selfIndex,parnetIndex) => {
		console.log(type)
		console.log(selfIndex)
		console.log(parnetIndex)
		const { form:{resetFields} } = this.props;
		const { dimensionList } = this.state;
		let newList = JSON.parse(JSON.stringify(dimensionList));;
		let _len;
		if(type === 1){
			_len = dimensionList.length - 1;
			if(_len === selfIndex){
				newList.push({});
			}
		}else{
			const obj = newList[parnetIndex];
			let { dimensionFields=[] } = obj;
			dimensionFields.push({});
			newList[parnetIndex].dimensionFields = dimensionFields;
		}
		resetFields([...this.categoryFromList]);
		this.setState({dimensionList:newList});
	}
	
	//删除
	handleRemoveInput = (type,selfIndex,parnetIndex) => {
		const { form:{resetFields} } = this.props;
		const { dimensionList=[] } = this.state;
		let newList = JSON.parse(JSON.stringify(dimensionList));;
		if(type === 1){
			newList.splice(selfIndex,1);
		}else{
			const obj = newList[parnetIndex];
			let { dimensionFields=[] } = obj;
			dimensionFields.splice(selfIndex,1);
			newList[parnetIndex].dimensionFields = dimensionFields;
		}
		resetFields([...this.categoryFromList]);
		this.setState({dimensionList:newList});
	}
	
	//内容改变
	handleChange = (e,type,selfIndex,parnetIndex) => {
		const { form:{getFieldValue,setFields},productManagement } = this.props;
		const { dimensionList=[] } = this.state;
		let newList = JSON.parse(JSON.stringify(dimensionList));
		const val = e.target.value;
		if(type === 'dimensionName' || type === 'dimensionKey'){
			newList[selfIndex][type] = val;
		}else{
			const obj = newList[parnetIndex];
			let { dimensionFields=[] } = obj;
			dimensionFields[selfIndex][type] = val;
			newList[parnetIndex].dimensionFields = dimensionFields;
		}
		this.setState({dimensionList:newList});
	}
	
	//删除按钮
	deleteModule = (type,selfIndex,parnetIndex) => {
		return(
        	<Icon type="close" style={{cursor:'pointer',color:'#f5222d'}} onClick={() => this.handleRemoveInput(type,selfIndex,parnetIndex)} />
        )
	}
	
	render(){
		const { dimensionList } = this.state;
		const { form:{getFieldDecorator} } = this.props;
		const len = dimensionList.length;
		return(
			<div className={styles.dimensionBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
						{
							dimensionList.map((item,index) => {
								const { dimensionName='',dimensionKey='',dimensionFields=[] } = item;
								const _len = dimensionFields.length;
								const suffix = index === len - 1 ? <span /> : this.deleteModule(1,index);
								this.categoryFromList.push('name_' + index);
								this.categoryFromList.push('dimension_' + index);
								return(
									<div className={styles.onceBox} key={index}>
										<Row className={styles.parent} style={{margin:0,paddingTop:index ? 13 : 0}}>
											<Col span={11} style={{paddingRight:10}}>
												<Form.Item label="维度名称">
													{getFieldDecorator('name_' + index,{
														initialValue:dimensionName,
														rules: [{validator:this.validator}]
													})(
											        	<Input 
											        		placeholder="请输入维度名称"
											        		onChange={(e) => this.handleChange(e,'dimensionName',index)}
											        	/>
											        )}
												</Form.Item>
											</Col>
											<Col span={1}>
												<div className={styles.lineBox}><span></span></div>
											</Col>
											<Col span={12} style={{paddingLeft:10}}>
												<Form.Item label="对应统计量">
													{getFieldDecorator('dimension_' + index,{
														initialValue:dimensionKey,
														rules: [{validator:this.dimensionValidator}]
													})(
											        	<Input 
											        		suffix={suffix} 
											        		placeholder="请输入对应统计量"
											        		onFocus={() => this.handleAdd(1,index)}
											        		onChange={(e) => this.handleChange(e,'dimensionKey',index)}
											        	/>
											        )}
												</Form.Item>
											</Col>
										</Row>
										{
											dimensionFields.map((val,i) => {
												const { dimensionFieldName='',dimensionCode } = val;
												const childrenSuffix = i === _len - 1 ? <span /> : this.deleteModule(2,i,index);
												this.categoryFromList.push('field_' + index + i);
												this.categoryFromList.push('code_' + index + i);
												const fieldLabel = (
													<div>
														<span className={styles.prefixColor}>※</span>
														字段 :
													</div>
												)
												const codeLabel = (
													<div>
														<span className={styles.prefixColor}>※</span>
														编码 :
													</div>
												)
												return(
													<Row key={i} className={styles.children} style={{margin:0,paddingTop:13}}>
														<Col span={11} className={styles.item} style={{paddingRight:10}}>
															<Form.Item label={fieldLabel}>
																{getFieldDecorator('field_' + index + i,{
																	initialValue:dimensionFieldName,
																	rules: [{validator:this.validator}]
																})(
														        	<Input 
														        		placeholder="请输入维度字段"
														        		onChange={(e) => this.handleChange(e,'dimensionFieldName',i,index)}
														        	/>
														        )}
															</Form.Item>
														</Col>
														<Col span={1}>
															
														</Col>
														<Col span={12} className={styles.item} style={{paddingLeft:10}}>
															<Form.Item label={codeLabel}>
																{getFieldDecorator('code_' + index + i,{
																	initialValue:dimensionCode,
																	rules: [{validator:this.validator}]
																})(
														        	<Input 
														        		suffix={childrenSuffix} 
														        		placeholder="请输入字段编码"
											        					onChange={(e) => this.handleChange(e,'dimensionCode',i,index)}
														        	/>
														        )}
															</Form.Item>
														</Col>
													</Row>
												)
											})
										}
										<div>
											<span className={styles.addBtn} onClick={() => this.handleAdd(2,-1,index)} >新增字段 +</span>
										</div>
									</div>	
								)
							})
						}
					
				</Form>
			</div>
		)
	}
}

export default StatisticalDimension;