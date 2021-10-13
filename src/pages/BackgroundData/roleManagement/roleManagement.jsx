import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form,Button, Pagination, Drawer,message,Modal } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import SideForm from './components/sideForm/sideForm';
import styles from './roleManagement.less';
import { strTrim } from '@utils/utils';


@connect(({
	roleManagement
}) => ({
	roleManagement
}))

@Form.create()

class RoleManagement extends Component {

    state = {
    	loading:false,
        visible: false,
        requestData: {},
        pageNum: 1,
        record:false
    }

    componentDidMount() {
		this.isSubmit = true;
        this.getList()
        this.getAllPermission()
    }
    // 获取列表
    getList = () => {
        const { dispatch } = this.props;
        this.setState({loading:true});
        dispatch({
            type: 'roleManagement/getRoleList',
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
    
    // 全部权限列表查询
    getAllPermission = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'roleManagement/getAllPermission',
            payload: {},
            callback: (res) => {
                //console.log('获取到全部权限',this.props.msg.allPermission)
            }
        })
    }
    
    // 角色已选权限列表查询
    getRolePermissionList = (roleId) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'roleManagement/getRolePermissionList',
            payload: {
                roleId
            },
            callback: (res) => {
                //console.log('获取到已选权限',res)
                this.setState({visible: true})
            }
        })
    }
    
    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {},pageNum:1 }, () => {
        	this.getList()
        	resetFields();
        })
    }
    
    // 搜索（查询按钮触发）
    searchValue = () => {
    	const { form:{validateFields} } = this.props;
    	validateFields(['search_id','search_roleName','search_description'],(err, values) => {
    		const { search_id,search_roleName,search_description } = values;
    		const requestData = {
    			id:search_id,
    			roleName:search_roleName,
    			description:search_description
    		}
    		this.setState({ requestData,pageNum:1 }, () => this.getList())
    	})
    }
    
    // 侧栏关闭事件
    drawerOnClose = () => {
        this.setState({ visible: false });
    }
    
    // 接收Form表单内容
    queryValue = (dataCon) => {
        let data = dataCon
        if (this.state.operateType == '编辑') {
            data.id = this.state.editId
        }
        const { dispatch } = this.props;
        dispatch({
            type: this.state.operateType == '新增' ? 'roleManagement/createRole' : 'roleManagement/updateRole',
            payload: data,
            callback: (res) => {
                if(res.success){
                    message.success('保存成功')
                    this.drawerOnClose()
                    this.getList()
                }else{
                    message.error(res.message)
                }
            }
        })
    }
    
    // 新增
    addFun = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'roleManagement/resetPermissionList',
            payload: {}
        })
        this.setState({ record:false ,visible: true, operateType: '新增' })
    }
    
    // 编辑
    editClick = (record) => {
        this.getRolePermissionList(record.id)
        this.setState({ record, operateType: '编辑' ,editId:record.id })
    }
    
    lookOver = (record) => {
        this.getRolePermissionList(record.id)
        this.setState({ record, operateType: '查看' ,editId:record.id })
    }
    
    disableRole = (record) => {
        if(!this.isSubmit){
			return false;
        }
        
		this.isSubmit = false;
		Modal.confirm({
    		title:'是否确认禁用',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'roleManagement/disableRole',
                    payload: {id:record.id},
                    callback: (res) => {
                        let { success } = res;
                        if(success){
                            message.success('禁用成功');
                        }else{
                            message.error('禁用失败');
                        }
                        this.isSubmit = true;
                        this.getList()
                    }
                })
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
    }
    enableRole = (record) => {
        if(!this.isSubmit){
			return false;
        }
        
		this.isSubmit = false;
		Modal.confirm({
    		title:'是否确认启用',
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
                const { dispatch } = this.props;
                dispatch({
                    type: 'roleManagement/enableRole',
                    payload: {id:record.id},
                    callback: (res) => {
                        let { success } = res;
                        if(success){
                            message.success('启用成功');
                        }else{
                            message.error('启用失败');
                        }
                        this.isSubmit = true;
                        this.getList()
                    }
                })
    		},
    		onCancel:() => {
    			this.isSubmit = true;
    		}
  		});
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
				domOptions:{placeholder:'角色ID'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_roleName',
				domOptions:{placeholder:'角色名称'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_description',
				domOptions:{placeholder:'角色描述'},
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
				domOptions:{onClick:this.addFun}
			}
        ]
        
    	return <SearchForm {...this.props} searchList={searchList} />
    }
    
    tableModule(){
    	const { loading } = this.state;
    	const { roleManagement } = this.props;
    	const { roleList } = roleManagement;
        const { list=[], total=0, pageNum, pageSize } = roleList;
        const columns = [
            { title: '角色ID', dataIndex: 'id', key: 'id',width:'10%' ,ellipsis:true},
            { title: '角色名称', dataIndex: 'roleName', key: 'roleName',ellipsis:true },
            { title: '角色描述', dataIndex: 'description', key: 'description', ellipsis:true },
            {
                title: '操作', dataIndex: 'operation',
                render: (text, record, index) => {
                    return (
                        <Fragment>
                        	<Button className={styles.btn} onClick={() => {this.lookOver(record)}}>查看</Button>
                            {
                                record.roleStatus ? (
                                	<Button key={`enableRoleBtn${index}`} className={styles.btn} onClick={() => {this.enableRole(record)}}>启用</Button>
	                            ) : (
	                            	<Fragment>
	                            		{
		                                	record.roleType === 1 || record.roleType === 2 ? '' : (
		                                		<Fragment>
		                                			<Button className={styles.btn} onClick={() => {this.editClick(record)}}>编辑</Button>
		                                			<Button type="danger" ghost className={styles.btn} onClick={() => {this.disableRole(record)}}>禁用</Button>
		                                		</Fragment>
		                                	)
		                               }
	                            	</Fragment>
	                            )
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
				return record.roleStatus ? styles.disableRoleClass : null
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

    render() {
    	const { visible } = this.state;
        return (
            <div style={{width:'100%'}}>
                {this.searchModule()}
                {this.tableModule()}
                {/* 抽屉 */}
                <Drawer
                    visible={this.state.visible}
                    onClose={this.drawerOnClose.bind(this)}
                    maskClosable={false}
                    closable={false}
                    title={<div className={styles.drawer_title}><span className={styles.circular}></span> 角色管理 / {this.state.operateType}</div>}
                    headerStyle={{ height: '55px' }}
                    drawerStyle={{ height: '100%' }}
                    bodyStyle={{ height: 'calc(100% - 55px)', overflow: 'hidden', padding: 0 }}
                    width='630'
                    getContainer={false}
                    destroyOnClose={true}
                >
                    {
                        visible?
                        <SideForm
                        	{...this.props}
                            record={this.state.record}
                            queryValue={this.queryValue.bind(this)}
                            onClose={this.drawerOnClose.bind(this)}
                            popupClose={this.state.popupClose}
                            operateType = {this.state.operateType}
                        />:
                        null
                    }
                </Drawer>
            </div>
        )
    }
}

export default RoleManagement;