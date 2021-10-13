import React,{ Component,Fragment } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  List
} from 'antd';
import styles from './HistoryModule.less';

@Form.create()

class SingleHistory extends Component{

	state = {
		loading:false
	}

	componentDidMount(){
		this.getList();
	}

	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/clearKnowledgeHistoryList'
		})
	}

	//获取列表
	getList = () => {
		const { dispatch,onceData,parentType } = this.props;
		const { id } = onceData;
		this.setState({loading:true});
		let type = parentType === 'single' ? 'knowledgeBase/fetchGetSingleHistoryList' : 'knowledgeBase/fetchGetMultipleHistoryList';
		dispatch({
			type,
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})
	}

	//判断是否是json数据
	isJsonString = (str) => {
		let isJson = false;
		try {
			if (typeof JSON.parse(str) == "object") {
				isJson = true;
			}
		} catch(e) {

		}
		return isJson;
	}

	//答案设置
	setAfterAnswer = (afterAnswer) => {
		const isJson = this.isJsonString(afterAnswer);
		let answerList = [];
		if(isJson){
			answerList = JSON.parse(afterAnswer);
		}else{
			answerList = [{answer:afterAnswer}];
		}
		return answerList;
	}

	//搜索部分
	searchContent(){
		const { form:{getFieldDecorator},onceData,parentType='multiple' } = this.props;
		const { question='',nodeContent='' } = onceData;
		return(
			<div className={styles.searchContent} style={{paddingBottom:0}}>
				<Row>
					<Form layout="inline">
						<Col span={24} style={{marginBottom:20}}>
							<Form.Item label={parentType === 'multiple' ? '关键词' : '标准问句'}>
						        {getFieldDecorator('question',{
						        	initialValue:parentType === 'multiple' ? nodeContent : question
						        })(
						        	<Input style={{width:310}} disabled />
						        )}
						    </Form.Item>
					    </Col>
					</Form>
				</Row>
			</div>
		)
	}

	//列表部分
	listContent(){
		const { loading } = this.state;
		const { knowledgeBase } = this.props;
		const { historyData=[] } = knowledgeBase;
		return(
			<List
			    itemLayout="vertical"
			    bordered={false}
			    loading={loading}
			    dataSource={historyData}
			    renderItem={item => (
			      	<div className={styles.onceBox} key={item.id}>
			      		{this.onceContent(item)}
			      	</div>
			    )}
			/>
		)
	}

	//单个内容
	onceContent(item){
		const { parentType='multiple',multiple,single } = this.props;
		const { updateTime='',changeDescription='',operatePersonName='',operatePersonNum='',description='',handleDescription='',knowledgeChangeLogVo={} } = item;
		const {
			formerServerTypeName='',
			afterServerTypeName='',
			formerRegionFullName='',
			afterRegionFullName='',
			afterQuestion='',
			afterAnswer='',
			afterCustomField='',
			afterSimilar=JSON.stringify([]),
			afterLinkUrl='',
			afterKnowledgeStatus,
			afterNodeContent=''
		} = knowledgeChangeLogVo;
		
		const setServerTypeName = () => {
			let isShow = true;
			let txt,formerTxt,afterTxt,signTxt;
			if(formerServerTypeName !== null){
				formerTxt = formerServerTypeName;
				signTxt = ' → ';
			}else{
				formerTxt = '';
				signTxt = '';
				isShow = false;
			}
			if(afterServerTypeName !== null){
				afterTxt = afterServerTypeName;
				if(isShow){
					signTxt = ' → ';
				}else{
					signTxt = '';
				}
			}else{
				afterTxt = '';
				signTxt = '';
			}
			txt = '修改业务分类: ' + formerTxt + signTxt + afterTxt;
			return txt;
		}
		const setCustomFieldName = () => {
			let customFieldNameTxt;
			if(parentType === 'single'){
				const { customFieldName='补充说明' } = single;
				customFieldNameTxt = customFieldName;
			}else{
				const { customFieldName='补充说明' } = multiple;
				customFieldNameTxt = customFieldName;
			}
			return customFieldNameTxt;
		}
		return(
			<Fragment>
				<div className={styles.userContent}>
					<span style={{paddingLeft:0}}>{updateTime}</span>
					|
					<span>{`姓名 : ${operatePersonName}`}</span>
					|
					<span>{`工号 : ${operatePersonNum !== null ? operatePersonNum : '暂无工号'}`}</span>
				</div>
				<div className={styles.editContent}>
					<div className={styles.editOnce}>{description}</div>
					{
						afterServerTypeName !== null &&  formerServerTypeName !== null ? (
							<div className={styles.editOnce}>
								{setServerTypeName()}
							</div>
						) : ''
					}
					{
						formerRegionFullName == null && afterRegionFullName != null ? (
							<div className={styles.editOnce}>
								{`新增地区: ${afterRegionFullName}`}
							</div>
						) : ''
					}
					{
						formerRegionFullName != null && afterRegionFullName != null ? (
							<div className={styles.editOnce}>
								{`修改地区: ${formerRegionFullName} → ${afterRegionFullName}`}
							</div>
						) : ''
					}
					{
						afterQuestion !== null ? (
							<div className={styles.editOnce}>{`修改问题: ${afterQuestion}`}</div>
						) : ''
					}
					{
						afterAnswer !== null ? (
							<div className={styles.editOnce}>
								<span style={{float:'left'}}>修改答案: </span>
								<div className={styles.answerContent}>
									{
										this.setAfterAnswer(afterAnswer).map((val,i) => {
											const { answer='' } = val;
											const content = answer.replace(/\\n/g, " \n");
											const answerTxt = content.replace(/[(^*\n*)|(^*\r*)]/g,'</br>');
											return(
												<span
													key={i}
													dangerouslySetInnerHTML={{ __html: answerTxt}}
													style={{marginTop:i === 0 ? 0 : 18}}
												/>
											)
										})
									}
								</div>
							</div>
						) : ''
					}
					{
						afterSimilar !== null ? (
							<div className={styles.editOnce}>{`修改相似问句: ${JSON.parse(afterSimilar).join(';')}`}</div>
						) : ''
					}
					{
						afterLinkUrl !== null ? (
							<div className={styles.editOnce}>{`修改链接: ${afterLinkUrl}`}</div>
						) : ''
					}
					{
						afterKnowledgeStatus !== null ? (
							<div className={styles.editOnce}>{`修改知识状态: ${afterKnowledgeStatus ? '启用' : '停用'}`}</div>
						) : ''
					}
					{
						parentType !== 'single' && afterNodeContent !== null ? (
							<div className={styles.editOnce}>{`修改节点内容: ${afterNodeContent}`}</div>
						) : ''
					}
					{
						afterCustomField !== null ? (
							<div className={styles.editOnce}>{`${setCustomFieldName()}: ${afterCustomField}`}</div>
						) : ''
					}
					{
						changeDescription !== null ? (
							<div className={styles.editOnce}>{`修改说明: ${changeDescription}`}</div>
						) : ''
					}
					{
						handleDescription && handleDescription !== null ? (
							<div className={styles.editOnce}>{`审核说明: ${handleDescription}`}</div>
						) : ''
					}
				</div>
			</Fragment>
		)
	}

	render(){
		return(
			<div className={styles.historyBox}>
				{this.searchContent()}
				{this.listContent()}
			</div>
		)
	}
}

export default SingleHistory;
