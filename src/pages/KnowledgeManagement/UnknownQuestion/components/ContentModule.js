import React,{ Component,Fragment } from 'react';
import { 
	Form,
	Modal,
	Button,
	message
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import styles from './style.less';

@Form.create()

class UnknownQuestionContent extends Component{
	
	searchContent(){
		const { form,handleSearch } = this.props;
		let servType = undefined;
		const handleSearchFun = () => {
			form.validateFields(['search_beginTm','search_qeustionlike','search_opName','search_servType'],(err, values) => {
				let { search_beginTm=[],search_qeustionlike,search_opName,search_servType='' } = values;
				let data = {
					questionlike:search_qeustionlike,
					opName:search_opName,
					servType:search_servType.trim()
				}
				if(search_beginTm.length){
					data.beginTm = search_beginTm[0].format('YYYY-MM-DD');
					data.endTm = search_beginTm[1].format('YYYY-MM-DD');
				}
				handleSearch(data);
			})
		}
		
		const handleReset = () => {
			form.resetFields();
			handleSearch();
		}
		const searchList = [
			{
				type:'RangePicker',
				id:'search_beginTm',
				domOptions:{format:'YYYY-MM-DD'},
				domStyle:{width: 250}
			},
			{
				type:'Input',
				id:'search_qeustionlike',
				domOptions:{placeholder:'问题'},
				domStyle:{width:180}
			},
			{
				type:'Input',
				id:'search_opName',
				domOptions:{placeholder:'操作人'},
				domStyle:{width:120}
			},
			{
				type:'Input',
				id:'search_servType',
				onceStyle:{marginRight:16},
				domOptions:{placeholder:'业务分类'},
				domStyle:{width:120}
			},
			{
				type:'Button',
				onceStyle:{marginRight:20},
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:handleSearchFun}
			},
			{
				type:'Button',
				onceStyle:{marginRight:20},
				btnTitle:'重置',
				iconType:'sync',
				domOptions:{onClick:handleReset}
			}
		]
		return(
			<SearchForm {...this.props} searchList={searchList} />
		)
	}
	
	tableContent(){
		const { 
			dispatch,
			unknownQuestion:{unknownQestionData,selectedRowKeys=[]},
			loading,
			getList,
			pageNum,
			pageSize,
			changePage
		} = this.props;
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
		
		const clearSelectedRowKeys = () => {
			dispatch({
				type:'unknownQuestion/clearSelectedRowKeys'
			})	
		}
		
		const handleBatchDisable = () => {
			if(!isSubmit){
				return false;
			}
			isSubmit = false;
			const { unknownQuestion } = this.props;
			const { selectedRowKeys=[] } = unknownQuestion;
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
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			rowSelection,
			columns:[
				{
					title: '未知问题',
					key: 'unQuestion',
					ellipsis:true,
					width:'23%',
					render: record => {
						let { unQuestion='' } = record;
						return(
							<span title={unQuestion}>{unQuestion}</span>
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
			],
			rowClassName:(record) => {
				const { opType=0 } = record;
				return opType === 0 ? '' : styles.rowDisabled;
			}
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: pageSize,
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
		
		return(
			<TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
		)
	}
	
	render(){
		return(
			<Fragment>
				{this.searchContent()}
				{this.tableContent()}
			</Fragment>
		)
	}
}

export default UnknownQuestionContent;