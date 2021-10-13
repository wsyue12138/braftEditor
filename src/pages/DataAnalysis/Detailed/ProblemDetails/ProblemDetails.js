import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Drawer, Icon, Popover,Table } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import Region from '@components/Region';
import SideForm from './components/SideForm';
import ProcedureModule from '../../../KnowledgeManagement/KnowledgeBase/Multiple/components/ProcedureModule';
import styles from './ProblemDetails.less';

// 问题明细查询
@connect(({
    dataStatistics,
    global,
    multiple,
    knowledgeBase,
    region
}) => ({
    dataStatistics,
    global,
    multiple,
    knowledgeBase,
    region
}))

@Form.create()

class ProblemDetails extends Component {

    state = {
        visible: false,
        sideInputArr: [],
        requestData: {
            order: 0
        },
        pageNum: 1,
        sortOrderAllConsult: 'descend',
        sortOrderStar: false,
        expandedRowKeys:[],
        regionVal:undefined
    }

    componentDidMount() {
        this.isSubmit = true;
        this.getList()
        this.getCategoryTreeByProduct()
    }
    // 获取列表
    getList = () => {
        const { dispatch } = this.props;
        this.setState({ loading: true });
        dispatch({
            type: 'dataStatistics/qaDetail',
            payload: {
                appid: this.props.global.appid,
                "pageNum": this.state.pageNum,
                "pageSize": 10,
                ...this.state.requestData
            },
            callback:(res) => {
                this.setState({ loading: false,expandedRowKeys:[] });
            }
        })
    }

