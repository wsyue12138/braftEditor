import React, { Component } from 'react'
import { Form, Input, Button } from 'antd';
import { trim } from '@utils/utils';
import styles from './sideForm.less'

class SideForms extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyPrefix:''
        }
    }



    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            // console.log(this.props)
            if (!err) {
                // values是form表单提交的值
                this.props.queryValue(trim(values))
            }
        });
    }

    handleResetClick = e => {
        // this.props.form.resetFields();
        this.props.onClose()
    };
    inputOnchange=(e)=>{
        let companyPrefix = this.state.companyPrefix
        let len = companyPrefix.length;
		let value = e.target.value;
        if(value.substr(0,len) !== companyPrefix){
            if(this.userName){
                let arr = this.userName.split('_')
                return companyPrefix+arr[1]
            }else{
                return companyPrefix
            }
        }else{
            this.userName = value
            return value;
        }
    }

    companyPrefixOnChange=(e)=>{
        this.setState({
            companyPrefix:e.target.value+'_'
        })
        setTimeout(() => {
            let userName = this.props.form.getFieldValue('userName')
            if(!userName || userName.length == 0){
                return
            }
            if(userName.indexOf('_')){
                let arr = userName.split('_')
                this.props.form.setFieldsValue({
                    userName:this.state.companyPrefix+arr[1]
                })
            }else{
                this.props.form.setFieldsValue({
                    userName:this.state.companyPrefix+userName
                })
            }
        }, 200);
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { TextArea } = Input;
        const { operateType } = this.props
        return (
            <Form className={styles.form}
                onSubmit={this.handleSubmit.bind(this)}
                onReset={this.handleResetClick.bind(this)}
            >
                <div className={styles.content_div}>
                    {this.props.sideInputArr.map((item, key) => {
                        if(item.label == '企业管理账号'){
                            return( <Form.Item
                                className={styles.form_item}
                                key={key}
                                label={item.label}
                                required={item.required}
                            >
                                {getFieldDecorator(item.id, {
                                    // initialValue: item.value,
                                    initialValue:operateType === '新增' ? this.state.companyPrefix : item.value,
                                    rules: item.rules,
                                    getValueFromEvent:this.inputOnchange
                                })(
                                    <Input
                                        placeholder={item.placeholder}
                                        disabled={item.disabled || this.state.companyPrefix.length<2}
                                    />,
                                )}
                            </Form.Item>)
                        }else if(item.label == '企业前缀'){
                            return( <Form.Item
                                className={styles.form_item}
                                key={key}
                                label={item.label}
                                required={item.required}
                            >
                                {getFieldDecorator(item.id, {
                                    initialValue: item.value,
                                    rules: item.rules,

                                })(
                                    <Input
                                        onChange={this.companyPrefixOnChange}
                                        placeholder={item.placeholder}
                                        disabled={item.disabled}
                                    />,
                                )}
                            </Form.Item>)
                        }else if (item.type == 'Input') {      //eslint-disable-line
                            return (
                                item.label == '备注' ?      //eslint-disable-line
                                    <Form.Item
                                        className={styles.form_item}
                                        key={key}
                                        label={item.label}
                                        required={item.required}
                                    >
                                        {getFieldDecorator(item.id, { initialValue: item.value, rules: item.rules })(
                                            <TextArea
                                                placeholder={item.placeholder}
                                                disabled={item.disabled}
                                            />,
                                        )}
                                    </Form.Item> :
                                    <Form.Item
                                        className={styles.form_item}
                                        key={key}
                                        label={item.label}
                                        required={item.required}
                                    >
                                        {getFieldDecorator(item.id, {
                                            initialValue: item.value,
                                            rules: item.rules,

                                        })(
                                            <Input
                                                placeholder={item.placeholder}
                                                disabled={item.disabled}
                                            />,
                                        )}
                                    </Form.Item>
                            )
                        }
                    })}
                </div>
                <div className={styles.bottom_div}>
                    <Form.Item>
                        <Button className={styles.form_btn} htmlType='reset'>返回</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button className={styles.form_btn} htmlType='submit' type='primary'>保存</Button>
                    </Form.Item>
                </div>

            </Form>
        )
    }
}

const SubmitForm = Form.create({ name: 'side' })(SideForms);
export default SubmitForm;