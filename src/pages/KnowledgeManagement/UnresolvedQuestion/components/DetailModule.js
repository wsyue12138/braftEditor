import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Icon
} from 'antd';
import { lineBreak } from '@utils/utils';
import FormModule from '@components/FormModule';
import styles from './style.less';

@Form.create()

class UnresolvedQuestionDetail extends Component{
	
	state = {
		similarList:[]
	}
	
	componentDidMount(){
		this.setInitVal();
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
		const { datas } = this.props;
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
		const { similarList,serviceType } = this.state;
		const { form:{getFieldDecorator},knowledgeBase:{serviceList},single:{customFieldName},datas } = this.props;
		const { 
			customField='',
			linkUrl='',
			serviceTypeName='',
			question='',
			knowledgeStatus=1,
			handleDescription='',
			knowledgeAnswerVos=[],
			parentId=0,
			regionName='全国'
		} = datas;
		const _len = knowledgeAnswerVos.length;
		let formList = [
			{
				type:'Input',
				label:'标准问句',
				id:'question',
				options:{initialValue:question},
				domOptions:{placeholder:"请输入标准问句",disabled:true}
			},
			{
				type:similarList.length ? 'Dom' : '',
				label:'相似问句',
				id:'similar',
				onceStyle:{marginBottom:0},
				custom:(
					<span></span>
				)
			},
			{
				type:similarList.length ? 'Dom' : '',
				label:'',
				id:'list',
				onceStyle:{marginBottom:0},
				custom:(
					<Fragment>
						{
					    	similarList.map((item,index) => {
					    		return(
					    			 <Input 
					    			 	key={index}
					    			 	disabled
					    			 	value={item}
						        		placeholder='输入新的相似问句' 
						        		style={{marginBottom:18}}
						        	/>
					    		)
					    	})
					    }
					</Fragment>
				)
			},
			{
				type:'Input',
				label:'地区',
				id:'region',
				options:{initialValue:regionName},
				domOptions:{disabled:true}
			},
			{
				type:'Input',
				label:'业务分类',
				id:'serviceType',
				options:{initialValue:serviceTypeName},
				domOptions:{disabled:true}
			}
		]
		knowledgeAnswerVos.map((item,index) => {
    		const { answer='',id } = item;
    		const labelTxt = index === 0 ? '答案' : '';
    		const obj = {
    			type:'TextArea',
				label:labelTxt,
				id:'answer_' + id,
				options:{initialValue:answer.replace(/\\n/g, " \n")},
				domOptions:{rows:_len > 1 ? 4 : 6,placeholder:"请输入答案",disabled:true}
    		}
    		formList.push(obj);
    	})
		formList.push({
			type:'TextArea',
			label:'链接',
			id:'linkUrl',
			options:{initialValue:linkUrl},
			domOptions:{rows:2,placeholder:"请输入链接",disabled:true}
		});
		formList.push({
			type:'TextArea',
			label:customFieldName,
			id:'customField',
			options:{initialValue:customField},
			domOptions:{rows:4,placeholder:"请输入内容",disabled:true}
		})
		return(
			<div className={styles.addBox}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default UnresolvedQuestionDetail;