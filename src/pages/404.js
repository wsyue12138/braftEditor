import React from 'react';
import { Button } from 'antd';
import Link from 'umi/link';
import styles from './notFound.less';
import notFound from '@assets/404.png';

const ExceptionNoFound = (props) => {
	
	return (
		<div className={styles.box}>
			<div className={styles.content}>
				<img src={notFound} />
				<p>页面地址不存在</p>
				<div>
					<Button>
						<Link to='/' style={{display:'blcok',width:'100%',height:'100%'}}>返回首页</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}

export default ExceptionNoFound;