import React,{ Component } from 'react';
import { 
	Form
} from 'antd';
import FormModule from '@components/FormModule';
import styles from './style.less';

@Form.create()

class WorkforceProcessed extends Component{
	
	render(){ 
		const { workforce:{onceData} } = this.props;
		const { 
			itemName='',
			categoryName='',
			content='',
			applyPersonName='',
			applyDate='',
			resultStatus,
			handleDescription='',
			handlePersonName='',
			handleDate=''
		} = onceData;
		let statusTxt = resultStatus === 1 ? '已处理' : '无法处理';
		const formList = [
			{
				type:'Input',
				label:'事项名称',
				id:'itemName',
				options:{initialValue:itemName},
				domOptions:{disabled:true}
			},
			{
				type:'Input',
				label:'业务分类',
				id:'categoryName',
				options:{initialValue:categoryName},
				domOptions:{disabled:true}
			},
			{
				type:'TextArea',
				label:'申请内容',
				id:'content',
				options:{initialValue:content},
				domOptions:{rows:6,disabled:true,placeholder:'最多输入300个字'}
			},
			{
				type:'Input',
				label:'申请人',
				id:'applyPersonName',
				options:{initialValue:applyPersonName},
				domOptions:{disabled:true}
			},
			{
				type:'Input',
				label:'申请日期',
				id:'applyDate',
				options:{initialValue:applyDate},
				domOptions:{disabled:true}
			},
			{
				type:'Input',
				label:'工单处理结果',
				id:'resultStatus',
				options:{initialValue:statusTxt},
				domOptions:{disabled:true}
			},
			{
				type:'TextArea',
				label:'处理说明',
				id:'handleDescription',
				options:{initialValue:handleDescription},
				domOptions:{rows:6,disabled:true,placeholder:'最多输入300个字'}
			},
			{
				type:'Input',
				label:'处理人员',
				id:'handlePersonName',
				options:{initialValue:handlePersonName},
				domOptions:{disabled:true}
			},
			{
				type:'Input',
				label:'处理日期',
				id:'handleDate',
				options:{initialValue:handleDate},
				domOptions:{disabled:true}
			}
		]
		return(
			<div className={styles.formContent}>
				<FormModule {...this.props} formList={formList} />
			</div>
		)
	}
}

export default WorkforceProcessed;