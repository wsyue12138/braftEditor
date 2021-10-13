import React, { Component,Fragment } from 'react'
import { connect } from 'dva';
import { Table } from 'antd';
import styles from './SideForm.less'


// 问题明细查询
@connect(({
    dataStatistics,
    global,
    multiple
}) => ({
    msg: dataStatistics,
    global,
    multiple
}))

class SideForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        this.getSingleKnowledgePages()
    }
    getSingleKnowledgePages = () => {
        const { dispatch, sequence: knowledgeCode, global: { productionId } } = this.props
        dispatch({
            type: 'dataStatistics/getSingleKnowledgePages',
            payload: {
                productionId,
                knowledgeCode
            },
            callback: (res) => {
                if (res.success) {
                    const { data: { data: dataSource } } = res
                    this.setState({ loading: false, dataSource })
                } else {
                    this.setState({ loading: false, dataSource: [] })
                }
            }
        })
    }
    expandedRowRender = (record) => {
        const columns = [
            { title: '答案顺序', dataIndex: 'answerOrder',width:'25%', key: 'answerOrder', ellipsis: true, },
            {
                title: '答案', dataIndex: 'answer',width:'75%', key: 'answer', render: (text, record) => {
                    return <span title={text}>{text ? text.replace(/\\n/g, " \n") : ''}</span>
                }
            }
        ];
        const { childKnowledgeList } = record
        return <Table columns={columns} rowKey={record => `child${record.id}`} dataSource={childKnowledgeList} pagination={false} />;
    };

    //构造答案
    setAnswerHtml = (data) => {
        let answerTxt = '';
        const setAnsers = (answers) => {
            return(
                <Fragment>
                    {
                        answers && answers.map((i,_index) => {
                            answerTxt += i.answer + '\n';
                            return(
                                <div key={_index}>{i.answer}</div>
                            )
                            
                        })
                    }
                </Fragment>
            )
        }
        const answerContent = (
            <Fragment>
                {
                    data.childKnowledges && data.childKnowledges.length ? (
                        <Fragment>
                            {
                                data.childKnowledges.map((item,index) => {
                                    const { knowledgeAnswerVos=[] } = item;
                                   return setAnsers(knowledgeAnswerVos)
                                })
                            }
                        </Fragment>
                    ) : setAnsers(data.knowledgeAnswerVos)
                }
            </Fragment>
        )
        const obj = {
            answerTxt,
            answerContent:answerTxt ? answerContent : ''
        }
        return obj;
    }

    render() {
        const { loading, dataSource } = this.state
        const columns = [
            { title: '标准问句', dataIndex: 'question', key: 'question', ellipsis: true, },
            {
                title: '相似问句', dataIndex: 'knowledgeSimilarVos', key: 'knowledgeSimilarVos', ellipsis: true, render: text => text.length
            },
            {
                title: '答案', dataIndex: 'answer', key: 'answer', render: (text, record) => {
                    const answerObj = this.setAnswerHtml(record);
                    return <div title={answerObj.answerTxt}>{answerObj.answerContent}</div>
                }
            },
            { title: '状态', dataIndex: 'knowledgeStatus', key: 'knowledgeStatus', ellipsis: true, render: text => text ? '启用' : '停用' },
        ]
        return (
            <div className={styles.sideForm}>
                <Table
                    className={styles.table}
                    loading={loading}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowKey={record => record.id}
                    rowClassName={record => {
                        const { childKnowledgeList = [] } = record;
                        let name = childKnowledgeList.length ? '' : styles.noExpand;
                        return name;
                    }}
                    expandedRowRender={record => {
                        const { childKnowledgeList = [] } = record
                        let expandedRowRender = childKnowledgeList.length ? this.expandedRowRender(record) : null;
                        return expandedRowRender
                    }}
                // onExpand={this.onExpand}
                />
            </div>
        )
    }
}

export default SideForm;