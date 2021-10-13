import React,{ Component } from 'react';
import SendModule from './SendModule';
import EntryModule from './EntryModule';
import styles from './chat.less';

class CustomerServiceChat extends Component{
	
	state = {
		
	}
	
	componentDidMount(){
		
	}
	
	render(){
		const { socketetModel } = this.props;
		const { currentInfo={} } = socketetModel;
		const { contactsId='' } = currentInfo;
		return(
			<div className={styles.chatBox}>
				<div className={styles.chatContent}>
					<div className={styles.handerBox}>
						<div className={styles.userName} title={contactsId}>{contactsId}</div>
					</div>
					<div className={styles.content}>
						<div className={styles.chatModule}>
							<EntryModule {...this.props} />
						</div>
						<div className={styles.sendModule}>
							<SendModule {...this.props} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}

export default CustomerServiceChat;