import React, { Component } from 'react';
import { connect } from 'dva';
import {  Form,Pagination,Button } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import DetailModule from './components/DetailModule';
import styles from './history.less';

@connect(({ 
    historyPage,
    global
}) => ({
    msg:historyPage,
    global,
}))

@Form.create()

class History extends Component {

    state = {
        visible: false,
        detailVisible:false,
        sideInputArr: [],
        requestData: {
            order:0
        },
        pageNum: 1,
        loading:false,
        operateTypeArr:[
        	{val:'1',label:'新增'},
        	{val:'2',label:'修改'},
        	{val:'3',label:'审核'},
        	{val:'4',label:'处理'},
        	{val:'5',label:'启用'},
        	{val:'6',label:'停用'},
        	{val:'7',label:'申请新增'},
        	{val:'8',label:'申请关联相似'},
        	{val:'9',label:'忽略'},
        	{val:'10',label:'生效'}
        ],
        logTypeArr:[{val:'1',label:'知识库总览'},{val:'2',label:'未知问题'},{val:'3',label:'未解决问题'}],
        onceData:{}
    }

    componentDidMount() {
        this.getList()
    }
    
	//获取列表
	getList = () => {
		const { dispatch } = this.props;
        this.setState({loading:true});
		dispatch({
			type:'historyPage/getKnowledgeHistoryPage',
			payload:{
                "pageNum": this.state.pageNum,
                "pageSize": 10,
                ...this.state.requestData,
                productionId:this.props.global.productionId
            },
			callback:(res) => {
                this.setState({loading:false});
				let { success } = res;
				if(success){
				}
			}
		})	
	}
	
    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {},pageNum:1}, () => {
        	this.getList()
        	resetFields();
        })
    }
    
    // 搜索（查询按钮触发）
    searchValue = (data) => {
    	const { form:{validateFields} } = this.props;
    	validateFields(['time','operatePersonName','operatePersonNum','logType','operateType'],(err, values) => {
    		const { time=[],operatePersonName,operatePersonNum,logType,operateType } = values;
    		if(time && time.length){
	            values.startDate = time[0].format('YYYY-MM-DD');
	            values.endDate = time[1].format('YYYY-MM-DD');
	            delete(values['time'])
	        }
    		this.setState({ requestData: values ,pageNum:1 }, () => this.getList())
    	})
    }
    
    // 侧栏关闭事件
    drawerOnClose = () => {
        this.setState({ visible: false });
    }
    
    // 分页变化
    paginationFun = (pageNum) => {
        this.setState({ pageNum },()=>{ this.getList()})
    }
    
    //打开查看
    handleIntoDetail = (onceData) => {
    	this.setState({detailVisible:true,onceData});
    }
    
    //关闭查看
    handleClose = () => {
    	this.setState({detailVisible:false,onceData:{}});
    }
    
    //抽屉
	drawerModule(){
		const { onceData,detailVisible } = this.state;
		const drawerOptions = {
			size:'large',
			content:(<DetailModule onceData={onceData} {...this.props} />),
			onCancel:this.handleClose,
			isOk:false
		}
		const drawerProps = {
			title:'知识管理/历史记录',
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible:detailVisible
		}
		return(
			<DrawerMount  
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}
	
	searchModule(){
		const { logTypeArr, operateTypeArr  } = this.state;
		const searchList = [
			{
				type:'RangePicker',
				id:'time',
				domOptions:{placeholder:'操作时间'},
				domStyle:{width: 250}
			},
			{
				type:'Input',
				id:'operatePersonName',
				domOptions:{placeholder:'操作人姓名'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'operatePersonNum',
				domOptions:{placeholder:'操作人工号'},
				domStyle:{width: 150},
				iconType:'edit'
			},
			{
				type:'Select',
				id:'logType',
				domOptions:{placeholder:'操作来源'},
				domStyle:{width: 120},
				optionList:logTypeArr,
				valueName:'val',
				labelName:'label'
			},
			{
				type:'Select',
				id:'operateType',
				domOptions:{placeholder:'操作类型'},
				domStyle:{width: 120},
				optionList:operateTypeArr,
				valueName:'val',
				labelName:'label'
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
	
	tableModule(){
		const { loading, operateTypeArr } = this.state;
		const { historyPage={} } = this.props.msg;
		const { total=0, pageNum, pageSize,list=[] } = historyPage;
        const columns = [
            { title: '操作时间', dataIndex: 'createTime', key: 'createTime',ellipsis:true,  width:'280px' },
            { title: '操作人姓名', dataIndex: 'operatePersonName', key: 'operatePersonName',ellipsis:true, width:'220px'  },
            { title: '操作人工号', dataIndex: 'operatePersonNum', key: 'operatePersonNum',ellipsis:true, width:'200px'  },
            { title: '操作', dataIndex: 'operateType', key: 'operateType',width:'200px',ellipsis:true ,render:(text)=>{
                return operateTypeArr[text-1].label
            } },
            { title: '标准问句', dataIndex: 'question', key: 'question',ellipsis:true  },
            { title: '内容', dataIndex: 'afterContent', key: 'afterContent',render:(text,record)=>{
                return <Button onClick={() => this.handleIntoDetail(record)}>查看</Button>
            } }
        ]
        
        const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: 10,
	  		onChange: this.paginationFun,
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}
    
    render() {
        const { total, pageNum, pageSize,list } = this.props.msg.historyPage
        const { loading, logTypeArr, operateTypeArr  } = this.state
        
        return (
            <div style={{width:'100%'}}>
                {this.searchModule()}
                {this.tableModule()}
                {this.drawerModule()}
            </div>
        )
    }
}

export default History;