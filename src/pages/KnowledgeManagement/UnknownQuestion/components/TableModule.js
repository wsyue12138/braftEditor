import React,{ Component,Fragment } from 'react';
import { 
	Button,
	Modal,
	message,
	Popover
} from 'antd';
import TableContent from '@components/TableContent';
import styles from './style.less';

export default function UnknownQuestionTable(props){
	const { 
		dispatch,
		unknownQuestion:{unknownQestionData,selectedRowKeys=[]},
		loading,
		pageNum,
		pageSize,
		getList,
		changePage
	} = props;
	const { list=[],total=0 } = unknownQestionData;
	let isSubmit = true;
	
	//新增/相似
	const handleOpenDrawer = (data,type) => {
		dispatch({
			type:'unknownQuestion/setVisible',
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
					type:'unknownQuestion/fetchSetIgnore',
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
			type:'unknownQuestion/setSelect',
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
						type:'unknownQuestion/fetchSetIgnore',
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
			type:'unknownQuestion/clearSelectedRowKeys'
		})	
	}
	
	const columns = [
		{
			title: '未知问题',
			key: 'unQuestion',
			ellipsis:true,
			width:'23%',
			render: record => {
				let { unQuestion='' } = record;
				const content = (<p className={styles.popoverContent}>{unQuestion}</p>);
				return(
					<Popover placement="bottomLeft" title='' content={content} trigger="hover">
						<span className={styles.popoverTitle}>{unQuestion}</span>
					</Popover>
				)
			}
		},
		{
			title: '业务分类',
			key: 'servType',
			ellipsis:true,
			width:'23%',
			render: record => {
				let { servType='' } = record;
				return(
					<span title={servType}>{servType}</span>
				)
			}
		},
		{
			title: '最近询问时间',
			key: 'hanppenTm',
			width:'22%',
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
