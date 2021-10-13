import React,{ Component,Fragment } from 'react';
import {
	Row,
	Col,
	Form,
	Input,
	InputNumber,
	Icon,
	DatePicker,
	TimePicker,
	Select,
	Cascader,
	Radio,
	Switch
} from 'antd';
import styles from './style.less';

const { TextArea } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

/**
 * author：wsyue
 * formList:表单数组
 * item：{
 * 		type：表单类型,
 * 		span:单项宽度比例
 * 		onceStyle:单个form样式
 * 		label:表单标题
 * 		id:表单id
 * 		options：表单操作相关
 * 		domOptions：dom的kpi,
 * 		custom:自定义元素
 * 		onceOther:单个表单外部内容
 * }
 *
 * **/

 export default class FormModuleContent extends Component{

	state = {

	}

	//其他
	domModule = (item) => {
		const { custom='' } = item;
		return custom == '' ? <Fragment>{custom}</Fragment> : custom;
	}

	//input模块
	inputModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <Input {...domOptions} style={domStyle} />;
	}

	//TextArea模块
	textAreaModule = (item) => {
		const { domOptions={},domStyle={},isDelete } = item;
		const styles = {...domStyle,resize:'none',paddingRight:isDelete ? 28 : 11};
		return <TextArea {...domOptions} style={styles} />;
	}

	//密码输入模块
	passwordModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <Input.Password {...domOptions} style={domStyle} />;
	}

	//数字输入模块
	inputNumberModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <InputNumber {...domOptions} style={domStyle} />;
	}

	//日期选择模块
	datePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <DatePicker {...domOptions} style={domStyle} />;
	}

	//月份选择模块
	monthPickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <MonthPicker {...domOptions} month style={domStyle} />;
	}

	//日期区间模块
	rangePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <RangePicker {...domOptions} style={domStyle} />;
	}

	//星期模块
	weekPickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <WeekPicker {...domOptions} week style={domStyle} />;
	}

	//时间模块
	timePickerModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		return <TimePicker {...domOptions} style={domStyle} />;
	}

	//下拉选择模块
	selectModule = (item) => {
		const { domOptions={},domStyle={},optionList=[],valueName='',labelName='' } = item;
		domOptions.getPopupContainer = (triggerNode) => triggerNode.parentNode;
		return (
			<Select {...domOptions} style={domStyle}>
				{
					optionList.map((item,index) => {
						return(
							<Option
								key={item[valueName]}
								value={item[valueName]}
							>
								{item[labelName]}
							</Option>
						)
					})
				}
			</Select>
		)
	}

	//级联选择模块
	cascaderModule = (item) => {
		const { domOptions={},domStyle={} } = item;
		domOptions.getPopupContainer = (triggerNode) => triggerNode.parentNode;
		return <Cascader {...domOptions} style={domStyle} />
	}

	//单选模块
	radioModule = (item) => {
		const { domOptions={},optionList=[],optionStyle=[],valueName='',labelName='' } = item;
		return(
			<Radio.Group {...domOptions}>
				{
					optionList.map((item,index) => {
						return(
							<Radio
								style={optionStyle[index]}
								key={item[valueName]}
								value={item[valueName]}
							>
								{item[labelName]}
							</Radio>
						)
					})
				}
      		</Radio.Group>
		)
	}

	//开关模块
	switchModule = (item) => {
		const { domOptions={} } = item;
		return <Switch {...domOptions} />
	}

	//其他模块
	otherModule = (item) => {
		const { custom='' } = item;
		return custom;
	}

	contentModule = (item) => {  //isDelete是否删除，deleteFun删除函数
		const { form:{getFieldDecorator} } = this.props;
		const { type,span=24,label='',id='',options={},onceStyle={},isDelete,deleteFun,onceOther='' } = item;
		let onceContent = '';
		switch(type){
			case 'Dom':											//自定义dom
				onceContent = this.domModule(item);
				break;
			case 'Input':										//input输入框
				onceContent = this.inputModule(item);
				break;
			case 'TextArea':									//TextArea输入框
				onceContent = this.textAreaModule(item);
				break;
			case 'Password':									//密码输入框
				onceContent = this.passwordModule(item);
				break;
			case 'InputNumber':									//数字输入框
				onceContent = this.inputNumberModule(item);
				break;
			case 'DatePicker':									//日期选择
				onceContent = this.datePickerModule(item);
				break;
			case 'MonthPicker':									//月份选择
				onceContent = this.monthPickerModule(item);
				break;
			case 'RangePicker':									//区间选择
				onceContent = this.rangePickerModule(item);
				break;
			case 'WeekPicker':									//星期选择
				onceContent = this.weekPickerModule(item);
				break;
			case 'TimePicker':									//时间选择
				onceContent = this.timePickerModule(item);
				break;
			case 'Select':										//下拉选择
				onceContent = this.selectModule(item);
				break;
			case 'Cascader':									//级联选择
				onceContent = this.cascaderModule(item);
				break;
			case 'Radio':										//单选
				onceContent = this.radioModule(item);
				break;
			case 'Switch':										//开关
				onceContent = this.switchModule(item);
				break;
			case 'Other':										//其他
				onceContent = this.otherModule(item);
				break;
			default:
				onceContent = '';
				break;
		}

		return(
      <Fragment>
        {
          type !== 'null' ? (
            <Col span={span} key={id} style={{position:'relative'}}>
              {isDelete ? <Icon type="close" className={styles.closeBtn} onClick={deleteFun} /> : ''}
              {onceOther}
              {
                type != '' && type !== 'Other' ? (
                  <Form.Item label={label} style={onceStyle}>
                        {getFieldDecorator(id,{...options})(onceContent)}
                    </Form.Item>
                ) : onceContent
              }
            </Col>
          ) : ''
        }
      </Fragment>

		);
	}

	render(){
		const { formList } = this.props;
		return(
			<div className={styles.formModuleContent}>
				<Row>
					<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
						{
							formList.map((item,index) => this.contentModule(item))
						}
					</Form>
				</Row>
			</div>
		)
	}
}

