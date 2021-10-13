import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Pagination
} from 'antd';
import styles from './style.less';

export default function MultiplePage(props){
	const { dispatch,multiple:{multipleData,multiplePageNum,multiplePageSize=10},getList } = props;
	const { total=0 } = multipleData;
	let pagination = {
		defaultCurrent: 1,
  		defaultPageSize: 10,
  		showQuickJumper: true,
  		hideOnSinglePage: true,
  		current: multiplePageNum,
  		pageSize: multiplePageSize,
  		onChange: (current, pageSize) => {
  			dispatch({
				type:'multiple/setMultiplePage',
				payload:{multiplePageNum:current,multiplePageSize:pageSize}
			})	
			setTimeout(() => {
				getList();
			})
  		},
  		total
	}
	return(
		<div className={styles.pageModule}>
			<Pagination size="small" {...pagination} />
		</div>
	)
}
