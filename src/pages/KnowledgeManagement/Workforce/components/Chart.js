import React,{ Fragment } from 'react';
import unprocessed from '@assets/unprocessed.png';
import processed from '@assets/processed.png';
import newlyAdded from '@assets/newlyAdded.png';
import styles from './style.less';

export default function WorkforceChat(props){
	const { workforce } = props;
	const { statistics } = workforce;
	const { currentMonthInc=0,handledNum=0,unHandleNum=0 } = statistics;
	return(
		<div className={styles.workforceChat}>
			<div className={styles.unprocessed}>
				<div className={styles.sign}>
					<img src={unprocessed} />
				</div>
				<div className={styles.content}>
					<div>
						<span>未处理</span>
						<span className={styles.num}>{unHandleNum}</span>
						<span>项</span>
					</div>
				</div>
			</div>
			<div className={styles.processed}>
				<div className={styles.sign}>
					<img src={processed} />
				</div>
				<div className={styles.content}>
					<div>
						<span>已处理</span>
						<span className={styles.num}>{handledNum}</span>
						<span>项</span>
					</div>
				</div>
			</div>
			<div className={styles.newlyAdded}>
				<div className={styles.sign}>
					<img src={newlyAdded} />
				</div>
				<div className={styles.content}>
					<div>
						<span>本月新增</span>
						<span className={styles.num}>{currentMonthInc}</span>
						<span>项</span>
					</div>
				</div>
			</div>
		</div>
	)
}
