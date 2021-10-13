import React,{ Component,Fragment } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Popover,
  Modal,
  message
} from 'antd';
import DrawerMount from '@components/DrawerMount';
import TableContent from '@components/TableContent';
import styles from './style.less';

@Form.create()

class SimilarModule extends Component{

	state = {
        loading:false,
        similarData:{},
        searchData:{},
        detailData:{},
        expandedRowKeys:[],
		pageNum:1,
		pageSize:10,
		visible:false
	}

	componentDidMount(){
		this.isSubmit = true;
		this.getList();
	}

	componentWillUnmount(){
		const { unmountCallback } = this.props;
		unmountCallback && unmountCallback();
	}

	//获取列表
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { dispatch,productionId,currentKnowledgeId } = this.props;
		let payload = {...searchData,pageNum,pageSize,productionId,currentKnowledgeId};
		this.setState({loading:true});
		dispatch({
			type:'single/fetchGetSimilarKnowledgePage',
			payload,
			callback:(res) => {
				let { success } = res;
				if(success){
                    const { total=0,data=[] } = res.data;
                    const similarData = { 
                        total,
                        list:data 
                    };
					this.setState({similarData,loading:false,expandedRowKeys:[]});
				}
				this.isSubmit = true;
			}
		})
	}

	//关联相似
	associationSimilarity = (data) => {
		if(!this.isSubmit){
			return false
		}
		this.isSubmit = false;
        const { dispatch,productionId,onceData,form,getList,handleBoxClose,type } = this.props;
        const addQuestion = form.getFieldValue('addQuestion');
        let requestUrl = '';
		let payload = {
			productionId
        }
        if(type === 'single'){
            payload.associationId = data.id;
            payload.id = onceData.id;
            payload.question = addQuestion;
            requestUrl = 'single/fetchAssociateSimilarKnowledge';
        }else
        if(type === 'unknownQuestion'){
            const { unQuestion='' } = onceData;
            payload.unQuestionid = onceData.id;
            payload.id = data.id;
            payload.inQuestion = unQuestion;
            payload.similarQuestion = addQuestion;
            requestUrl = 'unknownQuestion/fetchRelateKnowledge';
        }else
        if(type === 'unresolvedQuestion'){
            const { unQuestion='' } = onceData;
            payload.unQuestionid = onceData.id;
            payload.id = data.id;
            payload.inQuestion = unQuestion;
            payload.similarQuestion = addQuestion;
            requestUrl = 'unresolvedQuestion/fetchRelateKnowledge';
		}
		dispatch({
			type:requestUrl,
			payload,
			callback:(res) => {
				let { success,code } = res;
				if(success){
					message.success('关联成功');
					handleBoxClose();
					getList();
				}else{
					if(code === 11011){
						message.error('暂无权限');
					}else
					if(code === 11024){
						message.error('操作冲突');
					}else{
						message.error('关联失败');
					}
				}
				this.isSubmit = true;
			}
		})
	}

	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['similar_question','similar_answer'],(err, values) => {
			const { similar_question='',similar_answer='' } = values;
			let searchData = {
				question:similar_question,
				answer:similar_answer
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}

	//查看
	handleIntoDetail = (detailData) => {
		const { intoDetailCallback } = this.props;
		intoDetailCallback && intoDetailCallback(detailData);
		this.setState({visible:true,detailData});
	}

	//关联
	handleRelation = (data) => {
		Modal.confirm({
    		title:'是否确认关联',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.associationSimilarity(data);
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
	}

	//关闭抽屉
	handleClose = () => {
		this.setState({visible:false});
	}

	//状态设置
	setStateContent = (record) => {
		const { flowCode,knowledgeStatus='' } = record;
		let txt ;
		switch (flowCode){
			case '-1':
				txt = knowledgeStatus ? '启用' : '停用';
				break;
			case '1000':
				txt = '待审核';
				break;
			case '1001':
				txt = '审核通过';
				break;
			case '1002':
				txt = '操作中';
				break;
			case '1003':
				txt = '待生效';
				break;
			default:
				txt = '待变更';
				break;
		}
		return txt;
	}

	//搜索部分
	searchContent(){
		const { form:{getFieldDecorator},questionContent='',type } = this.props;
		let questionTitle = '';
		if(type === 'single'){
			questionTitle = '用户添加问句';
        }else
        if(type === 'unknownQuestion'){
            questionTitle = '未知问题';
        }else
        if(type === 'unresolvedQuestion'){
            questionTitle = '未解决问题';
        }
		return(
			<div className={styles.searchContent}>
				<Row>
					<Form layout="inline">
						<Col span={24} style={{marginBottom:20}}>
							<Form.Item label={questionTitle}>
						        {getFieldDecorator('addQuestion',{
						        	initialValue:questionContent
						        })(
						        	<Input placeholder="请输入问句" style={{width:415}} />
						        )}
						    </Form.Item>
					    </Col>
					    <Col span={8} className={styles.searchOnce}>
							<Form.Item style={{width:'100%'}}>
						        {getFieldDecorator('similar_question',{
						        	initialValue:''
						        })(
						        	<Input placeholder="标准问句" style={{width:'100%'}} />
						        )}
						    </Form.Item>
					    </Col>
					    <Col span={10} className={styles.searchOnce}>
							<Form.Item style={{width:'100%'}}>
						        {getFieldDecorator('similar_answer',{
						        	initialValue:''
						        })(
						        	<Input placeholder="答案" style={{width:'100%'}} />
						        )}
						    </Form.Item>
					    </Col>
					    <Col span={6}>
							<Form.Item>
						       	<Button type="primary" onClick={this.handleSearch}>
			          				查询
			          				<Icon type="search" />
			          			</Button>
						    </Form.Item>
					    </Col>
					</Form>
				</Row>
			</div>
		)
    }
    
    //展开、收起答案
	handleMoreAnswer = (id,_index) => {
		const { expandedRowKeys=[] } = this.state;
		const list = [...expandedRowKeys];
		if(_index !== -1){
			list.splice(_index,1); 
		}else{
			list.push(id);
		}
		this.setState({expandedRowKeys:list});
	}

    //子集
    expandedRowRender = (datas) => {
		const { childKnowledges=[],id } = datas;
        return(
            <div className={styles.childContent}>
				<span className={styles.onceSplit}></span>
				{
					childKnowledges.map((item,index) => {
						const { knowledgeAnswerVos=[],regionName='',regionFullName='' } = item;
                       	const _id = id + '_' + item.id;
                       	let answerTxt = '';
                       	knowledgeAnswerVos.map((item) => {
                            answerTxt += item.answer + '\n';
                        })
						return(
							<div className={styles.onceBox} key={_id}>
								<div className={styles.leftBox}>
									<div className={styles.onceSign} style={{width:150}}>
										{
                                            index ? (
                                                <div></div>
                                            ) : (<div className={styles.firstSign}><span></span></div>)
                                        }
									</div>
								</div>    
								<div className={styles.rightBox} style={{width:440}}>
									<div className={styles.childOnce} style={{width:120}}>
										{
                                            regionName !== '全国' ? (
												<Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
													<span className={styles.regionName}>{regionName}</span>
												</Popover>
											) : (<span>{regionName}</span>)
                                        }
									</div>
									<div className={styles.childOnce} style={{width:120}}>{this.setStateContent(item)}</div>
									<div className={styles.childOnce} style={{width:200}}>
										<span className={styles.onceBtn} onClick={() => this.handleIntoDetail(item)}>查看</span>
									</div>
								</div>
								<div className={styles.onceBtnBox}>
									<div className={styles.answerTxt} title={answerTxt}>{answerTxt}</div>
								</div>
							</div>
						)
					})
				}
			</div>
        )
    }

	//列表部分
	tableContent(){
		const { loading,expandedRowKeys=[],similarData={},pageNum,pageSize } = this.state;
		const { list=[],total=0 } = similarData;
		const columns = [
			{
				title: '标准问句',
				key: 'similar',
                width:150,
                ellipsis:true,
				render: record => {
					let { question='' } = record;
					return(
						<span title={question}>{question}</span>
					)
				}
			},
			{
				title: '答案',
				key: 'answer',
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
                        knowledgeAnswerVos.map((item) => {
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
                title: '地区',
				key: 'region',
				width:120,
				render: record => {
                    const { childKnowledges=[],regionName='全国',regionFullName } = record;
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
				title: '状态',
				key: 'knowledgeStatus',
				width:120,
				render: record => {
					return(
						<div>{this.setStateContent(record)}</div>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width:200,
				render: record => {
					const { flowCode,knowledgeStatus='',childKnowledges=[] } = record;
					return(
						<Fragment>
							{
								childKnowledges && childKnowledges.length ? '' : (
									<Button style={{marginRight:12}} onClick={() => this.handleIntoDetail(record)}>查看</Button>
								)
							}
							{
								flowCode === '-1' && knowledgeStatus ? (
									<Button onClick={() => this.handleRelation(record)}>关联</Button>
								) : ''
							}
						</Fragment>
					)
				}
			}
        ]

        const expandedRowRender = (record) => {
			return this.expandedRowRender(record);
		}
        
        const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list,
			expandedRowKeys,
			expandIcon:data => {
				return null
			},
			expandedRowRender
		}
		
		const pageOptions = {
            defaultCurrent: 1,
      		defaultPageSize: 10,
      		showQuickJumper: true,
      		hideOnSinglePage: true,
      		current: pageNum,
      		pageSize: pageSize,
			totalShow:false,
	  		onChange: (current, pageSize) => {  
                this.setState({pageNum:current,pageSize},() => {
                    this.getList()
                })
	  		},
	  		total
        }
        
		return(
			<div className={styles.tableContent}>
                <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
			</div>
		)
	}

	//抽屉
	drawerContent(){
        const { visible,detailData } = this.state;
        const { DetailModule='',type } = this.props;
		let drawerOptions = {
			content:<DetailModule {...this.props} datas={detailData} />,
			onCancel:this.handleClose,
			isOk:false,
		}
		let drawerTitle = '';
		if(type === 'single'){
			drawerTitle = '知识库管理';
        }else
        if(type === 'unknownQuestion'){
            drawerTitle = '未知问题';
        }else
        if(type === 'unresolvedQuestion'){
            drawerTitle = '未解决问题';
        }
		let drawerProps = {
			title:`${drawerTitle}/关联相似/查看`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount drawerProps={drawerProps} {...drawerOptions} />
		)
	}

	render(){
		return(
			<div className={styles.similar}>
				{this.searchContent()}
				{this.tableContent()}
				{this.drawerContent()}
			</div>
		)
	}
}

export default SimilarModule;
