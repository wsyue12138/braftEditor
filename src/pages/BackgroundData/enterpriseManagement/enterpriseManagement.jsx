import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form,Button, Modal,message } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';
import styles from './enterpriseManagement.less';

@connect(({ enterpriseManagement,productManagement,user }) => ({
    msg: enterpriseManagement,
    productManagement,
	user
}))

@Form.create()

class EnterpriseManagement extends Component {

    state = {
        visible: false,
        sideInputArr: [],
        requestData: {},
        pageNum: 1,
        drawerType:'',
        onceData:{}
    }

    componentDidMount() {
		this.isSubmit = true;
        this.getList();
        this.getKnowledgeProject();
    }

    onRef = (ref) => {
        this.child = ref
    }
    
    // 获取列表
    getList = () => {
        const { dispatch } = this.props;
        this.setState({loading:true});
        dispatch({
            type: 'enterpriseManagement/fetchGetCompanyList',
            payload: {
                "pageNum": this.state.pageNum,
                "pageSize": 9,
                ...this.state.requestData
            },
			callback:(res) => {
				this.setState({loading:false});
			}
        })
    }

    //获取产品下的知识项目列表
    getKnowledgeProject = () => {
        this.props.dispatch({
            type: 'productManagement/fetchGetKnowledgeProject',
            payload: { productionId: '' }
        })
    }
    
    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {},pageNum:1 }, () => {
        	this.getList();
        	resetFields();
        })
    }
    
    // 搜索（查询按钮触发）
    searchValue = () => {
    	const { form:{validateFields} } = this.props;
    	validateFields(['search_id','search_companyName','search_userName','search_productName'],(err, values) => {
    		const { search_id,search_companyName,search_userName,search_productName } = values;
    		let id = undefined;
    		if(search_id){
	            let num = parseInt(search_id);
	            if (!isNaN(num)){
	                id = num;
	            }
	        }
    		const requestData = {
    			id,
    			companyName:search_companyName,
    			userName:search_userName,
    			productName:search_productName
    		}
    		this.setState({ requestData,pageNum:1 }, () => this.getList());
    	})
    }

    //保存数据
    handleSave = () => {
        this.child.handleSave(() => {
            this.setState({visible:false,onceData:{},drawerType:''},() => {
                this.getList();
            });
        })
    }

    //关闭弹窗
    handleClose = () => {
        this.setState({visible:false,onceData:{},drawerType:''});
    }
    
    handleResetPwd=(record)=>{
        if(!this.isSubmit){
			return false;
        }
        
		this.isSubmit = false;
		Modal.confirm({
    		title:'是否确认重置密码，重置后密码将初始化',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			this.resetPassword(record.userId)
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
    }
    
    resetPassword=(id)=>{
        const { dispatch } = this.props
		dispatch({
			type:'enterpriseManagement/fetchResetPwd',
			payload:{id},
			callback:(res) => {
				let { success } = res;
				if(success){
					message.success('重置成功');
				}else{
					message.error('重置失败');
				}
				this.isSubmit = true;
			}
		})
    }
    
    // 分页变化
    paginationFun = (pageNum) => {
        this.setState({ pageNum },()=>{ this.getList()})
    }
    
    searchModule(){
    	const searchList = [
        	{
				type:'Input',
				id:'search_id',
				domOptions:{placeholder:'企业ID'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_companyName',
				domOptions:{placeholder:'企业名称'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_userName',
				domOptions:{placeholder:'企业账号'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_productName',
				domOptions:{placeholder:'关联产品名称'},
				iconType:'edit'
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
			},
			{
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:() => this.setState({visible: true,drawerType:'add',onceData:{}})}
			}
        ]
    	return <SearchForm {...this.props} searchList={searchList} />
    }
    
    tableModule(){
    	const { loading } = this.state;
    	const { companyList={} } = this.props.msg;
    	const { list=[],total=0, pageNum, pageSize } = companyList;
        const columns = [
            { title: '企业ID', dataIndex: 'id', key: 'id',ellipsis:true,width:'8%'   },
            { title: '企业名称', dataIndex: 'companyName', key: 'companyName',width:'10%',ellipsis:true  },
            { title: '账号前缀', dataIndex: 'companyPrefix', key: 'companyPrefix',width:'10%' ,ellipsis:true  },
            { title: '企业账号', dataIndex: 'userName', key: 'userName',width:'12%',ellipsis:true  },
            { title: '关联知识库项目', dataIndex: 'knowledgeProjectName', key: 'project',width:'12%',ellipsis:true  },
            { title: '关联产品', dataIndex: 'productNameStr', key: 'productNameStr',width:'14%',ellipsis:true  },
            { title: '备注', dataIndex: 'memo', key: 'memo',width:'15%',ellipsis:true },
            {
                title: '操作', dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <Fragment>
                            <Button 
                                className={styles.btn} 
                                onClick={() => this.setState({visible: true,drawerType:'edit',onceData:record})}
                            >
                                编辑
                            </Button>
                            <Button onClick={this.handleResetPwd.bind(this, record)}>重置密码</Button>
                        </Fragment>
                    )
                }
            }
        ]
        
        const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			columns
		}	
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: 9,
	  		onChange: this.paginationFun,
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
    }

    //弹窗
    drawerModule(){
        const { dispatch } = this.props;
		const { visible,drawerType,onceData } = this.state;
		let drawerOptions;
		drawerOptions = {
            content:(<AddModule
                {...this.props} 
                onRef={this.onRef} 
                onceData={onceData} 
                drawerType={drawerType} 
                dispatch={dispatch} 
            />),
            onCancel:this.handleClose,
            okText:'保存',
            onOk:this.handleSave,
        }
        const titleName = drawerType === 'add' ? '新增' : '编辑';
		let drawerProps = {
			title:`企业管理 /${titleName}`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount  
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}

    render() {
        
        const { visible,sideInputArr,operateType } = this.state;
        return (
            <div style={{width:'100%'}}>
                {this.searchModule()}
                {this.tableModule()}
                {this.drawerModule()}
            </div>
        )
    }
}

export default EnterpriseManagement;