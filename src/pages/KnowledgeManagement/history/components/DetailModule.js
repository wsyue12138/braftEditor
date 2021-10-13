import React,{ Component,Fragment } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
} from 'antd';
import styles from './DetailModule.less';

function DetailModule(porps){
	
	const { form:{getFieldDecorator},onceData } = porps;
	
	//搜索部分
	const searchContent = () => {
		const { question='',nodeContent='' } = onceData;
		return(
			<div className={styles.searchContent} style={{paddingBottom:0}}>
				<Row>
					<Form layout="inline">
						<Col span={24} style={{marginBottom:20}}>
							<Form.Item label='标准问句'>
						        {getFieldDecorator('question',{
						        	initialValue:question
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
	
	//单个内容
	const contentModule = () => {
		const { 
			operateType,
			updateTime='',
			operatePersonName='',
			operatePersonNum='',
			afterContent='',
			formerContent='',
			changedescription=''
		} = onceData;
		let answerTxt = '';
		//const contentTxt = operateType === 1 ? formerContent : afterContent;
		const setContent = (data) => {
			const contentTxt = data ? data : '';
			const content = contentTxt.replace(/\\n/g, " \n");
			answerTxt = content.replace(/[(^*\n*)|(^*\r*)]/g,'</br>');
			return answerTxt;
		}
		// if(contentTxt){
		// 	const content = contentTxt.replace(/\\n/g, " \n");
		// 	answerTxt = content.replace(/[(^*\n*)|(^*\r*)]/g,'</br>');
		// }
		return(
			<div className={styles.contentModule}>
				<div className={styles.userContent}>
					<span style={{paddingLeft:0}}>{updateTime}</span>
					|
					<span>{`姓名 : ${operatePersonName}`}</span>
					|
					<span>{`工号 : ${operatePersonNum !== null ? operatePersonNum : '暂无工号'}`}</span>
				</div>
				<div className={styles.editContent}>
					<div className={styles.editOnce}>
						{
							changedescription && (<div className={styles.answerContent} style={{marginBottom:10}}>{changedescription}</div>)
						}
						{
							formerContent && (
								<div className={styles.answerContent} style={{marginBottom:10}}>
									<span dangerouslySetInnerHTML={{ __html: setContent(formerContent)}} />
								</div>
							)
						}
						{
							afterContent && (
								<div className={styles.answerContent}>
									<span dangerouslySetInnerHTML={{ __html: setContent(afterContent)}} />
								</div>
							)
						}
					</div>
				</div>
			</div>
		)
	}
	
	return(
		<div className={styles.historyBox}>
			{searchContent()}
			{contentModule()}
		</div>
	)
}

export default DetailModule = Form.create()(DetailModule);