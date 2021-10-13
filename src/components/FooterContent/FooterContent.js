import React,{ Component } from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import styles from './FooterContent.less';

const { Footer } = Layout;

export default class FooterContent extends Component{
	render(){
		return(
			<Footer className={styles['basic-footer']}>
				 北冥星眸智能服务平台 ©2015 Created by sosout
			</Footer>
		)
	}
}
