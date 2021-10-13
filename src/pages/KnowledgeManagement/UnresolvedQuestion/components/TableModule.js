import React,{ Component,Fragment } from 'react';
import { 
	Button,
	Modal,
	message,
	Popover
} from 'antd';
import TableContent from '@components/TableContent';
import styles from './style.less';

export default function UnresolvedQuestionTable(props){
	const { 
		dispatch,
		unresolvedQuestion:{unresolvedQuestionData,selectedRowKeys=[]},
		loading,
		pageNum,
		pageSize,
		getList,
		changePage
	} = props;
	
	const { list=[],total=0 } = unresolvedQuestionData;
	let isSubmit = true;
	
	//新增/相似
	const handleOpenDrawer = (data,type) => {
		dispatch({
			type:'unresolvedQuestion/setVisible',
			payload:{visible:true,drawerType:type,onceData:data},
		})	
	}
	
	//忽略
	const handleDelete = (data) => {
		if(!isSubmit){
			return false;
		}
		isSubmit = false;
		const { id } = data;
		Modal.confirm({
    		title:'是否确认忽略',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			dispatch({
					type:'unresolvedQuestion/fetchSetIgnore',
					payload:{id:[id],opType:3},
					callback:(res) => {
						let { success } = res;
						if(success){
							message.success('操作成功');
							getList();
						}else{
							message.error('操作失败');
						}
						isSubmit = true;
					}
				})
    		},
    		onCancel:() => {
    			isSubmit = true;
    		}
  		});
	}
	
	//选择处理
	const setSelect = (selectedRowKeys) => {
		dispatch({
			type:'unresolvedQuestion/setSelect',
			payload:{selectedRowKeys}
		})
	}
	
	//批量忽略
	const handleBatchDisable = () => {
		if(!isSubmit){
			return false;
		}
		isSubmit = false;
		if(selectedRowKeys.length){
			Modal.confirm({
	    		title:'是否确认忽略',
	    		content: '',
	    		className:'selfModal',
	    		centered:true,
	    		okText: '是',
	    		cancelText: '否',
	    		onOk:() => {
	    			dispatch({
						type:'unresolvedQuestion/fetchSetIgnore',
						payload:{id:selectedRowKeys,opType:3},
						callback:(res) => {
							let { success } = res;
							if(success){
								message.success('操作成功');
								clearSelectedRowKeys();
								getList();
							}else{
								message.error('操作失败');
							}
							isSubmit = true;
						}
					})
	    		},
	    		onCancel:() => {
	    			isSubmit = true;
	    		}
	  		});
		}else{
			message.warning('请选择禁用项');
			isSubmit = true;
		}
	}
	
	const clearSelectedRowKeys = () => {
		dispatch({
			type:'unresolvedQuestion/clearSelectedRowKeys'
		})	
	}
	
	const columns = [
		{
			title: '未解决问题',
			key: 'unQuestion',
			ellipsis:true,
			width:'12%',
			render: record => {
				let { unQuestion='' } = record;
				const content = (<p className={styles.popoverContent}>{unQuestion}</p>);
				return(
					<Popover 
						placement="bottomLeft" 
						title='' 
						content={content}
						getPopupContainer={(triggerNode) => triggerNode.parentNode} 
						trigger="hover"
					>
						<span className={styles.popoverTitle}>{unQuestion}</span>
					</Popover>
				)
			}
		},
		{
			title: 'AI回复的标准问句',
			key: 'question',
			ellipsis:true,
			width:'12%',
			render: record => {
				let { question='' } = record;
				const content = (<p className={styles.popoverContent}>{question}</p>);
				return(
					<Popover 
						placement="bottomLeft" 
						title='' 
						content={content}
						getPopupContainer={(triggerNode) => triggerNode.parentNode} 
						trigger="hover"
					>
						<span className={styles.popoverTitle}>{question}</span>
					</Popover>
				)
			}
		},
		{
			title: '回复的答案',
			key: 'answer',
			ellipsis:true,
			width:'12%',
			render: record => {
				const { knowledgeAnswerVos=[] } = record;
				let answerTxt = '';
				const len = knowledgeAnswerVos.length - 1;
				const content = (
					<div className={styles.answerList}>
						{
							knowledgeAnswerVos.map((item,index) => {
								const { answer='',id } = item;
								answerTxt += answer;
								const txt = answer ? answer.replace(/\\n/g, " \n") : answer;
								return(
									<p 
										key={id} 
										className={styles.popoverAnswer}
										style={{marginBottom:index === len ? 0 : 6}}
									>
										{txt}
									</p>
								)
							})
						}
					</div>
				)
				return(
					<Popover 
						placement="bottomLeft" 
						title='' 
						content={content} 
						getPopupContainer={(triggerNode) => triggerNode.parentNode} 
						trigger="hover"
					>
						<span className={styles.popoverTitle}>{answerTxt}</span>
					</Popover>
				)
			}
		},
		{
			title: '用户反馈',
			key: 'userRep',
			ellipsis:true,
			width:'11%',
			render: record => {
				let { userRep='' } = record;
				return(
					<span title={userRep}>{userRep}</span>
				)
			}
		},
		{
			title: '地区',
			key: 'region',
			width:'8%',
			render: record => {
				const { regionName='全国',regionFullName='全国' } = record;
				return(
					<Fragment>
						{
							regionName !== '全国' ? (
								<Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
									<span className={styles.regionName}>{regionName}</span>
								</Popover>
							) : (<span>{regionName}</span>)
						}
					</Fragment>
				)
			}
		},
		{
			title: '业务分类',
			key: 'servType',
			width:'8%',
			ellipsis:true,
			render: record => {
				let { servType='' } = record;
				return(
					<span>{servType}</span>
				)
			}
		},
		{
			title: '最近询问时间',
			key: 'hanppenTm',
			width:'13%',
			render: record => {
				let { hanppenTm='' } = record;
				return(
					<span>{hanppenTm}</span>
				)
			}
		},
		{
			title: '操作',
			key: 'operation',
			render: record => {
				let { persionName='',opTm='',hanppenTm='',opType=0 } = record;
				let txt = '';
				if(opType === 1){
					txt = `${opTm} ${persionName}已申请关联相似`;
				}else
				if(opType === 2){
					txt = `${opTm} ${persionName}新增知识`;
				}else
				if(opType === 3){
					txt = `${opTm} ${persionName}已忽略`;
				}
				return(
					opType === 0 ? (
						<Fragment>
							<Button style={{marginRight:12}} onClick={() => handleOpenDrawer(record,'similar')}>关联相似</Button>
							<Button style={{marginRight:12}} onClick={() => handleOpenDrawer(record,'add')}>新增</Button>
							<Button type="danger" ghost onClick={() => handleDelete(record)}>忽略</Button>
						</Fragment>
					) : (<span>{txt}</span>)
				)
			}
		}
	]
	const rowSelection = {
		selectedRowKeys,
		getCheckboxProps:(record) => {
			const { opType=0 } = record;
			return {disabled: opType === 0 ? false : true}
		},
  		onChange: (rowKeys, selectedRows) => {
  			setSelect(rowKeys);
  		}
	};
	
	const tableOptions = {
		onceKey:'id',
		loading, 
		columns,
		dataSource:list,
		rowSelection,
		rowClassName:(record) => {
			const { opType=0 } = record;
			return opType === 0 ? '' : styles.rowDisabled
		},
		
	}
	
	const pageOptions = {
		totalShow:true,
  		current: pageNum,
  		pageSize,
  		onChange: (current, pageSize) => {
  			changePage(current,pageSize);
  		},
  		total,
  		custom:(
  			<Button 
				style={{marginRight:12}}
				onClick={handleBatchDisable}
			>
				批量忽略
			</Button>
  		)
	}
	
	return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
}
