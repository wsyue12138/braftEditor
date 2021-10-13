import React,{ Component } from 'react';
import { 
	message
} from 'antd';
import FormModule from '@components/FormModule';

class ArticleLabelAdd extends Component{

    componentDidMount(){
        this.isSubmit = true;
        this.props.onRef(this);
    }

    //新增请求
    saveRequest = (payload,callback) => {
        const { dispatch } = this.props;
        console.log(payload)
        callback();
        // dispatch({
		// 	type:'productAccount/fetchAccountUpdate',
		// 	payload,
		// 	callback:(res) => {
		// 		let { success } = res;
		// 		if(success){
        //          message.success('保存成功');
		// 			callback();
		// 		}else{
		// 			message.error('保存失败，请稍后再试');
		// 		}
		// 		this.isSubmit = true;
		// 	}
		// })
    }

    //保存
    handleSave = (callback) => {
        const { form:{validateFields} } = this.props;
        if(this.isSubmit){
            this.isSubmit = false;
            validateFields(['name','maintype'],(err,values) => {
                if(!err){
                    this.saveRequest(values,callback);
                }else{
                    this.isSubmit = true;
                }
            })
        }
    }

    //名字校验
    nameValidator = (rule, value='', callback) => {
        // 定义校验规则
        let reg = /^.{1,12}$/gi
        // 去掉空格之后再校验，防止空格占位
        let str = value.trim();
        if (!reg.test(str)) {
            callback('名字长度1-12个字符');
        }
        callback();
    }

    render(){
        const { drawerType,onceData } = this.props;
        const { ass_lab_name,main } = onceData;
        const formList = [
            {
				type:'Input',
				label:'文章标签名称',
				id:'name',
				options:{
                    initialValue:ass_lab_name,
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.nameValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入文章标签名称"}
			},
            {
				type:'Select',
                label:'所属大类',
				id:'maintype',
                options:{
                    initialValue:main,
		        	rules: [
		        		{ 
                            required:drawerType === 'add',
                            message:'请选择所属大类'
                        }
		        	]
		        },
				domOptions:{placeholder:'请选择所属大类',disabled:drawerType === 'edit'},
				optionList:[],
				valueName:'val',
				labelName:'label'
			}
        ]
        return(
            <div style={{width:'100%',height:'100%',padding:'20px 40px'}}>
                <FormModule form={this.props.form} formList={formList} />
            </div>
        )
    }
}

export default ArticleLabelAdd;