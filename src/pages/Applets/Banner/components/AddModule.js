import React,{ Component,Fragment } from 'react';
import { 
	message
} from 'antd';
import moment from 'moment';
import FormModule from '@components/FormModule';
import AvatarUploader from '@components/AvatarUploader';
import { modalContent,getUserData } from '@utils/utils';

class bannerAdd extends Component{

    constructor(props){
        super(props)
        const { onceData } = props;
        const { jump_type=2 } = onceData;
        this.isSubmit = true;
        this.state = {
            jumpType:jump_type
        }
    }

    componentDidMount(){
        const { form:{setFieldsValue},onceData,onRef } = this.props;
        const { picture } = onceData;
        this.isSubmit = true;
        onRef(this);
        setFieldsValue({picture: picture});
    }

    //保存请求
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
        const { jumpType } = this.state;
        const { form:{validateFields} } = this.props;
        if(this.isSubmit){
            this.isSubmit = false;
            let validateList = ['name','picture','jump_type','date','turn','status'];
            if(jumpType != 2){
                validateList.push('jump_link');
                if(jumpType == 1){
                    validateList.push('jump_appid');   
                }
            }
            validateFields(validateList,(err,values) => {
                if(!err){
                    const { date } = values;
                    const data = JSON.parse(JSON.stringify(values));
                    data.begin_date = date[0].format('YYYY-MM-DD')
                    data.end_date = date[1].format('YYYY-MM-DD')
                    delete data.date;
                    this.saveRequest(data,callback);
                }else{
                    this.isSubmit = true;
                }
            })
        }
    }

    //名称校验
    nameValidator = (rule, value='', callback) => {
        // 定义校验规则
        let reg =  /^[A-Za-z0-9\u4e00-\u9fa5]{1,10}$/gi
        // 去掉空格之后再校验，防止空格占位
        let str = value.trim();
        if (!reg.test(str)) {
            this.isSubmit = true;
            callback('只能是中文、字母、数字，输入长度不可超过10个字符');
        }else{
            callback();
        }
    }

    //顺序校验
    turnValidator = (rule, value='', callback) => {
        // 定义校验规则
        let reg = /^[0-9]{1,4}$/
        // 去掉空格之后再校验，防止空格占位
        let str = value.toString().trim();
        if (!reg.test(str)) {
            this.isSubmit = true;
            callback('只能为数字，输入长度不可超过4个字符');
        }else{
            callback();
        }
    } 

    //图片上传回调
    uploadCallback = (res) => {
        const { ret_code,ret_msg,data } = res;
        if(ret_code === 1){
            const { form:{setFieldsValue} } = this.props;
            const { url } = data;
            setFieldsValue({picture: url});
            modalContent('success','上传成功',true);
        }else{
            if(ret_code === 11019){
                modalContent('warning','仅支持上传jpg,png,gif文件!',true);
            }else{
                modalContent('error','上传失败,请稍后重试',true);
            }
        }
    }

    //跳转类型变更
    jumpTypeChange = (value) => {
        this.setState({jumpType:value});
    }

    //表单
    formModule(){
        const { jumpType } = this.state;
        const { drawerType,onceData } = this.props;
        const { data={} } = getUserData();
		const { token='' } = data;
        const { id,name,picture,jump_type,jump_appid,jump_link,begin_time,end_time,turn,status } = onceData;
        const dateFormat = 'YYYY-MM-DD';
        const formList = [
            {
                type:'Input',
				label:'banner名称',
				id:'name',
				options:{
                    initialValue:name,
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.nameValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入banner名称"}
            },
            {
                type:'Dom',
				label:'banner图',
				id:'picture_title',
				onceStyle:{marginBottom:0},
                options:{
		        	rules: [{ required: true}]
		        },
				custom:(
					<span></span>
				)
            },
            {
                type:'Dom',
				label:'',
				id:'picture',
				onceStyle:{margin:0},
                options:{
		        	initialValue:picture,
		        	rules: [{ required: true,message:'请上传banner图' }]
		        },
				custom:(
					<Fragment>
                        <AvatarUploader 
                            headers={{token}}
                            action='/icservice/common/uploadImg'
                            initUrl={picture}
                            callback={this.uploadCallback}
                        />
                    </Fragment>
				)
            },
            {
				type:'Select',
                label:'跳转类型',
				id:'jump_type',
                onceStyle:{marginTop:10},
                options:{
                    initialValue:jump_type,
		        	rules: [
		        		{ 
                            required:true,
                            message:'请选择跳转类型'
                        }
		        	]
		        },
				domOptions:{placeholder:'请选择跳转类型',onChange:this.jumpTypeChange},
				optionList:[
                    {val:0,label:'站内功能区'},
                    {val:1,label:'第三方小程序'},
                    {val:2,label:'不跳转'},
                    {val:3,label:'站外H5'}
                ],
				valueName:'val',
				labelName:'label'
			},
            {
                type:'RangePicker',
				label:'有效日期',
				id:'date',
				options:{
                    initialValue:begin_time && end_time ? [moment(begin_time, dateFormat),moment(end_time, dateFormat)] : undefined,
		        	rules: [
		        		{ 
		        			required: true,
		        			message:'请选择起止时间'
		        		}
		        	]
		        },
                domStyle:{width:'100%'},
                domOptions:{format:"YYYY-MM-DD"},
            },
            {
                type:'Input',
				label:'banner顺序',
				id:'turn',
				options:{
                    initialValue:turn,
		        	rules: [
		        		{ 
		        			required: true,
		        			validator:this.turnValidator
		        		}
		        	]
		        },
				domOptions:{placeholder:"请输入banner顺序"}
            },
            {
                type:'Select',
                label:'banner状态',
				id:'status',
                options:{
                    initialValue:status,
		        	rules: [
		        		{ 
                            required:true,
                            message:'请选择banner状态'
                        }
		        	]
		        },
				domOptions:{placeholder:'请选择banner状态'},
				optionList:[
                    {val:0,label:'上架'},
                    {val:1,label:'下架'}
                ],
				valueName:'val',
				labelName:'label'
            }
        ]

        const bannerIDObj = {
            type:'Input',
            label:'bannerID',
            id:'id',
            options:{
                initialValue:id,
            },
            domOptions:{ disabled:true } 
        }

        const appidObj = {
            type:'Input',
            label:'APPID',
            id:'jump_appid',
            options:{
                initialValue:jump_appid,
                rules: [
                    { 
                        required: true,
                        message:'请输入正确的APPID'
                    },
                    {
                        max: 32, message: '输入长度不可超过32个字符',
                    }
                ]
            },
            domOptions:{placeholder:"请输入APPID"} 
        }

        const jumpLinkObj = {
            type:'Input',
            label:'跳转地址',
            id:'jump_link',
            options:{
                initialValue:jump_link,
                rules: [
                    { 
                        required: true,
                        message:'请输入跳转地址'
                    },
                    {
                        max: 1024, message: '输入长度不可超过1024个字符',
                    }
                ]
            },
            domOptions:{placeholder:"请输入跳转地址"} 
        }
        
        if(jumpType != 2){
            formList.splice(4,0,jumpLinkObj);
            if(jumpType == 1){
                formList.splice(4,0,appidObj);   
            }
        }
        if(drawerType === 'edit'){
            formList.unshift(bannerIDObj);
        }
        return(
            <FormModule form={this.props.form} formList={formList} />
        )
    }

    render(){
        return(
            <div style={{width:'100%',minHeight:'100%',padding:'20px 40px'}}>
                {this.formModule()}
            </div>
        )
    }
}

export default bannerAdd;