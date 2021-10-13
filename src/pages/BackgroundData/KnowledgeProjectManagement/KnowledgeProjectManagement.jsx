import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Pagination, Drawer, Modal, Icon, Upload, message } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';
import SideForm from './components/sideForm/sideForm';
import styles from './KnowledgeProjectManagement.less';
import { strTrim, contrast, getUserData, modalContent } from '@utils/utils';
import ExcelUpload from '@components/ExcelUpload';

@connect(({ KnowledgeProjectManagement }) => ({
    msg: KnowledgeProjectManagement
}))

@Form.create()

class KnowledgeProjectManagement extends Component {

    state = {
    	loading:false,
        visible: false,
        sideInputArr: [],
        requestData: {},
        pageNum: 1,
        categoryGroupList:[],
        visible:false,
        drawerType:'',
        onceData:{}
    }

    componentDidMount() {
        // console.clear()
        this.isSubmit = true;
        this.getList();
        this.getCategoryGroup();
    }
    
    // 获取列表
    getList = () => {
        const { dispatch } = this.props;
        this.setState({ loading: true });
        dispatch({
            type: 'KnowledgeProjectManagement/getKnowledgeProjectPage',
            payload: {
                "pageNum": this.state.pageNum,
                "pageSize": 9,
                ...this.state.requestData
            },
            callback: (res) => {
                this.setState({ loading: false });
            }
        })
    }
    
