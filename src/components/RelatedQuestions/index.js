import React,{ Component,Fragment } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Icon,
  Button,
  Popover
} from 'antd';
import TableContent from '@components/TableContent';
import styles from './style.less';

@Form.create()

class RelatedQuestions extends Component{

	state = {
        loading:false,
        similarData:{},
        searchData:{},
        expandedRowKeys:[],
		pageNum:1,
		pageSize:10
	}

	componentDidMount(){
		this.isSubmit = true;
		this.getList();
	}

	componentWillUnmount(){

	}

	//获取列表
	getList = () => {
        const { searchData,pageNum,pageSize } = this.state;
		const { dispatch,global:{productionId} } = this.props;
		let payload = {...searchData,pageNum,pageSize,productionId};
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
					this.setState({similarData,loading:false});
				}
				this.isSubmit = true;
			}
		})
	}

	//关联相似
	associationSimilarity = (similarOnce) => {
		const { handleSimilarClose } = this.props;
		handleSimilarClose(1,similarOnce);
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
		const { form:{getFieldDecorator} } = this.props;
		return(
			<div className={styles.searchContent}>
				<Row>
					<Form layout="inline">
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
                       	const { knowledgeAnswerVos=[],regionCode,regionName='',regionFullName='' } = item;
                       	const _id = id + '_' + item.id;
                       	let answerTxt = '';
                       	knowledgeAnswerVos.map((item,index) => {
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
                                            regionCode ? (
                                                <Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
                                                    {regionName}
                                                </Popover>
                                            ) : regionName
                                        }
                                    </div>
                                    <div className={styles.childOnce} style={{width:120}}>{this.setStateContent(item)}</div>
                                    <div className={styles.childOnce} style={{width:200}}></div>
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
                title: '地区',
				key: 'region',
				width:120,
				render: record => {
                    const { childKnowledges=[],regionCode,regionName='全国',regionFullName } = record;
                    let txt = '';
                    if(childKnowledges && childKnowledges.length){
                        txt = '-'
                    }else{
                        txt = regionName;
                    }
					return(
						<Fragment>
                            {
                                regionCode && txt !== '-' ? (
                                    <Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
                                        {regionName}
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
					const { flowCode,knowledgeStatus='' } = record;
					return <Button onClick={() => this.associationSimilarity(record)}>关联</Button>
				}
			}
        ]

        const expandedRowRender = (record) => {
            console.log(record)
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

	render(){
		return(
			<div className={styles.similar}>
				{this.searchContent()}
				{this.tableContent()}
			</div>
		)
	}
}

export default RelatedQuestions;
