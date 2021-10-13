import React,{ Component } from 'react';
import { List,Row, Col } from 'antd';
import $ from  'jquery';
import emojiStyle from '@components/Emoji/emoji.less';
import styles from './style.less';

const jEmoji = require('emoji');

export default class MessageListMount extends Component{
	
	componentDidUpdate(prevProps,prevState){
		const { message } = this.props;
		const { messageList=[] } = message; 
		const prevMessageList = prevProps.message.messageList;
		if(prevMessageList.length && (JSON.stringify(messageList) !== JSON.stringify(prevMessageList))){
			$('#listBox').scrollTop($('#listBox')[0].scrollHeight);
		}
	}
	
	//图片处理
	imageModule = (list) => {
		const { imgOpen } = this.props;
		return(
			<div className={styles.imageBox}>
				<Row gutter={12} style={{height:'100%'}}>
					{
						list.map((item,index) => {
							const { id,picUrl='' } = item;
							return(
								<Col key={id} span={6} style={{height:'100%'}}>
									<div 
										className={styles.onceImage} 
										style={{ backgroundImage: 'url(' + picUrl + ')' }}
										onClick={() => imgOpen(picUrl)}
									>
									</div>
								</Col>
							)
						})
					}
				</Row>
			</div>
		)
	}
	
	//单条内容
	onceModule = (data) => {
		const { message } = this.props;
		const { onceData={} } = message;
		const { commentCategory } = onceData;
		const { createTime,comment='',pics=[],personId,personName } = data;
		const txt = comment ? comment.replace(/\n/g, '<br/>') : '';
		const html = jEmoji.unifiedToHTML(txt);
		return(
			<div className={styles.onceBox}>
				<div>
					<span className={personId ? styles.customerService : styles.customer}></span>
					{
						personName ? (<span style={{marginRight:40}}>{`处理人 : ${personName}`}</span>) : ''
					}
					<span style={{marginRight:40}}>{createTime}</span>
					<span>{`分类: ${commentCategory}`}</span>
				</div>
				<div className={styles.onceContent}>
					<span className={emojiStyle.chatOnce} dangerouslySetInnerHTML={{__html:html}} />
				</div>
				{
					pics.length ? this.imageModule(pics) : ''
				}
			</div>
		)
	}
	render(){
		const { message:{drawerType,messageList=[]},listLoading } = this.props;
		return(
			<div id="listBox" className={drawerType === 'detail' ? styles.maxMessageList : styles.minMessageList}>
				<List
					loading={listLoading}
				    dataSource={messageList}
				    renderItem={item => (
				        <List.Item>
				          	{this.onceModule(item)}
				        </List.Item>
				    )}
			    />
			</div>
		)
	}
	
}