    // 获取类目组
    getCategoryGroup = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'KnowledgeProjectManagement/getCategoryGroup',
            callback: (res) => {
                const { success } = res;
                if (success) {
                    const { data=[] } = res.data;
                    const categoryGroupList = data.map(item => {
                        return {
                            text: item.categoryName,
                            num: item.categoryCode,
                        }
        
                    })
                   this.setState({categoryGroupList});
                }
            }
        })
    }
    
    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {}, pageNum: 1 }, () => {
        	this.getList();
        	resetFields();
        })
    }
    
    // 搜索（查询按钮触发）
    searchValue = (data) => {
    	const { form:{validateFields} } = this.props;
    	validateFields(['search_knowledgeProjectName','search_knowledgeAddr'],(err, values) => {
    		const { search_knowledgeProjectName,search_knowledgeAddr } = values;
    		const requestData = {
    			knowledgeProjectName:search_knowledgeProjectName,
    			knowledgeAddr:search_knowledgeAddr
    		}
    		this.setState({ requestData, pageNum: 1 }, () => this.getList())
    	})
    }
    
    // 侧栏关闭事件
    drawerOnClose = () => {
        this.setState({ visible: false });
    }
    
    // 接收Form表单内容（查询按钮触发）
    queryValue(dataCon) {
        // console.log(dataCon)
        const { categoryGroup: { list } } = this.props.msg
        const { operateType } = this.state
        let data
        let categoryGroupName = list.filter((item) => item.categoryCode == dataCon.categoryGroupCode)
        dataCon.categoryGroupName = categoryGroupName[0].categoryName
        if (operateType == '新增') {
            data = dataCon
        } else {
            // 对比数据是否有更改
            data = contrast(this.state, dataCon)
            if (!data) { this.drawerOnClose(); return }
        }
        const { dispatch } = this.props;
        dispatch({
            type: operateType == '新增' ? 'KnowledgeProjectManagement/createKnowledgeProject' : 'KnowledgeProjectManagement/updateKnowledgeProject',
            payload: data,
            callback: (res) => {
                if (res.success) {
                    message.success('保存成功')
                    this.drawerOnClose()
                    this.getList()
                } else {
                    this.child.setFields(res.repeat)
                    // message.error(res.message)
                }
            }
        })
    }
    
    onRef = (ref) => {
        this.child = ref
    }

    //保存
    handleOk = () => {
        this.child.handleSave(() => {
            this.setState({visible:false,drawerType:'',onceData:{}},() => {
                this.getList();
            });
        })
    }

    //关闭抽屉
    handleClose = () => {
        this.setState({visible:false,drawerType:'',onceData:{}});
    }

    disableRole(record) {
        if (!this.isSubmit) {
            return false;
        }

        this.isSubmit = false;
        Modal.confirm({
            title: '是否确认禁用',
            content: '',
            className: 'selfModal',
            centered: true,
            okText: '是',
            cancelText: '否',
            onOk: () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'KnowledgeProjectManagement/disableRole',
                    payload: { id: record.id },
                    callback: (res) => {
                        let { success } = res;
                        if (success) {
                            message.success('禁用成功');
                        } else {
                            message.error('禁用失败');
                        }
                        this.isSubmit = true;
                        this.getList()
                    }
                })
            },
            onCancel: () => {
                this.isSubmit = true;
            }
        });
    }
    
    enableRole(record) {
        if (!this.isSubmit) {
            return false;
        }

        this.isSubmit = false;
        Modal.confirm({
            title: '是否确认启用',
            content: '',
            className: 'selfModal',
            centered: true,
            okText: '是',
            cancelText: '否',
            onOk: () => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'KnowledgeProjectManagement/enableRole',
                    payload: { id: record.id },
                    callback: (res) => {
                        let { success } = res;
                        if (success) {
                            message.success('启用成功');
                        } else {
                            message.error('启用失败');
                        }
                        this.isSubmit = true;
                        this.getList()
                    }
                })
            },
            onCancel: () => {
                this.isSubmit = true;
            }
        });
    }
    
    // 分页变化
    paginationFun = (pageNum) => {
        this.setState({ pageNum }, () => { this.getList() })
    }
    
    //导入模块
	uploadModule(knowledgeProjectId){
		const { data={} } = getUserData();
		const { token='' } = data;
		const options = {
			className:styles.btn,
			action:'/icservice/knowledge/single/import',
			headers:{token},
			data:{knowledgeProjectId}
		}
		return(
			<ExcelUpload {...options} />
		)
	}
	
	searchModule(){
		const searchList = [
        	{
				type:'Input',
				id:'search_knowledgeProjectName',
				domOptions:{placeholder:'项目名称'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_knowledgeAddr',
				domOptions:{placeholder:'项目地址'},
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
				domOptions:{onClick:() => this.setState({visible:true,drawerType:'add'})}
			}
        ]
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	tableModule(){
		const { loading } = this.state;
		const { knowledgeList={} } = this.props.msg;
		const { total, pageNum, pageSize, list } = knowledgeList;
        const columns = [
            { title: '项目名称', dataIndex: 'knowledgeProjectName', key: 'knowledgeProjectName', ellipsis: true, width: '10%' },
            { title: '项目地址', dataIndex: 'knowledgeAddr', key: 'knowledgeAddr', ellipsis: true, width: '20%' },
            { title: '定制菜单', dataIndex: 'knowledgeCustomFieldName', key: 'knowledgeCustomFieldName', width: '10%', ellipsis: true },
            { title: '关联类目', dataIndex: 'categoryGroupName', key: 'categoryGroupName', width: '10%', ellipsis: true },
            { title: '关联产品', dataIndex: 'productNameArr', key: 'productNameArr', width: '20%', ellipsis: true },
            {
                title: '操作', dataIndex: 'operation', width: '300px',
                render: (text, record, index) => {
                    return (
                        <Fragment>
                            {
                                record.knowledgeProjectStatus ?
                                    <Button key={`enableRoleBtn${index}`} className={styles.btn} onClick={this.enableRole.bind(this, record)}>启用</Button> :
                                    <div className={styles.package_div}>
                                    	{this.uploadModule(record.id)}
                                        <Button className={styles.btn} onClick={() => this.setState({visible:true,drawerType:'edit',onceData:record})}>编辑</Button>
                                        <Button type="danger" ghost className={styles.btn} onClick={this.disableRole.bind(this, record)}>禁用</Button>
                                    </div>
                            }

                        </Fragment>
                    )
                }
            }
        ]
        
        const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			columns,
			rowClassName:(record) => {
				return record.knowledgeProjectStatus ? styles.disableRoleClass : null;
			}
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

    //抽屉
	drawerModule(){
		const { visible,drawerType,onceData,categoryGroupList } = this.state;
		let drawerOptions = {
			content:(<AddModule 
                onRef={this.onRef}
                onceData={onceData}
                drawerType={drawerType}
                categoryGroupList={categoryGroupList}
                {...this.props} 
            />),
			isOk:true,
			okText:'保存',
			onOk:this.handleOk,
			onCancel:this.handleClose
		}
		let drawerProps = {
			title:drawerType === 'add' ? '知识库项目管理/新增' : '知识库项目管理/编辑',
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
                {/* 抽屉 */}
                {/* <Drawer
                    visible={visible}
                    onClose={this.drawerOnClose.bind(this)}
                    maskClosable={false}
                    closable={false}
                    title={<div className={styles.drawer_title}><span className={styles.circular}></span> 知识库项目管理 / {operateType}</div>}
                    headerStyle={{ height: '55px' }}
                    drawerStyle={{ height: '100%' }}
                    bodyStyle={{ height: 'calc(100% - 55px)', overflow: 'hidden', padding: 0 }}
                    width='633'
                    getContainer={false}
                    destroyOnClose={true}
                >
                    <SideForm
                        sideInputArr={sideInputArr}
                        queryValue={this.queryValue.bind(this)}
                        onClose={this.drawerOnClose.bind(this)}
                        onRef={this.onRef.bind(this)}
                    />
                </Drawer> */}
            </div>
        )
    }
}

export default KnowledgeProjectManagement;