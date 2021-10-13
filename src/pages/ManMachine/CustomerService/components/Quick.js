import React,{ Component,Fragment } from 'react';
import { Input,Collapse,Empty,Spin } from 'antd';
import styles from './reply.less';

const { Search } = Input;
const { Panel } = Collapse;

export default class CustomerServiceQuick extends Component{
	
	state = {
		loading:false
	}
	
	//获取列表
	getList = (keyword) => {
		const { dispatch,global } = this.props;
		const { productionId='' } = global;
		this.setState({loading:true});
		dispatch({
			type:'customerService/fetchGetQuickReply',
			payload:{keyword,productionId},
			callback:(res) => {
				this.setState({loading:false});
			}
		});	
		
	}
	
	//搜索
	handleSearch = (value) => {
		this.getList(value);
	}
	
	//折叠面板改变
	handleChange = (num) => {
		
	}
	
	//点击选择
	handleSelect = (sendContent) => {
		const { dispatch } = this.props;
		dispatch({
			type:'customerService/changeContent',
			payload:{sendContent}
		});	
	}
	
	//问句处理
	setAnswer = (childKnowledgeList) => {
		let answerTxt = '';
		childKnowledgeList.map((item,index) => {
			const { answer } = item;
			answerTxt += answer.replace(/\\n/g, " \n") + '\n';
		})
		return answerTxt;
	}

	//构造快捷回复文本
	setContentTxt = (data) => {
		return(
			<Fragment>
				{
					data.map((item,index) => {
						const { content='',id } = item;
						const contentTxt = content.replace(/\\n/g, " \n");
						return (
							<p 
								key={`text_${id}`}
								className={styles.quickText}
								title={content}
								onClick={() => this.handleSelect(contentTxt)}
							>
								{contentTxt}
							</p>
						)
					})
				}
			</Fragment>
		)
		
	}
	
	//单个模块
	contentModule(list){
		return(
			<Collapse onChange={this.handleChange}>
				{
					list.map((item,index) => {
						const { id,keyword='',contentVos=[] } = item;
						const headerContent = (
							<div className={styles.panelHeader}>
								<div className={styles.headerSign}>知</div>
								<div className={styles.headerTitle}>
									<div title={keyword}>
										{keyword}
									</div>
								</div>
							</div>
						);
						return(
							<Panel header={headerContent} key={id}>
								{this.setContentTxt(contentVos)}
							</Panel>
						)
					})
				}
			</Collapse>
		)	
	}
	
	render(){
		const { loading } = this.state;
		const { customerService } = this.props;
		const { quickReply=[] } = customerService;
		const content = quickReply.length ? this.contentModule(quickReply) : (
							<Empty description={false} style={{marginTop:'20%'}}/>
						)
		return(
			<div className={styles.box}>
				<div className={styles.searchContent}>
					<Search
      					placeholder="输入关键字"
      					onSearch={this.handleSearch}
      					style={{ width: '100%' }}
    				/>
				</div>
				<div className={styles.recommendList}>
					{
						loading ? (<div className={styles.spinBox}>
							<Spin size="large" />
							</div>) : content
					}
				</div>
			</div>
		)
	}
}
