import React,{ Component } from 'react';
import { Tabs } from 'antd';
import Recommend from './Recommend';
import Quick from './Quick';
import styles from './relevant.less';

const { TabPane } = Tabs;

export default class CustomerServiceRelevant extends Component{
	
	callback = (key) => {
		
	}
	
	render(){
		return(
			<div className={styles.quickBox}>
				<Tabs 
					defaultActiveKey="1" 
					onChange={this.callback}
					tabBarStyle={{width:'100%'}}
				>
				    <TabPane tab="推荐回复" key="1" style={{ height: '100%' }}>
				    	<Recommend {...this.props} />
				    </TabPane>
				    <TabPane tab="快捷回复" key="2" style={{ height: '100%' }}>
				      	<Quick {...this.props} />
				    </TabPane>
				</Tabs>
			</div>
		)
	}
}
