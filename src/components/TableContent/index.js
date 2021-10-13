import React,{ Component,Fragment } from 'react';
import { 
	Table,
	Button,
	Pagination
} from 'antd';
import styles from './style.less';

/**
 * author：wsyue
 * tableOptions:{	    表格参数
 * 		onceKey:表格每项key值
 * 		...表格参数
 * }
 * pageOptions：{     分页参数
 * 		custom：自定义dom
 * 		totalShow：是否显示总条数
 * 		...分页设置参数
 * }
 * 
 * **/

export default function TableContent(props){
	
	const { tableOptions={},pageOptions={} } = props;
	const { onceKey } = tableOptions;
	const {
		custom,
		total=0,
		size='small',
		totalShow=true,
		defaultCurrent=1,
		showQuickJumper=true,
		hideOnSinglePage=true
	} = pageOptions;
	delete tableOptions.onceKey;
	const pagination = {...pageOptions,total,size,defaultCurrent,showQuickJumper,hideOnSinglePage};
	return(
		<Fragment>
			<div className={styles.tableModule}>
				<Table 
					rowKey={record => record[onceKey]} 
					pagination={false}
					tableLayout='fixed'
					{...tableOptions}
				/>
			</div>
			<div className={styles.pageModule}>
				{
					totalShow ? (
						<span 
							className={custom ? styles.totalBoxMax : styles.totalBoxMin} 
							style={{display:total >= 1 ? 'block' : 'none'}}
						>
							{ custom ? custom : ''}
							{`共${total}条数据`}
						</span>
					) : ''
				}
				<Pagination {...pagination} />
			</div>
		</Fragment>
	)
}
