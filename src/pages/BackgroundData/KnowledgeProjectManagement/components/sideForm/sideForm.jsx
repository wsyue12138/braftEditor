import React, { Component } from 'react'
import { Form, Input, Button, DatePicker, Select, Checkbox, Table } from 'antd';
import { trim, strTrim } from '@utils/utils';
import styles from './sideForm.less'

const { RangePicker } = DatePicker;
const { Option } = Select;

class SideForm extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields(
            (err, values) => {
                if (!err) {
                    // values是form表单提交的值
                    // console.log(values)
                    this.props.queryValue(trim(values))
                }
            }
        );
    }

    setFields = (e) => {
        let name = strTrim(e)
        let value = this.props.form.getFieldValue(name)
        this.props.form.setFields({
            [name]: {
                value,
                errors: [new Error('项目名称重复')],
            },
        });
    }

    handleResetClick = e => {
        // this.props.form.resetFields();
        this.props.onClose()
    };

    render() {
        const { getFieldDecorator } = this.props.form
        const { TextArea } = Input;
        return (
            <Form className={styles.form}
                onSubmit={this.handleSubmit.bind(this)}
                onReset={this.handleResetClick.bind(this)}
            >
                <div className={styles.content_div}>
                    {this.props.sideInputArr.map((item, key) => {
                        if (item.type == 'Input') {      //eslint-disable-line
                            return (
                                item.label == '备注' || item.label == '楼盘地址' ?      //eslint-disable-line
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
                        } else if (item.type == 'passWord') {        //eslint-disable-line
                            return (
                                (this.state.passWordBtn || item.passWordBtn) ?
                                    <Form.Item
                                        className={styles.form_item}
                                        key={key}
                                        label={item.label}
                                        required={item.required}
                                    >
                                        {getFieldDecorator(item.id, { initialValue: item.value, rules: item.rules })(
                                            <Input
                                                placeholder={item.placeholder}
                                                disabled={item.disabled}
                                                type="password"
                                                autoComplete="new-password"
                                            />,
                                        )}
                                    </Form.Item> :
                                    <Form.Item
                                        className={styles.form_item}
                                        key={key}
                                        label={item.label}
                                        required={item.required}
                                    >
                                        <Input
                                            defaultValue='点击修改'
                                            disabled={item.disabled}
                                            className={styles.passWordBtn}
                                            onClick={() => { this.setState({ passWordBtn: true }) }}
                                        />
                                    </Form.Item>

                            )
                        } else if (item.type == 'DatePicker') {      //eslint-disable-line
                            return (
                                <Form.Item className={styles.form_btn} key={key} label={item.label} required={item.required}>
                                    {getFieldDecorator('datePicker', {})(<DatePicker format="YYYY-MM-DD" />)}
                                </Form.Item>
                            )
                        } else if (item.type == 'RangePicker') {      //eslint-disable-line
                            return (
                                <Form.Item className={styles.form_btn} key={key} label={item.label} required={item.required}>
                                    {getFieldDecorator('rangePicker', {})(<RangePicker format="YYYY-MM-DD" />)}
                                </Form.Item>
                            )
                        } else if (item.type == 'Select') {      //eslint-disable-line
                            return (
                                <Form.Item
                                    className={styles.form_item}
                                    label={item.label}
                                    key={key}
                                    required={item.required}
                                >
                                    {getFieldDecorator(item.id, { initialValue: item.value, rules: item.rules })(
                                        <Select
                                            placeholder={item.placeholder}
                                        // style={{ width: 120 }}
                                        >
                                            {item.selectArr.map((value, index) => {
                                                return (<Option value={value.num} key={index}>{value.text}</Option>)
                                            })}
                                        </Select>)}
                                </Form.Item>
                            )
                        } else {
                            return null
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

const SubmitForm = Form.create({ name: 'side' })(SideForm);
export default SubmitForm;