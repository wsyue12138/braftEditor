import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import {
	Form,
	Input,
	message
} from 'antd';
import FormModule from '@components/FormModule';
import DrawerMount from '@components/DrawerMount';
import styles from './style.less';

const { TextArea } = Input;

@Form.create()

class SingleHand extends Component{

	state = {
		similarList:[''],
		visible:false
	}

	componentDidMount(){
		this.props.onRef(this);
		this.isSubmit = true;
		this.getKnowledgeProject();
		this.setInitVal();
	}

	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'single/clearOnceData'
		})
	}

	//获取知识库项目
	getKnowledgeProject = () => {
		const { dispatch,global:{productionId} } = this.props;
		dispatch({
			type:'knowledgeBase/fetchGetKnowledgeProject',
			payload:{productionId},
		})
	}

	//处理请求
	handleRequest = (result,data) => {      //result 1 通过  2 不通过
		const { global:{productionId},dispatch,form,single:{onceData},getList } = this.props;
		const { id } = onceData;
		let payload = {...data,id,result,productionId};
		dispatch({
			type:'single/fetchTesHandleKnowledge',
			payload,
			callback:(res) => {
				let { success,code } = res;
				if(success){
					message.success('操作成功');
					getList();
					this.handleClose();
					this.handleBoxClose();
				}else{
					if(result === 1 && code === 11018){
						form.setFields({
				          	knowledgeCode: {
				            	value: data,
				            	errors: [new Error('编号异常')],
				          	},
				        });
					}else{
						message.error('操作失败');
					}

				}
				this.isSubmit = true;
			}
		})
	}

	//通过保存
	handleSave = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { dispatch,form:{validateFields} } = this.props;
		validateFields(['knowledgeCode','knowledgeProjectId'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			this.handleRequest(1,values);
		})
	}

	//保存原因
	handleSaveReason = () => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		const { dispatch,form:{validateFields} } = this.props;
		validateFields(['handleDescription'],(err, values) => {
			if(err){
				this.isSubmit = true;
				return false;
			}
			this.handleRequest(2,values);
		})
	}

	//关闭弹窗
	handleBoxClose = () => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:false}
		})
	}

	//初始设置
	setInitVal = () => {
		const { single:{onceData} } = this.props;
		const { knowledgeSimilarVos=[] } = onceData;
		this.setState({similarList:this.setKnowledgeSimilar(knowledgeSimilarVos)});
	}

	//设置相似问句
	setKnowledgeSimilar = (data) => {
		let newArr = [];
		data.map((item,index) => {
			const { question='' } = item;
			newArr.push(question);
		})
		return newArr;
	}

	//无法处理
	handleFailed = () => {
		this.setState({visible:true});
	}

	//关闭原因抽屉
	handleClose = () => {
		this.setState({visible:false});
	}

	//原因抽屉
	drawerContent(){
		const { visible } = this.state;
		const { form:{getFieldDecorator} } = this.props;
		const content = (
			<div className={styles.reasonBox}>
				<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
					<Form.Item label="无法处理说明">
				        {getFieldDecorator('handleDescription',{
				        	rules: [
				        		{
				        			required: true,
				        			message:'请选输入内容'
				        		}
				        	]
				        })(
				        	<TextArea rows={6} style={{resize: 'none'}} placeholder="请输入内容" />
				        )}
				    </Form.Item>
				</Form>
			</div>
		)
		let drawerOptions = {
			content,
			onCancel:this.handleClose,
			okText:'保存',
			onOk:this.handleSaveReason,
			size:'small'
		}
		let drawerProps = {
			title:'知识库管理/处理/无法处理说明',
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount drawerProps={drawerProps} {...drawerOptions} />
		)
	}

	render(){
		const { similarList } = this.state;
		const {
			form:{getFieldDecorator},
			single:{majorList,singleDrawerType,onceData},
			knowledgeBase
		} = this.props;
		const { knowledgeProject=[] } = knowledgeBase;
		const {
			operateType,
			customField='',
			knowledgeCode='',
			knowledgeProjectId,
			linkUrl='',
			serviceTypeName='',
			question='',
			knowledgeAnswerVos=[],
			regionName='全国'
		} = onceData;
		let formList = [
			{
				type:'Input',
				label:'编号',
				id:'knowledgeCode',
				options:{
					initialValue:operateType === 2 ? knowledgeCode : undefined,      //编辑的处理
		        	rules: [
		        		{
		        			required: operateType !== 2,
		        			max:64,
		        			whitespace:true,
		        			message:'编号异常'
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入编号",disabled:operateType === 2}
			},
			{
				type:'Select',
				label:'所属知识库项目',
				id:'knowledgeProjectId',
				options:{
					initialValue:operateType === 2 ? knowledgeProjectId : undefined,
		        	rules: [
		        		{
		        			required: operateType !== 2,
		        			message:'请选择知识库项目'
		        		}
		        	]
		        },
				domOptions:{placeholder:"请选择知识库项目",disabled:operateType === 2},
				optionList:knowledgeProject,
				valueName:'id',
				labelName:'knowledgeProjectName'
			},
			{
				type:'Input',
				label:'标准问句',
				id:'question',
				options:{
		        	initialValue:question
		        },
				domOptions:{placeholder:"请输入标准问句",disabled:true}
			},
			{
				type:'Dom',
				label:similarList.length ? '相似问句' : '',
				id:'similar',
				onceStyle:{marginBottom:0},
				custom:(<span></span>)
			}
		]
		similarList.map((item,index) => {
    		const obj = {
				type:'Input',
				label:'',
				id:'similar' + index,
				options:{
		        	initialValue:item
		        },
		        domOptions:{placeholder:"输入新的相似问句",disabled:true,title:item}
			}
    		formList.push(obj);
		})
		const regionObj = {
			type:'Input',
			label:'地区',
			id:'region',
			options:{
	        	initialValue:regionName ? regionName : '--'
	        },
			domOptions:{placeholder:"请输入地址",disabled:true}
		}
		formList.push(regionObj);
		const serviceTypeObj = {
			type:'Input',
			label:'业务分类',
			id:'major',
			options:{
	        	initialValue:serviceTypeName
	        },
			domOptions:{placeholder:"请输入业务分类",disabled:true}
		}
		formList.push(serviceTypeObj);
		knowledgeAnswerVos.map((item,index) => {
    		const { answer='',id } = item;
    		const labelTxt = index === 0 ? '答案' : '';
    		const obj = {
				type:'TextArea',
				label:labelTxt,
				id:'answer_' + index,
				options:{
		        	initialValue:answer.replace(/\\n/g, " \n")
		        },
				domOptions:{rows:knowledgeAnswerVos.length > 1 ? 4 : 6,placeholder:"请输入答案",disabled:true}
			}
    		formList.push(obj);
    	})
		const otherArr = [
			{
				type:'TextArea',
				label:'链接',
				id:'linkUrl',
				options:{
		        	initialValue:linkUrl
		        },
				domOptions:{rows:2,disabled:true,title:linkUrl}
			}
		]
		return(
			<div className={styles.singleAdd}>
				{this.drawerContent()}
				<FormModule {...this.props} formList={[...formList,...otherArr]} />
			</div>
		)
	}
}

export default SingleHand;
