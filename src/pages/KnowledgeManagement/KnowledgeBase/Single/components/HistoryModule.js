import React,{ Component,Fragment } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  List
} from 'antd';
import { getUserData } from '@utils/utils';
import styles from './style.less';

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
			type:'single/clearOnceData'
		})		
	}
	
	//获取列表
	getList = () => {
		const { dispatch,single } = this.props;
		const { onceData:{id} } = single;
		this.setState({loading:true});
		dispatch({
			type:'single/fetchGetKnowledgeHistoryList',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					this.setState({loading:false});
				}
			}
		})	
	}
	
	//搜索部分
	searchContent(){
		const { form:{getFieldDecorator},single:{onceData} } = this.props;
		const { question } = onceData;
		return(
			<div className={styles.searchContent} style={{paddingBottom:0}}>
				<Row>
					<Form layout="inline">
						<Col span={24} style={{marginBottom:20}}>
							<Form.Item label="标准问句">
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
	
	//列表部分
	listContent(){
		const { loading } = this.state;
		const { single } = this.props;
		const { historyData=[] } = single;
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
		const { updateTime='',operatePersonName='',operatePersonNum='',description='',knowledgeChangeLogVo={} } = item;
		const { formerServerTypeName='',afterServerTypeName='',afterAnswer='',afterCustomField='',handleDescription='' } = knowledgeChangeLogVo;
		console.log(knowledgeChangeLogVo)
		return(
			<Fragment>
				<div className={styles.userContent}>
					<span style={{paddingLeft:0}}>{updateTime}</span>
					|
					<span>{`姓名 : ${operatePersonName}`}</span>
					|
					<span>{`工号 : ${operatePersonNum}`}</span>
				</div>
				<div className={styles.editContent}>
					<div className={styles.editOnce}>{description}</div>
					{
						afterServerTypeName !== null ? (
							<div className={styles.editOnce}>{`修改业务分类: ${formerServerTypeName} → ${afterServerTypeName}`}</div>
						) : ''
					}
					{
						afterAnswer !== null ? (
							<div className={styles.editOnce}>{`修改答案: ${afterAnswer}`}</div>
						) : ''
					}
					{
						afterCustomField !== null ? (
							<div className={styles.editOnce}>{`修改说明: ${afterCustomField}`}</div>
						) : ''
					}
					{
						handleDescription !== null ? (
							<div className={styles.editOnce}>{`审核不通过原因: ${afterCustomField}`}</div>
						) : ''
					}
				</div>
			</Fragment>
		)
	}
	
	render(){
		return(
			<div className={styles.singleHistory}>
				{this.searchContent()}
				{this.listContent()}
			</div>
		)
	}
}

export default SingleHistory;
