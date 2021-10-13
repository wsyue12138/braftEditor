import React, { Component,Fragment } from 'react'
import { connect } from 'dva';
import { Form, Input, Button, message,Tree,Radio } from 'antd';
import { trim, strTrim } from '@utils/utils';
import styles from './sideForm.less'

@connect(({
	roleManagement
}) => ({
	roleManagement
}))

class SideForm extends Component {
    constructor(props) {
        super(props)
        this.state = {
            permissionCodes:this.props.roleManagement.rolePermissionList,
            roleCode:'bmxm_role'
        }
    }


    componentDidMount() {
    	this.getRoleType();
    }

    // 获取权限
    getRoleType = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'roleManagement/fetchGetRoleType'
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const { permissionCodes } = this.state
        if(permissionCodes.length == 0){
            message.warning('权限不能为空')
            return
        }
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // values是form表单提交的值
                values.permissionCodes = permissionCodes
                this.props.queryValue(trim(values))
            }
        });
    }

    handleResetClick = e => {
        // this.props.form.resetFields();
        this.props.onClose()
    };


    permissionFun=()=>{
    	const { permissionCodes=[] } = this.state;
    	const { roleManagement,operateType } = this.props;
        const { allPermission,rolePermissionList } = roleManagement;
        let onCheck = (checkedKeys, info) => {
            this.setState({
                permissionCodes : checkedKeys
            })
        }
        return <>
            <div className={styles.form_item} style={{marginTop:15}}>
                <span className={styles.table_title_span}>*</span>
                <span className={styles.table_title}>角色权限</span>
            </div>
            <div className={styles.form_item}>
                <Tree
                    checkable
                    disabled={operateType == '查看'}
                    defaultExpandedKeys={rolePermissionList}
                    defaultSelectedKeys={rolePermissionList}
                    defaultCheckedKeys={rolePermissionList}
                    selectable={false}
                    checkedKeys={permissionCodes}
                    onCheck={onCheck}
                >
                    {
                        this.generateTree(allPermission)
                    }
                </Tree>
            </div>
        </>
    }
    generateTree=(permit)=>{
    	const { roleCode } = this.state;
        const { TreeNode } = Tree;
        const { operateType,record={} } = this.props;
        return 	permit.map((item,index) => {
		        	const {
		        		permissionName='',
		        		permissionCode='',
		        		permissionBorder,
		        		children=[]
		        	} = item;
		        	let treeNodeOptions = {
		        		title:permissionName,
		                key:permissionCode,
		                selectable:false
		        	};
		        	if(operateType === '新增'){
		        		const isDisabled = roleCode === 'company_role' && permissionBorder === 1;
		        		treeNodeOptions.disabled = isDisabled;
		        	}else
		        	if(operateType === '编辑'){
		        		const isDisabled = record.roleCode === 'company_role' && permissionBorder === 1;
		        		treeNodeOptions.disabled = isDisabled;
		        	}
		        	return(
		        		<TreeNode
		        			{...treeNodeOptions}
			            >
			                {children ? this.generateTree(children) : null}
			            </TreeNode>
		        	)
		        })
    }

    //角色权限变更
    roleCodeChange = (e) => {
    	const { value } = e.target;
    	this.setState({roleCode:value,permissionCodes:[]});
    }

    render() {
        const { form:{getFieldDecorator},roleManagement } = this.props;
        const { roleType=[] } = roleManagement;
        return (
            <Form className={styles.form}
                onSubmit={this.handleSubmit.bind(this)}
                onReset={this.handleResetClick.bind(this)}
            >
                <div className={styles.content_div}>
                    <Form.Item
                        className={styles.form_item}
                        // key={key}
                        label='角色名称'
                        required={true}
                    >
                        {getFieldDecorator('roleName', {
                            initialValue: this.props.record ? this.props.record.roleName : '',
                            rules: [{ required: true, message: '请输入角色名称' },
                            { whitespace: true, message: '请输入角色名称' },
                            { max: 10, message: '角色名称最多10字符' },
                            // { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi, message: '请输入正确角色名称' },
                            {
                                validator: (rule, value, callback) => {
                                    // 定义校验规则
                                    let reg = /^[A-Za-z0-9\u4e00-\u9fa5\s]+$/gi
                                    // 去掉空格之后再校验，防止空格占位
                                    let str = strTrim(value)
                                    if (!reg.test(str)) {
                                        callback('请输入正确角色名称');
                                    }
                                    callback();
                                }
                            }],

                        })(
                            <Input
                                disabled={this.props.operateType=='新增'?false:true}
                            />,
                        )}
                    </Form.Item>
                    <Form.Item
                    	className={styles.form_item}
                    	label='角色类型'
                    >
                    	{getFieldDecorator('roleCode', {
                            initialValue: this.props.record ? this.props.record.roleCode : 'bmxm_role',
                            rules: [{ required: true, message: '请选择角色类型' }]
                        })(
                            <Radio.Group disabled={this.props.operateType=='新增'?false:true}>
                            	{
                            		roleType.map((item,index) => {
                            			const { code,name } = item;
                            			return(
                            				<Radio
                            					key={code}
                            					value={code}
                            					style={{marginRight:index === 0 ? 220 : 0}}
                            					onChange={this.roleCodeChange}
                            				>
                            					{name}
                            				</Radio>
                            			)
                            		})
                            	}
						    </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item
                        className={styles.form_item}
                        // key={key}
                        label='角色描述'
                        required={true}
                    >
                        {getFieldDecorator('description', {
                            initialValue: this.props.record ? this.props.record.description : '',
                            rules: [{ required: true, message: '请输入角色描述' },
                            { whitespace: true, message: '请输入角色描述' },
                            { max: 100, message: '角色描述最多100字符' }
                            ],

                        })(
                            <Input
                                disabled={this.props.operateType=='新增'?false:true}
                            />,
                        )}
                    </Form.Item>
                    {this.permissionFun()}
                </div>
                <div className={styles.bottom_div}>
                    <Form.Item className={styles.form_item_bottom}>
                        <Button className={styles.form_btn} htmlType='reset' >返回</Button>
                    </Form.Item>
                    {
                        this.props.operateType=='查看'?null:
                        <Form.Item className={styles.form_item_bottom}>
                            <Button className={styles.form_btn} htmlType='submit' type='primary'>保存</Button>
                        </Form.Item>
                    }
                </div>

            </Form>
        )
    }
}

const SubmitForm = Form.create({ name: 'side' })(SideForm);
export default SubmitForm;
