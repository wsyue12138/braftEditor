import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Button,
	message,
	Modal,
	Popover,
	Form,
	Input,
	Cascader
} from 'antd';
import TableContent from '@components/TableContent';
import FormModal from '@components/FormModalModule';
import Region from '@components/Region';
import styles from './style.less';

const { TextArea } = Input;

@Form.create()

@connect(({
	global,
	user,
	knowledgeBase,
	single,
	region
}) => ({
	global,
	user,
	knowledgeBase,
	single,
	region
}))

class SingleTable extends Component{

	state = {
		visible:false,
		modalType:'',
		selectedOnce:{},
		regionVal:undefined
	}
	
	componentDidMount(){
		this.isSubmit = true;
	}
	
	//删除
	handleDelete = (data) => {
		const { dispatch,getList } = this.props;
		const { id } = data;
		dispatch({
			type:'single/fetchSingleDelete',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('删除成功');
					getList();
				}else{
					message.error('删除失败');
				}
				this.isSubmit = true;
			}
		})
	}
	
	//生效
	handleEnable = (data) => {
		const { dispatch,global:{productionId},getList } = this.props;
		const { id } = data;
		dispatch({
			type:'single/fetchSingleEnable',
			payload:{id,productionId},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('操作成功');
					getList();
				}else{
					message.error('操作失败');
				}
				this.isSubmit = true;
			}
		})
	}
	
	//新增完成
	handleAddSuccess = (data) => {
		const { dispatch,global:{productionId},getList } = this.props;
		const { id } = data;
		dispatch({
			type:'single/fetchTesHandleKnowledge',
			payload:{id,productionId},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('操作成功');
					getList();
				}else{
					message.error('操作失败');
				}
				this.isSubmit = true;
			}
		})
	}

	//单轮知识批量更新接口
	handleBatchUpdate = (data) => {
		const { dispatch,global:{productionId},selectedRowKeys } = this.props;
		const payload = {...data,knowledgeIds:selectedRowKeys,productionId};
		dispatch({
			type:'single/fetchBatchUpdate',
			payload,
			callback:(res) => {
				const { success,code } = res;
				if(success){
					this.resumeInitial('操作成功');
				}else{
					if(code === 11038){
						message.error(res.message);
					}else{
						message.error('操作失败');
					}
				}
				this.isSubmit = true;
			}
		})
	}

	//单轮知识批量审核接口
	handleBatchAuditKnowledge = (data) => {
		const { dispatch,global:{productionId},selectedRowKeys } = this.props;
		const payload = {...data,knowledgeIds:selectedRowKeys,productionId};
		dispatch({
			type:'single/fetchBatchAuditKnowledge',
			payload,
			callback:(res) => {
				const { success } = res;
				if(success){
					this.resumeInitial('操作成功');
				}else{
					message.error('操作失败');
				}
				this.isSubmit = true;
			}
		})	
	}

	//批量删除
	handleBatchDelete = () => {
		const { dispatch,selectedRowKeys } = this.props;
		dispatch({
			type:'single/fetchBatchDelete',
			payload:{knowledgeIds:selectedRowKeys},
			callback:(res) => {
				const { success } = res;
				if(success){
					this.resumeInitial('删除成功');
				}else{
					message.error('删除失败');
				}
				this.isSubmit = true;
			}
		})	
	}

	//复位
	resumeInitial = (msg) => {
		const { modalType } = this.state;
		const { getList } = this.props;
		const isReoladRegion = modalType === 'region';
		this.setState({visible:false,modalType:'',selectedOnce:{},regionVal:undefined},() => {
			message.success(msg);
			getList(isReoladRegion);
		})	
	}
	
	//用户权限修改
	handleJurisdiction = (type,data) => {
		if(!this.isSubmit){
			return false;
		}
		this.isSubmit = false;
		let title = '';
		let callback = null;
		if(type === 'delete'){
			title = '是否确认删除?';
			callback = this.handleDelete;
		}else
		if(type === 'effective'){
			title = '是否确认生效?';
			callback = this.handleEnable;
		}else
		if(type === 'addSuccess'){
			title = '是否确认新增成功?';
			callback = this.handleAddSuccess;
		}
		Modal.confirm({
    		title,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			callback(data);
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
	}
	
	//打开抽屉
	handleOpenDrawer = (type,onceData,onceType='all',parentData) => {
		const { dispatch } = this.props;
		const { operateType } = onceData;
		let drawerWidth = 422;
		if(type === 'detail'){
			this.setSimilarOnce(onceData);
		}else
		if(type === 'examine'){
			if(operateType !== 1){
				this.getPreviousEditData(onceData,onceType,parentData);
			}
		}else
		if(type === 'similar'){
			drawerWidth = 810;
		}else
		if(type === 'history'){
			drawerWidth = 810;
		}
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:true,singleDrawerType:type,drawerWidth,onceData,onceType,parentData}
		})	
	}
	
	//审核获取上一次修改数据
	getPreviousEditData = (onceData,onceType,parentData) => {
		const { dispatch } = this.props;
		const { id,changeLogUuid=null } = onceData;
		if(changeLogUuid !== null){
			dispatch({
				type:'single/fetchGetOriginKnowledge',
				payload:{id,changeLogUuid},
				callback:(res) => {
					let { success } = res;
					if(success){
						dispatch({
							type:'single/setSingleVisible',
							payload:{singleVisible:true,singleDrawerType:'examine',drawerWidth:880,onceData,onceType,parentData}
						})
					}
				}
			})
		}
	}
	
	//更新时间排序
	handleTableChange = (pagination, filters, sorter) => {
		const { dispatch,single,getList } = this.props;
		const { singleSearch={} } = single;
		const { order='descend' } = sorter;
		let updateTimeSort = undefined;
		if(order === 'ascend'){
			updateTimeSort = 'asc';
		}else
		if(order === 'descend'){
			updateTimeSort = 'desc';
		}
		let datas = {...singleSearch};
		datas.updateTimeSort = updateTimeSort;
		dispatch({
			type:'single/setSingleSearch',
			payload:{singleSearch:datas}
		})	
		dispatch({
			type:'single/setSinglePage',
			payload:{singlePageNum:1,singlePageSize:9}
		})	
		setTimeout(() => {
			getList();
		})
	}
	
	//保存单条数据
	setSimilarOnce = (onceData) => {
		const { dispatch } = this.props;
		dispatch({
			type:'single/setSimilarOnce',
			payload:{onceData}
		})
	}

	//查询业务类目权限
	setservicePermission = (permission,serviceType) => {
		const { userPermission } = this.props;
		const list = userPermission[permission] ? userPermission[permission] : [];
		const serviceStr = serviceType ? serviceType.substr(0,4) : '';
		const isRight = list.some((item,index) => {
			const { categoryCode='' } = item;
			return serviceStr === categoryCode.substr(0,4); 
		})
		return isRight;
	}
	
	//设置状态与按钮
	setStateContent = (record) => {
		const { user,global,userPermission } = this.props;
		const { knowledgeAuthority={} } = global;
		const { userdata={} } = user;
		const { userRoleVos=[],id } = userdata;
		const { flowCode,knowledgeStatus='',operateType,updatePersonId,serviceType } = record;
		let txt='';
		let btnContent = [{type:'detail',name:'查看',isOpen:true}];
		let isEditRight,isExamineRight,isEffectiveRight;
		switch (flowCode){
			case '-1':
				txt = knowledgeStatus ? '启用' : '停用';
				isEditRight = this.setservicePermission('05010600',serviceType);
				if(knowledgeAuthority.changeBtn && isEditRight){
					btnContent.push({type:'edit',name:'编辑',isOpen:true});
				}
				break;
			case '1000':
				txt = '待审核';
				isEditRight = this.setservicePermission('05010600',serviceType);
				isExamineRight = this.setservicePermission('05010300',serviceType);
				if(knowledgeAuthority.changeBtn && id === updatePersonId){
					if(isEditRight){
						btnContent.push({type:'edit',name:'编辑',isOpen:true});
					}
					if(operateType === 1){
						btnContent.push({type:'delete',name:'删除'});
					}
				}
				if(knowledgeAuthority.examineBtn && isExamineRight){           //审核员
					btnContent.push({type:'examine',name:'审核',isOpen:true});
				}
				break;
			case '1001':
				txt = '审核通过';
				if(knowledgeAuthority.handleBtn){      
					btnContent.push({type:'handle',name:'处理',isOpen:true});
				}
				break;
			case '1002':
				txt = '操作中';
				if(knowledgeAuthority.handleBtn){       
					btnContent.push({type:'addSuccess',name:'新增完成'});
					btnContent.push({type:'similar',name:'关联相似',isOpen:true});
				}
				break;
			case '1003':
				txt = '待生效';
				isEffectiveRight = this.setservicePermission('05010500',serviceType);
				if(knowledgeAuthority.takeEffectBtn && isEffectiveRight){       //TES人员或审核
					btnContent.push({type:'effective',name:'生效'});
				}
				break;	
			default:
				txt = '待变更';
				break;
		}
		btnContent.push({type:'history',name:'历史记录',isOpen:true});
		return {txt,btnContent}
	}

	//批量状态判断
	batchExamineJudge = (modalType,callback) => {
		const { selectedRows } = this.props;
		let warningTxt = '';
		let isMore = false;
		let permission = true;
		let isEditRight,isExamineRight;
		const allPassed = selectedRows.every((item,index) => {
			const { serviceType } = item;
			let isOk = false;
			if(modalType === 'delete'){
				const txt = this.setStateContent(item).txt;
				isOk = txt === '启用' || txt === '停用';
			}else
			if(modalType === 'open'){
				const txt = this.setStateContent(item).txt;
				isEditRight = this.setservicePermission('05010600',serviceType);
				if(permission){
					permission = isEditRight;
				}
				isOk = txt === '停用' && isEditRight;
			}else
			if(modalType === 'examine'){
				const { flowCode } = item;
				isExamineRight = this.setservicePermission('05010300',serviceType);
				if(permission){
					permission = isExamineRight;
				}
				isOk = flowCode === '1000' && isExamineRight;
			}else{
				const txt = this.setStateContent(item).txt;
				isEditRight = this.setservicePermission('05010600',serviceType);
				if(permission){
					permission = isEditRight;
				}
				if(modalType === 'region'){
					const { childKnowledges=[] } = item;
					if(childKnowledges.length !== 0){
						isMore = true;
					}
					isOk = childKnowledges.length === 0 && txt === '启用' && isEditRight;
				}else{
					isOk = txt === '启用' && isEditRight;
				}
			}
			return isOk;
		})
		if(!permission){
			warningTxt = '所选知识无操作权限，请重新确认';
		}else{
			if(modalType === 'delete'){
				warningTxt = '所选知识包含操作中状态，请重新确认';
			}else
			if(modalType === 'region'){
				warningTxt = isMore ? '所选知识包含多地区答案知识，请重新确认' : '所选知识包含非启用状态，请重新确认';
			}else
			if(modalType === 'open'){
				warningTxt = '所选知识包含非停用状态，请重新确认';
			}else
			if(modalType === 'examine'){
				warningTxt = '所选知识包含非待审核状态，请重新确认';
			}else{
				warningTxt = '所选知识包含非启用状态，请重新确认';
			}
		}
		
		if(allPassed){
			callback();
		}else{
			message.warning(warningTxt);
		}
	}

	//批量禁用、启用
	operationTip = (type) => {
		const { selectedRowKeys=[] } = this.props;
		if(selectedRowKeys.length){
			let title;
			if(type === 'open'){
				title = '启用';
			}else
			if(type === 'close'){
				title = '禁用';
			}else
			if(type === 'delete'){
				title = '删除'
			}
			this.batchExamineJudge(type,() => {
				Modal.confirm({
					title:`是否确定批量${title}知识`,
					content: '',
					className:'selfModal',
					centered:true,
					okText: '是',
					cancelText: '否',
					onOk:() => {
						if(!this.isSubmit){
							return false;
						}
						this.isSubmit = false;
						if(type !== 'delete'){
							const knowledgeStatus = type === 'open' ? 1 : 0;
							const batchOperatorType = type === 'open' ? 1 : 2;
							this.handleBatchUpdate({knowledgeStatus,batchOperatorType});
						}else{
							this.handleBatchDelete();
						}
					},
					onCancel:() => {
						this.isSubmit = true;
					}
				});
			})
		}else{
			message.warning('请选择操作项');
		}
	}

	//打开弹窗批量审核、修改类目
	openModal = (modalType) => {
		const { selectedRowKeys=[] } = this.props;
		if(selectedRowKeys.length){
			this.batchExamineJudge(modalType,() => {
				this.setState({modalType,visible:true});
			});
		}else{
			message.warning('请选择操作项');
		}
		
	}

	//关闭弹窗批量审核、修改类目
	closeModal = (modalType) => {
		this.setState({modalType:'',visible:false});
	}

	//展开、收起答案
	handleMoreAnswer = (id,_index) => {
		const { setExpandedRow,expandedRowKeys } = this.props;
		const list = [...expandedRowKeys];
		if(_index !== -1){
			list.splice(_index,1); 
		}else{
			list.push(id);
		}
		setExpandedRow(list);
	}

	//批量审核
	handleExamine = (result) => {
		if(!this.isSubmit){
			return
		}
		let options;
		this.isSubmit = false;
		if(result === 1){
			options = {result};
			this.handleBatchAuditKnowledge(options);
		}else{
			const { form:{validateFields} } = this.props;
			validateFields(['handleDescription'],(err, value) => {
				if (err) {
					this.isSubmit = true;
					return;
				}
				const { handleDescription } = value;
				options = {result,handleDescription};
				this.handleBatchAuditKnowledge(options);
			})
		}
	}

	//修改地址、业务类目
	formBatchUpdate = (type) => {
		if(!this.isSubmit){
			return
		}
		const { form:{validateFields} } = this.props;
		this.isSubmit = false;
		validateFields([type],(err, value) => {
			if (err) {
				this.isSubmit = true;
				return;
			}
			let options;
			if(type === 'sourceType'){
				const { selectedOnce } = this.state;
				const { serviceType,serviceTypeName } = selectedOnce;
				options = { serviceType,serviceTypeName,batchOperatorType:3 };
			}else{
				const { regionVal } = this.state;
				const { regionCode,regionShortName,regionFullName } = regionVal;
				options = { regionCode,regionFullName,regionName:regionShortName,batchOperatorType:4 };
			}
			this.handleBatchUpdate(options);
		})
	}

	//子集
	expandedRowRender = (datas) => {
		const { global } = this.props;
		const { childKnowledges=[],id } = datas;
		return(
			<div className={styles.childContent}>
				<span className={styles.onceSplit}></span>
				{
					childKnowledges.map((item,index) => {
						const { 
							flowCode,
							knowledgeAnswerVos=[],
							linkUrl,
							regionCode,
							regionName='全国',
							regionFullName,
							serviceTypeName='',
							sourceType,
							updateTime
						} = item;
						const _id = id + '_' + item.id;
						let answerTxt = '';
						knowledgeAnswerVos.map((item,index) => {
                            answerTxt += item.answer + '\n';
						})
						let sourceTxt = sourceType === 1 ? '系统' : '用户';
						let linekTxt = linkUrl ? linkUrl : '-';
						let content = this.setStateContent(item).btnContent;
						return(
							<div className={styles.onceBox} key={_id}>
								<div className={styles.leftBox}>
									<div className={styles.childOnce} style={{width:60}}></div>
									<div className={styles.onceSign} style={{width:220}}>
										{
											index ? (
												<div></div>	
											) : (<div className={styles.firstSign}><span></span></div>)
										}
										
									</div>
									<div className={styles.childOnce} style={{width:220}} title={answerTxt}>{answerTxt}</div>
									<div className={styles.childOnce} style={{width:160}} title={linekTxt}>{linekTxt}</div>
									<div className={styles.childOnce} style={{width:100}}>
										{
                                            regionName !== '全国' ? (
												<Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
													<span className={styles.regionName}>{regionName}</span>
												</Popover>
											) : (<span>{regionName}</span>)
                                        }
									</div>
									<div className={styles.childOnce} style={{width:100}} title={serviceTypeName}>{serviceTypeName}</div>
									<div className={styles.childOnce} style={{width:100}}>{sourceTxt}</div>
									<div className={styles.childOnce} style={{width:170}}>{updateTime}</div>
								</div>
								<div className={styles.rightBox} style={{width:105}}>{this.setStateContent(item).txt}</div>
								<div className={styles.onceBtnBox}>
									{
										content.map((val,index) => {
											const { type,name } = val;
											let btnObj;
											if(type === 'similar'){
												btnObj = '';
											}else
											if(type === 'delete'){
												btnObj = (<span key={index} className={styles.onceBtn} style={{color:'#ff4d4f'}} onClick={() => this.handleJurisdiction(type,item)}>{name}</span>);
											}else
											if(type === 'addSuccess' || type === 'effective'){
												btnObj = (<span key={index} className={styles.onceBtn} onClick={() => this.handleJurisdiction(type,item)}>{name}</span>);
											}else{
												btnObj = (<span key={index} className={styles.onceBtn} onClick={() => this.handleOpenDrawer(type,item,'answer',datas)}>{name}</span>)
											}
											return btnObj;
										})
									}
								</div>
							</div>
						)
					})
				}
			</div>
		);
	}

	//表格
	tableContent(){
		const { 
			dispatch,
			global,
			single,
			loading,
			getList,
			user,
			expandedRowKeys=[],
			selectedRowKeys=[],
			setSelectedRow
		} = this.props;
		const { knowledgeAuthority={} } = global;
		const { userdata={} } = user;
		const { userCode } = userdata;
		const { changeBtn,examineBtn } = knowledgeAuthority;
		const { singleSearch={},singleData,singlePageNum,singlePageSize=9 } = single;
		const { list=[],total } = singleData;
		const { updateTimeSort='desc' } = singleSearch;
		const columns = [
			{
				title: '标准问句',
				key: 'standard',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { question='' } = record;
					return(
						<span>{question}</span>
					)
				}
			},
			{
				title: '答案',
				key: 'answer',
				width:'15%',
				ellipsis:true,
				render: record => {
					let { id,childKnowledges=[],knowledgeAnswerVos=[] } = record;
					let answerTxt = '';
                    let btnTxt = '';
					let _index = -1;
					if(childKnowledges && childKnowledges.length){
                        _index = expandedRowKeys.findIndex((item) => item === id);
					    btnTxt = _index !== -1 ? '收起' : '多条答案展开';
                    }else{
                        knowledgeAnswerVos.map((item,index) => {
                            answerTxt += item.answer + '\n';
                        })
                    }
					return(
						<Fragment>
                            {
                                childKnowledges && childKnowledges.length ? (
                                    <span className={styles.answerBtn} onClick={() => this.handleMoreAnswer(id,_index)}>{btnTxt}</span>
                                ) : (<span title={answerTxt}>{answerTxt ? answerTxt.replace(/\\n/g, " \n") : ''}</span>)
                            }
							
						</Fragment>
					)
				}
			},
			{
				title: '链接',
				key: 'link',
				width:'10%',
				ellipsis:true,
				render: record => {
					let { linkUrl,childKnowledges=[] } = record;
					let txt = '';
					if(childKnowledges && childKnowledges.length){
						txt = '-';
					}else{
						txt = linkUrl ? linkUrl : '-';
					}
					return(
						<span title={txt}>{txt}</span>
					)
				}
			},
			{
				title: '地区',
				key: 'region',
				width:100,
				render: record => {
					const { childKnowledges=[],regionCode,regionName='全国',regionFullName='全国' } = record;
                    let txt = '';
                    if(childKnowledges && childKnowledges.length){
                        txt = '-'
                    }else{
                        txt = regionName;
                    }
					return(
						<Fragment>
                            {
                                regionName !== '全国' && txt !== '-' ? (
                                    <Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
                                        <span className={styles.regionName}>{regionName}</span>
                                    </Popover>
                                ) : (<span className={styles.moreTxt}>{txt}</span>)
                            }
                        </Fragment>
					)
				}
			},
			{
				title: '业务分类',
				key: 'business',
				ellipsis:true,
				width:100,
				render: record => {
					let { serviceTypeName='' } = record;
					return(
						<span title={serviceTypeName}>{serviceTypeName}</span>
					)
				}
			},
			{
				title: '来源',
				key: 'source',
				width:100,
				render: record => {
					let { sourceType=1 } = record;
					let sourceTxt = sourceType === 1 ? '系统' : '用户';
					return(
						<span>{sourceTxt}</span>
					)
				}
			},
			{
				title: '最近更新时间',
				key: 'updateTime',
				width:170,
				sorter:true,
				sortOrder:updateTimeSort === 'desc' ? 'descend' : 'ascend',
				sortDirections: ['descend', 'ascend'],
				render: record => {
					let { updateTime='' } = record;
					return(
						<span>{updateTime}</span>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width:350,
				render: record => {
					const { childKnowledges=[] } = record;
					let content = this.setStateContent(record).btnContent;
					let btnStyle = {marginRight:12};
					let onceType = 'all';
					if(childKnowledges && childKnowledges.length){
						onceType = 'question';
					}
					return (
						<Fragment>
							{
								content.map((item,index) => {
									const { type,name,isOpen } = item;
									let btnObj;
									if(type === 'detail' && onceType === 'question'){
										btnObj = '';
									}else
									// if(type === 'handle' && onceType === 'question'){
									// 	btnObj = '';
									// }else
									if(type === 'delete'){
										btnObj = (<Button key={index} type="danger" ghost style={btnStyle} onClick={() => this.handleJurisdiction(type,record)}>{name}</Button>);
									}else
									if(type === 'addSuccess' || type === 'effective'){
										btnObj = (<Button key={index} style={btnStyle} onClick={() => this.handleJurisdiction(type,record)}>{name}</Button>);
									}else{
										btnObj = (<Button key={index} style={type === 'history' ? {} : btnStyle} onClick={() => this.handleOpenDrawer(type,record,onceType)}>{name}</Button>)
									}
									return btnObj;
								})
							}
						</Fragment>
					)
				}
			},
			{
				title: '状态',
				key: 'state',
				width:105,
				render: record => {
					return(
						<div>{this.setStateContent(record).txt}</div>
					)
					
				}
			}
		]

		//二级
		const expandedRowRender = (record) => {
			return this.expandedRowRender(record);
		}

		//勾选
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				setSelectedRow(selectedRowKeys,selectedRows);
			}
		}
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list,
			onChange:this.handleTableChange,
			indentSize:0,
			expandedRowKeys,
			expandIcon:data => {
				return null
			},
			expandedRowRender,
			rowSelection:changeBtn || examineBtn || userCode === 'super_admin' ? rowSelection : null
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: singlePageNum,
	  		pageSize:singlePageSize,
	  		onChange: (current, pageSize) => {  
	  			dispatch({
					type:'single/setSinglePage',
					payload:{singlePageNum:current,singlePageSize:pageSize}
				})	
				setTimeout(() => {
					getList();
				})
	  		},
			total,
			custom:(
				<Fragment>
					{
						changeBtn ? (
							<Fragment>
								<Button style={{marginRight:12}} onClick={() => this.operationTip('open')}>
									启用
								</Button>
								<Button type="danger" ghost style={{marginRight:12}} onClick={() => this.operationTip('close')}>
									停用
								</Button>
							</Fragment>
						) : ''
					}
					{
						examineBtn ? (
							<Button style={{marginRight:12}} onClick={() => this.openModal('examine')}>审核</Button>
						) : ''
					}
					{
						changeBtn ? (
							<Fragment>
								<Button style={{marginRight:12}} onClick={() => this.openModal('sourceType')}>
									修改分类
								</Button>
								<Button style={{marginRight:12}} onClick={() => this.openModal('region')}>
									修改地区
								</Button>
							</Fragment>
						) : ''
					}
					{
						userCode === 'super_admin' ? (
							<Button type="danger" ghost style={{marginRight:12}} onClick={() => this.operationTip('delete')}>
								删除
							</Button>
						) : ''
					}
				</Fragment>
				
			)
		}
		
		return(
			<div className={styles.tableBox}>
				<TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
			</div>
		)
	}

	//弹窗
	modalContent(){
		const { visible,modalType } = this.state;
		const { form:{getFieldDecorator},knowledgeBase:{serviceList} } = this.props;
		let title='';
		let content='';
		let footerContent='';

		//业务分类
		const displayRender = (label) => {
			return label[label.length - 1];
		}
		
		//业务分类选择
		const handleServiceTypeChange = (val,selectedOptions=[]) => {
			let selectedOnce = {};
			if(selectedOptions.length){
				let onceData = selectedOptions[selectedOptions.length - 1];
				let { categoryCode=-1,categoryName } = onceData;
				selectedOnce = {serviceType:categoryCode,serviceTypeName:categoryName};
			}
			this.setState({selectedOnce});
		}

		//选择地区
		const handleRegionChange = (regionVal) => {
			const { form:{setFieldsValue} } = this.props;
			this.setState({regionVal},() => {
				setFieldsValue({batch_region:regionVal})
			});
		}

		if(modalType === 'examine'){
			title='是否确定批量审核多条数据';
			content=(
				<Form layout="inline" className={styles.formModalItem}>
					<Form.Item style={{width:'100%'}}>
						{getFieldDecorator('handleDescription', {
							rules: [{ required: true, message: '请选输入内容!' }],
						})(
							<TextArea rows={6} placeholder="若审核不通过，请填写原因" style={{width:'100%',resize:'none'}} />,
						)}
					</Form.Item>
				</Form>
			);
			footerContent=(
				<Fragment>
					<Button type="primary" style={{marginRight:12}} onClick={() => this.handleExamine(1)}>审核通过</Button>
					<Button style={{marginRight:12}} onClick={() => this.handleExamine(2)}>审核不通过</Button>
					<Button onClick={this.closeModal}>取消</Button>
				</Fragment>
			);
		}else
		if(modalType === 'sourceType'){
			title='是否确定批量修改业务分类';
			content=(
				<Form layout="inline" className={styles.formModalItem}>
					<Form.Item style={{width:'100%'}}>
						{getFieldDecorator('sourceType', {
							rules: [{ required: true, message: '请选择业务分类!' }],
						})(
							<Cascader
				        		placeholder='请选择业务分类' 
				        		getPopupContainer={triggerNode => triggerNode.parentNode}
							    options={serviceList}
							    expandTrigger="click"
							    fieldNames={{ label:'categoryName', value:'categoryCode', children:'children' }}
							    displayRender={displayRender}
							    onChange={handleServiceTypeChange}
							/>,
						)}
					</Form.Item>
				</Form>
			);
			footerContent=(
				<Fragment>
					<Button type="primary" style={{width:120,marginRight:48}} onClick={() => this.formBatchUpdate('sourceType')}>确定</Button>
					<Button style={{width:120}} onClick={this.closeModal}>取消</Button>
				</Fragment>
			);
		}else
		if(modalType === 'region'){
			title='是否确定批量修改地区';
			content=(
				<Form layout="inline" className={styles.formModalItem}>
					<Form.Item style={{width:'100%'}}>
						{getFieldDecorator('batch_region', {
							rules: [{ required: true, message: '请选择地区!' }],
						})(
							<Region 
								id='batch'
								initStatus='add' 
								onChange={handleRegionChange}
								{...this.props} 
							/>,
						)}
					</Form.Item>
				</Form>
			);
			footerContent=(
				<Fragment>
					<Button type="primary" style={{width:120,marginRight:48}} onClick={() => this.formBatchUpdate('batch_region')}>确定</Button>
					<Button style={{width:120}} onClick={this.closeModal}>取消</Button>
				</Fragment>
			);
		}
		return <FormModal 
			visible={visible} 
			title={title}
			content={content}
			footerContent={footerContent}
		/>
	}
	
	render(){
		return (
			<Fragment>
				{this.tableContent()}
				{this.modalContent()}
			</Fragment>
			
		)
	}
}

export default SingleTable;