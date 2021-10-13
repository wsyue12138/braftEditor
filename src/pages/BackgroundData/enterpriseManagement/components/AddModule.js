import React,{ Component } from 'react';
import FormModule from '@components/FormModule';
import { message } from 'antd';
import { strTrim } from '@utils/utils';

class EnterpriseManagementAdd extends Component{

    componentDidMount(){
        this.isSubmit = true;
        this.props.onRef(this);
    }

    //保存请求
    saveRequest = (payload,callback) => {
        const { dispatch,drawerType } = this.props;
        dispatch({
            type: drawerType == 'add' ? 'enterpriseManagement/createCompany' : 'enterpriseManagement/updateCompany',
            payload,
            callback: (res) => {
                if(res.success){
                    message.success('保存成功');
                    callback();
                }else{
                    this.isSubmit = true;
                    if(res.code === 11008){
                        message.error('企业前缀不可重复');
                    }else
                    if(res.code === 11009){
                        message.error('企业管理账号不可重复');
                    }else{
                        message.error('保存失败');
                    }
                }
            }
        })
    }

    //保存
    handleSave = (callback) => {
        if(this.isSubmit){
            this.isSubmit = false;
            const { form:{validateFields},drawerType,onceData={} } = this.props;
            const { id } = onceData;
            let validateList = ['knowledgeProjectId','memo'];
            if(drawerType === 'add'){
                validateList = [...validateList,'companyName','companyPrefix','userName'];
            }
            validateFields(validateList,(err, values) => {
                if(err){
                    this.isSubmit = true;
                }else{
                    const { knowledgeProjectId } = values;
                    //values.knowledgeProjectId = knowledgeProjectId;
                    if(drawerType === 'edit'){
                        values.id = id;
                    }
                    this.saveRequest(values,callback);
                }
            })
        }
    }

    //企业前缀校验
    validatorCompanyPrefix = (rule, value, callback) => {
        // 定义校验规则
        let reg = /^[0-9a-zA-Z]{0,5}$/g
        // 去掉空格之后再校验，防止空格占位
        let str = strTrim(value)
        if (!reg.test(str)) {
            this.isSubmit = true;
            callback('企业前缀只能输入英文和数字，最多5个字符');
        }
        callback();
    }

    validatorUserName = (rule, value, callback) => {
        // 定义校验规则
        let reg = /^[0-9a-zA-Z_]{6,20}$/g
        // 去掉空格之后再校验，防止空格占位
        let str = strTrim(value)
        if (!reg.test(str)) {
            this.isSubmit = true;
            callback('企业管理账号只能输入英文和数字6~20字符');
        }
        callback();
    }

    formModule(){
        const { onceData,drawerType,form,productManagement,user:{userdata} } = this.props;
        const { knowledgeProject=[] } = productManagement;
        const { companyName='',companyPrefix='',userName='',memo,knowledgeProjectId } = onceData;
        const { userCode } = userdata;
        const formList = [
            {
				type:'Input',
				label:'企业名称',
				id:'companyName',
				options:{
		        	initialValue:companyName,
		        	rules: [
		        		{ 
		        			required: drawerType !== 'edit',
                            whitespace:true,
		        			min:1,
                            max:50,
                            message:'企业名称要求1-50个字符'
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入企业名称",disabled:drawerType === 'edit'}
			},
            {
				type:'Input',
				label:'企业前缀',
				id:'companyPrefix',
				options:{
		        	initialValue:companyPrefix,
		        	rules: [
		        		{ 
		        			required: drawerType !== 'edit',
		        			validator:this.validatorCompanyPrefix
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入企业前缀",disabled:drawerType === 'edit'}
			},
            {
				type:'Input',
				label:'企业管理账号',
				id:'userName',
				options:{
		        	initialValue:userName,
		        	rules: [
		        		{ 
		        			required: drawerType !== 'edit',
		        			validator:this.validatorUserName
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入企业前缀",disabled:drawerType === 'edit'}
			},
            {
				type:'Select',
				label:'知识库项目',
				id:'knowledgeProjectId',
				options:{initialValue:knowledgeProjectId && Number(knowledgeProjectId)},
				domOptions:{allowClear:true,placeholder:"请选择知识库项目",disabled:drawerType === 'edit' && userCode !== 'super_admin'},
				optionList:knowledgeProject,
				valueName:'id',
				labelName:'knowledgeProjectName'
			},
            {
				type:'TextArea',
				label:'备注',
				id:'memo',
				options:{
		        	initialValue:memo,
		        	rules: [
		        		{ max: 255, message: '备注最多255字' }
		        	]
		        },
				domOptions:{placeholder:"备注最多255字",rows:4}
			},
        ]
        return(
            <FormModule form={form} formList={formList} />
        )
    }

    render(){
        return(
            <div style={{width:'100%',height:'100%',padding:'20px 40px'}}>
                {this.formModule()}
            </div>
        )
    }
}

export default EnterpriseManagementAdd;