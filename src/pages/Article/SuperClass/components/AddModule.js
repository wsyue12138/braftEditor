import React,{ Component,Fragment } from 'react';
import { 
	message
} from 'antd';
import FormModule from '@components/FormModule';

class ArticleSuperClassAdd extends Component{
    constructor(props){
        super(props)
        this.state = {
			enterpriseArr:[
				{val:0,label:'烟台中集来福士海洋工程有限公司'},
				{val:1,label:'烟台打捞局船厂'}
			]
        }
    }
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
        //             message.success('保存成功');
		// 			callback();
		// 		}else{
		// 			message.error('保存失败,请稍后再试');
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
            validateFields(['name','enterprise_name','maintain'],(err,values) => {
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
            this.isSubmit = false;
             callback('名称长度1-12个字符');
         }
         callback();
    }

    render(){
        const { drawerType,onceData } = this.props;
        const { main_type_name,enterprise_name,is_maintained } = onceData;
        const { enterpriseArr } = this.state;
        const formList = [
            {
				type:'Input',
				label:'文章大类名称',
				id:'name',
				options:{
                    initialValue:main_type_name,
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.nameValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入文章大类名称",disabled:drawerType === 'edit',}
			},
            {
				type:'Select',
                label:'所属企业',
				id:'enterprise_name',
                options:{
                    initialValue:enterprise_name,
		        	rules: [
		        		{ required: true,message:'请选择所属企业'}
		        	]
		        },
				domOptions:{placeholder:'请选择所属企业',disabled:drawerType === 'edit',},
				optionList:enterpriseArr,
				valueName:'val',
				labelName:'label'
			},
            {
				type:'Select',
                label:'维护状态',
				id:'maintain',
                options:{
                    initialValue:is_maintained == 1 ?'正常':'维护',
		        	rules: [
		        		{ required: true,message:'请选择维护状态'}
		        	]
		        },
				domOptions:{placeholder:'请选择维护状态'},
				optionList:[
					{val:1,label:'正常'},
					{val:2,label:'维护'}
				],
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

export default ArticleSuperClassAdd;