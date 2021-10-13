import React,{ Component } from 'react';
import { message } from 'antd';
import FormModule from '@components/FormModule';

class KnowledgeProjectManagementAdd extends Component{

    constructor(props){
        super(props)
        const { onceData={} } = props;
        const { categoryGroupName } = onceData;
        this.state = {
            categoryGroupName
        }
    }

    componentDidMount(){
        this.props.onRef(this);
        this.isSubmit = true;
    }

    //请求
    saveRequest = (payload,callback) => {
        const { dispatch,drawerType,onceData } = this.props;
        const { id } = onceData;
        if(drawerType === 'edit'){
            payload.id = id;
        }
        dispatch({
            type: drawerType === 'add' ? 'KnowledgeProjectManagement/createKnowledgeProject' : 'KnowledgeProjectManagement/updateKnowledgeProject',
            payload,
            callback: (res) => {
                this.isSubmit = true;
                if (res.success) {
                    message.success('保存成功')
                    callback();
                } else {
                    if(res.code === 11018){
                        const { knowledgeProjectName } = payload;
                        this.props.form.setFields({
                            'knowledgeProjectName': {
                                value:knowledgeProjectName,
                                errors: [new Error('项目名称重复')],
                            },
                        });
                    }else{
                        message.error('保存失败')
                    }
                }
            }
        })
    }

    //提交
    handleSave = (callback) => {
        if(this.isSubmit){
            this.isSubmit = false;
            const { form:{validateFields} } = this.props;
            validateFields(['knowledgeProjectName','knowledgeAddr','passWord','knowledgeCustomFieldName','categoryGroupCode'],(err, values) => {
                if(err){
                    this.isSubmit = true;
                }else{
                    const { categoryGroupName } = this.state;
                    values.categoryGroupName = categoryGroupName;
                    this.saveRequest(values,callback);
                }
            })
        }
        
    }

    //密码验证
    passWordValidator = (rule, value='', callback) => {
        console.log(value)
        // 定义校验规则
        let reg = /^[^\u4e00-\u9fa5]$/
        // 去掉空格之后再校验，防止空格占位
        let str = value.trim();
        if (str.length == 0) {
            callback();
        } else{
            if(str.length < 6 || str.length > 20 || reg.test(str)){
                this.isSubmit = true;
                callback('密码需要非中文6-20个字符');
            }else{
                callback();
            }
        }
    }

    //类目变更
    handleChange = (value,opeion) => {
        const { props:{children} } = opeion;
        this.setState({categoryGroupName:children});
    }

    render(){
        const { onceData={},categoryGroupList } = this.props;
        const { knowledgeProjectName,knowledgeAddr,passWord,knowledgeCustomFieldName,categoryGroupCode } = onceData;
        const formList = [
            {
				type:'Input',
				label:'项目名称',
				id:'knowledgeProjectName',
				options:{
		        	initialValue:knowledgeProjectName,
					rules: [
		        		{ required: true, message: '请输入项目名称' },
                        { whitespace: true, message: '请输入项目名称' },
                        { max: 15, message: '项目名称最多15字符' }
		        	]
		        },
				domOptions:{placeholder:"请输入项目名称"}
			},
            {
				type:'Input',
				label:'项目地址',
				id:'knowledgeAddr',
				options:{
		        	initialValue:knowledgeAddr,
					rules: [
		        		{ required: true, message: '请输入项目地址' },
                        { whitespace: true, message: '请输入项目地址' },
                        { max: 200, message: '项目地址只能输入200个字符以内' }
		        	]
		        },
				domOptions:{placeholder:"请输入项目地址"}
			},
            {
				type:'Input',
				label:'密码',
				id:'passWord',
				options:{
		        	initialValue:passWord ? passWord : '',
					rules: [
                        { 
		        			required: false,
		        			validator:this.passWordValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入密码"}
			},
            {
				type:'Input',
				label:'定制菜单',
				id:'knowledgeCustomFieldName',
				options:{
		        	initialValue:knowledgeCustomFieldName,
					rules: [
		        		{ max: 10, message: '定制菜单只能输入10个字符以内' }
		        	]
		        },
				domOptions:{placeholder:"请输入定制菜单"}
			},
            {
				type:'Select',
				label:'关联类目',
				id:'categoryGroupCode',
				options:{
		        	initialValue:categoryGroupCode,
		        	rules: [
		        		{ required: true, message: '请选择关联类目' }
		        	]
		        },
				domOptions:{placeholder:"请选择关联类目",onChange:this.handleChange},
				optionList:categoryGroupList,
				valueName:'num',
				labelName:'text'
			}
        ]
        return(
            <div style={{width:'100%',height:'100%',padding: '20px 40px'}}>
                <FormModule {...this.props} formList={formList} />
            </div>
        )
    }
}

export default KnowledgeProjectManagementAdd;