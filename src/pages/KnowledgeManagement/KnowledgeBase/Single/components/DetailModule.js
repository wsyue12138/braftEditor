import React,{ Component } from 'react';
import {
	Form,
	Icon
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

@Form.create()

class SingleDetail extends Component{
	
	state = {
		datas:{},
		similarList:[]
	}
	
	componentDidMount(){
		const { single:{singleDrawerType,detailData,onceData} } = this.props;
		this.singleDrawerType = singleDrawerType;
		let datas = singleDrawerType === 'detail' ? onceData : detailData;
		this.setState({datas},() => { this.setInitVal() });
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		if(this.singleDrawerType === 'detail'){
			dispatch({
				type:'single/clearOnceData'
			})	
		}
	}
	
	//初始设置
	setInitVal = () => {
		const { datas } = this.state;
		const { knowledgeSimilarVos=[] } = datas;
		this.setState({similarList:this.setKnowledgeSimilar(knowledgeSimilarVos)});
	}
	
	//设置相似问句
	setKnowledgeSimilar = (data) => {
		let newArr = [];
		if(data.length){
			data.map((item,index) => {
				const { question='' } = item;
				newArr.push(question);
			})
		}
		return newArr;
	}
	
	//业务分类
	displayRender = (label,selectedOptions) => {
		return label[label.length - 1];
	}
	
	render(){
		const { similarList,datas } = this.state;
		const { single:{customFieldName,singleDrawerType} } = this.props;
		const { 
			customField='',
			linkUrl='',
			serviceTypeName='',
			question='',
			knowledgeAnswerVos=[],
			regionName='全国'
		} = datas;
		const _len = knowledgeAnswerVos.length;
		let answerShow = false;
		if(singleDrawerType === 'detail'){
			if(_len === 0){
				answerShow = true;
			}
		}else{
			answerShow = true;
		}
		let formList = [];
		const questionObj = {
			type:'Input',
			label:'标准问句',
			id:'question',
			options:{
				initialValue:question
			},
			domOptions:{placeholder:"请输入标准问句",disabled:true,title:question}
		};
		const similarTitleObj = {
			type:'Dom',
			label:'相似问句',
			id:'similar',
			onceStyle:{margin:0},
			custom:(<span></span>)
		};
		const regionObj = {
			type:'Input',
			label:'地区',
			id:'region',
			options:{
	        	initialValue:regionName
	        },
			domOptions:{placeholder:"请输入地址",disabled:true}
		}
		const serviceTypeObj = {
			type:'Input',
			label:'业务分类',
			id:'serviceType',
			options:{
	        	initialValue:serviceTypeName
	        },
			domOptions:{placeholder:"请输入业务分类",disabled:true}
		};
		const linkUrlObj = {
			type:'TextArea',
			label:'链接',
			id:'linkUrl',
			options:{
				initialValue:linkUrl
			},
			domOptions:{rows:2,disabled:true,title:linkUrl}
		};
		const customFieldObj = {
			type:'TextArea',
			label:customFieldName,
			id:'customField',
			options:{
				initialValue:customField
			},
			domOptions:{rows:4,disabled:true}
		};
		const similarObj = () => {
			let list = [];
			if(similarList.length){
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
					list.push(obj);
				})
			}else{
				let obj = {
					type:'Input',
					label:'',
					id:'similar0',
					options:{
						initialValue:''
					},
					domOptions:{placeholder:"",disabled:true}
				}
				list.push(obj);
			}
			return list;
		}
		const knowledgeAnswerObj = () => {
			let list = [];
			knowledgeAnswerVos.map((item,index) => {
				const { answer='',id } = item;
				const labelTxt = index === 0 ? '答案' : '';
				const obj = {
					type:'TextArea',
					label:labelTxt,
					id:'answer_' + id,
					options:{
						initialValue:answer.replace(/\\n/g, " \n")
					},
					domOptions:{rows:_len > 1 ? 4 : 6,placeholder:"请输入答案",disabled:true}
				}
				list.push(obj);
			})
			return list;
		}
		formList = [questionObj,similarTitleObj,...similarObj(),regionObj,serviceTypeObj,...knowledgeAnswerObj(),linkUrlObj,customFieldObj];
		
		return(
			<div className={styles.singleAdd}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default SingleDetail;