    //获取业务分类
    getCategoryTreeByProduct = () => {
        const { global: { productionId } } = this.props;
        const { dispatch } = this.props;
        dispatch({
            type: 'knowledgeBase/fetchGetCatagoryTree',
            payload: { productionId }
        })
    }

    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {}, pageNum: 1 }, () => {
        	this.getList()
        	resetFields();
        })
    }

    // 搜索（查询按钮触发）
    searchValue = (data) => {
        const { regionVal } = this.state;
        const { form:{validateFields} } = this.props;
		validateFields(['group','type','question'],(err, values) => {
			const { group,type,question } = values;
			const requestData = {
				group:this.handleServiceTypeChange(group),
				type,
                question,
                regionCode:regionVal ? regionVal.regionCode : undefined
            }
			this.setState({ requestData, pageNum: 1 }, () => this.getList())
		})
    }

    // 侧栏关闭事件
    drawerOnClose = () => {
        this.setState({ visible: false });
    }

    // 分页变化
    paginationFun = (pageNum) => {
        this.setState({ pageNum }, () => { this.getList() })
    }

    seeClick = (e) => {
        this.setState({ parentId: e.id, visible: true, record: e, operateType: '查看' })
    }

    changeSort = (pagination, filters, sorter) => {
        this.state.pageNum = 1
        if (sorter.field == 'star') {
            switch (this.state.sortOrderStar) {
                case 'ascend':
                    this.setState({ sortOrderStar: 'descend', sortOrderAllConsult: false, })
                    this.state.requestData.order = 2
                    break;

                case 'descend':
                    this.setState({ sortOrderStar: 'ascend', sortOrderAllConsult: false })
                    this.state.requestData.order = 3
                    break;

                case false:
                    if (this.state.requestData.order) {
                        this.setState({ sortOrderStar: 'descend', sortOrderAllConsult: false })
                        this.state.requestData.order = 2
                    } else {
                        this.setState({ sortOrderStar: 'ascend', sortOrderAllConsult: false })
                        this.state.requestData.order = 1
                    }
                    break;
            }
        } else if (sorter.field == "allConsult") {
            switch (this.state.sortOrderAllConsult) {
                case 'ascend':
                    this.setState({ sortOrderAllConsult: 'descend', sortOrderStar: false })
                    this.state.requestData.order = 0
                    break;

                case 'descend':
                    this.setState({ sortOrderAllConsult: 'ascend', sortOrderStar: false })
                    this.state.requestData.order = 1
                    break;

                case false:
                    if (this.state.requestData.order == 2) {
                        this.setState({ sortOrderAllConsult: 'ascend', sortOrderStar: false })
                        this.state.requestData.order = 1
                    } else {
                        this.setState({ sortOrderAllConsult: 'descend', sortOrderStar: false })
                        this.state.requestData.order = 0
                    }
                    break;
            }
        }
        this.getList()
    }

    //业务分类
	displayRender = (label,selectedOptions) => {
		return label[label.length - 1];
	}

	//业务分类选择
	handleServiceTypeChange = (selectedOptions=[]) => {
		if(selectedOptions.length){
			let onceData = selectedOptions[selectedOptions.length - 1];
			return onceData;
		}else{
			return undefined;
		}
    }

    //选择地区
	handleRegionChange = (regionVal) => {
		this.setState({regionVal});
	}
    
    //展开、收起答案
	handleMoreAnswer = (id,_index) => {
		const { expandedRowKeys=[] } = this.state;
		const newList = [...expandedRowKeys];
		if(_index !== -1){
			newList.splice(_index,1); 
		}else{
			newList.push(id);
        }
		this.setState({expandedRowKeys:newList});
	}

    searchModule(){
    	const { knowledgeBase={} } = this.props;
    	const { serviceList } = knowledgeBase;
    	const searchList = [
            {
				type:'Input',
                id:'question',
                onceStyle:{width: 180},
				domOptions:{placeholder:'标准问句'},
				iconType:'edit'
			},
            {
				type:'Dom',
				id:'search_region',
				onceStyle:{width: 180},
				custom:(
					<Region 
                        id='search'
                        regionType={3}
						initStatus='add'
						placeholder='地区' 
						onChange={this.handleRegionChange}
						{...this.props} 
					/>
				)
			},
    		{
				type:'Cascader',
				id:'group',
				domOptions:{
					options:serviceList,
					allowClear:true,
					expandTrigger:"click",
					fieldNames:{ label:'categoryName', value:'categoryName', children:'children' },
					placeholder:'业务分类',
					displayRender:this.displayRender
				}
            },
			{
				type:'Select',
				id:'type',
				domOptions:{placeholder:'对话类型'},
				domStyle:{width:180},
				optionList:[{val:'QA型'},{val:'任务型'}],
				valueName:'val',
				labelName:'val'
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.searchValue}
			},
			{
				type:'Button',
				btnTitle:'重置',
				iconType:'sync',
				domOptions:{onClick:this.resetRequestData}
			}
    	]
    	return <SearchForm {...this.props} searchList={searchList} />
    }

    //二级表格
    expandedRowRender = (datas) => {
        const { children=[],id } = datas;
        return(
			<div className={styles.childContent}>
				<span className={styles.onceSplit}></span>
                {
                    children.map((item,index) => {
                        const { 
                            question='',
                            knowledgeAnswerVos=[],
                            regionCode,
                            regionName='全国',
                            regionFullName='',
                            group='',
                            allConsult=0,
                            like=0,
                            star=0,
                            type=''
                        } = item;
                        const _id = id + '_' + item.id;
                        let starArr = []
                        for (var i = 0; i < star; i++) {
                            starArr.push(<Icon type="star" key={'star' + i} theme="filled" className={styles.star} />)
                        }
                        
                        return(
                            <div className={styles.onceBox} key={_id}>
                                <div className={styles.onceSign} style={{width:'10%'}}>
                                    {
                                        index ? (
                                            <div></div>
                                        ) : (<div className={styles.firstSign}><span></span></div>)
                                    }
                                </div>
                                <div className={styles.childOnce} style={{width:'14%'}}>{question}</div>
                                <div className={styles.childOnce} style={{width:'13%'}}>
                                    <Button className={styles.btn} onClick={() => this.seeClick(item)}>查看</Button>
                                </div>
                                <div className={styles.childOnce} style={{width:'10%'}}>
                                    {
                                        regionName !== '全国' ? (
                                            <Popover placement="bottomLeft" title='' content={regionFullName} trigger="hover">
                                                <span className={styles.regionName}>{regionName}</span>
                                            </Popover>
                                        ) : (<span>{regionName}</span>)
                                    }
                                </div>
                                <div className={styles.childOnce} style={{width:'10%'}}>{group}</div>
                                <div className={styles.childOnce} style={{width:'13%'}}>{like}</div>
                                <div className={styles.childOnce} style={{width:'10%'}}>{allConsult}</div>
                                <div className={styles.childOnce} style={{width:'10%'}}>
                                    <div className={styles.starArr}>
                                        {starArr}
                                    </div>
                                </div>
                                <div className={styles.childOnce} style={{width:'10%'}}>{type}</div>
                            </div>
                        )
                    })
                }
			</div>
		);
    }

    tableModule(){
    	const { loading,listData,sortOrderAllConsult,sortOrderStar,expandedRowKeys=[] } = this.state;
    	const { dataStatistics:{ qaDetail },knowledgeBase:{serviceList} } = this.props;
        const { total=0, pageNum, list=[] } = qaDetail;

        const columns = [
            { 
                title: '排名序号',
                dataIndex: 'order', 
                key: 'order', 
                ellipsis: true, 
                width: '10%'
            },
            { 
                title: '标准问句', 
                dataIndex: 'question', 
                key: 'question', 
                ellipsis: true,
                width: '14%'
            },
            {
                title: '答案', 
                dataIndex: 'operation', 
                width: '13%',
                render: (text, record, index) => {
                    let { id,children=[] } = record;
                    let btnTxt = '';
                    let _index = -1;
                    if(children && children.length){
                        _index = expandedRowKeys.findIndex((item) => item === id);
					    btnTxt = _index !== -1 ? '收起' : '多条答案展开';
                    }
                    return(
                        <Fragment>
                            {
                                children && children.length ? (
                                    <span className={styles.answerBtn} onClick={() => this.handleMoreAnswer(id,_index)}>{btnTxt}</span>
                                ) : (<Button className={styles.btn} onClick={() => this.seeClick(record)}>查看</Button>)
                            }
							
						</Fragment>
                    ) 
                }
            },
            {
				title: '地区',
				key: 'region',
				width: '10%',
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
                dataIndex: 'group', 
                key: 'group', 
                ellipsis: true, 
                width: '10%'
            },
            { 
                title: '相似问句', 
                dataIndex: 'like', 
                key: 'like', 
                width: '13%',
                ellipsis: true 
            },
            { 
                title: '咨询量', 
                dataIndex: 'allConsult', 
                key: 'allConsult', 
                ellipsis: true, 
                sorter: true, 
                sortOrder: sortOrderAllConsult,
                width: '10%' 
            },
            {
                title: '热度', 
                dataIndex: 'star', 
                key: 'star', 
                ellipsis: true, 
                sorter: true, 
                sortOrder: sortOrderStar,
                width: '10%',
                render: (text, record, index) => {
                    let starArr = []
                    for (var i = 0; i < text; i++) {
                        starArr.push(<Icon type="star" key={'star' + i} theme="filled" className={styles.star} />)
                    }
                    return <div className={styles.starArr}>
                        {starArr}
                    </div>
                }
            },
            { 
                title: '对话类型', 
                dataIndex: 'type', 
                key: 'type', 
                ellipsis: true,
                width: '10%' 
            }
        ]

        //二级
		const expandedRowRender = (record) => {
			return this.expandedRowRender(record);
		}
        
        const tableOptions = {
			onceKey:'id',
			loading,
			columns,
			dataSource:list,
			sortOrderAllConsult:sortOrderAllConsult,
            sortOrderStar:sortOrderStar,
            expandedRowKeys,
            onChange:this.changeSort,
            childrenColumnName:'childrenList',
            expandIcon:data => {
				return null
            },
            expandedRowRender,
        }

		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: 10,
	  		onChange: this.paginationFun,
	  		total
		}

		return (
            <div style={{width:'100%'}}>
                <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
            </div>
        )
    }

    render() {
        const {  } = this.state;
        const { visible,operateType,loading,listData,sortOrderAllConsult,sortOrderStar,expandedRowKeys=[] } = this.state;
    	const { dataStatistics:{ qaDetail },knowledgeBase:{serviceList} } = this.props;
        const { total=0, pageNum, list=[] } = qaDetail;
        return (
            <div style={{width:'100%'}} className={styles.problemDetails}>
                {this.searchModule()}
                {this.tableModule()}
                {/* 抽屉 */}
                <Drawer
                    visible={visible}
                    onClose={this.drawerOnClose}
                    maskClosable={false}
                    closable={false}
                    title={<div className={styles.drawer_title}><span className={styles.circular}></span> 问题明细查询 / {operateType}</div>}
                    headerStyle={{ height: '55px' }}
                    drawerStyle={{ height: '100%' }}
                    bodyStyle={{ height: 'calc(100% - 55px)', overflow: 'hidden', padding: 0 }}
                    width='1230'
                    getContainer={false}
                    destroyOnClose={true}
                >
                    {
                        visible ?
                            (
                                this.state.record.type == 'QA型' ?
                                    <SideForm
                                        sequence={this.state.record.sequence}
                                    />
                                    : 
                                     <ProcedureModule {...this.props} readonly={true} parentId={this.state.parentId} />

                            )
                            : null
                    }
                    <div className={styles.button_div}>
                        <Button onClick={() => this.setState({ visible: false })}>返回</Button>
                    </div>
                </Drawer>
            </div>
        )
    }
}

export default ProblemDetails;
