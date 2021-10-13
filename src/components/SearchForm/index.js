import React,{ Component,Fragment } from 'react';
import {
	Form,
	Input,
	Icon,
	Button,
	Select,
	Cascader,
	TimePicker,
	DatePicker
} from 'antd';
import styles from './style.less';

const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

/**
 * author：wsyue
 * searchList:表单数组
 * item：{
 * 		type：表单类型,
 * 		onceStyle:单个form样式
 * 		label:表单标题
 * 		id:表单id
 * 		options：表单操作相关
 * 		domOptions：dom的kpi,
 * 		custom:自定义元素,
 * 		btnTitle:按钮文字,
 * 		iconType：按钮内图标
 * }
 *
 * **/


export default class SearchFormModule extends Component{

	state = {

	}

	//其他
	domModule = (item) => {
		const { custom='' } = item;
		return <Fragment>{custom}</Fragment>;
	}

	//input模块
	inputModule = (item) => {
		const { domOptions={},domStyle={},iconType } = item;
		const iconDom = iconType ? <Icon type={iconType} style={{color:'rgba(0, 0, 0, 0.25)'}}/> : '';
		return <Input prefix={iconDom} {...domOptions} allowClear style={domStyle} />;
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
			<Select {...domOptions} allowClear style={domStyle}>
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
		return <Cascader {...domOptions} allowClear style={domStyle} />
	}

	//按钮模块
	buttonModule = (item) => {
		const { domOptions={},domStyle={},btnTitle='',iconType } = item;
		return(
			<Button {...domOptions} style={domStyle}>
          		{ btnTitle }
          		{ iconType ? <Icon type={iconType} /> : ''}
          	</Button>
		)
	}

	contentModule = (item,index) => {
		const { form:{getFieldDecorator},searchList=[] } = this.props;
		const { type,id='',onceOptions={},onceStyle={} } = item;
		const _len = searchList.length - 1;
		let onceContent = '';
		switch (type){
			case 'Dom':											//自定义dom
				onceContent = this.domModule(item);
				break;
			case 'Input':										//input输入框
				onceContent = this.inputModule(item);
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
			case 'Button':										//按钮
				onceContent = this.buttonModule(item);
				break;
			default:
				break;
		}
		const idTxt = type === 'Button' || type === 'Dom' ? 'btn_' + index : id;
		let itemStyle = {...onceStyle};
		if(type !== 'Button'){
			if(index !== _len && type !== 'Dom'){
				const nextObj = searchList[index + 1];
				if(nextObj.type === 'Button'){
					itemStyle = {...onceStyle,marginRight:16}
				}
			}
		}else{
			itemStyle = {...onceStyle,marginRight:20}
		}

		return(
			<Fragment key={idTxt}>
				{
					type != '' && type != 'null' ? (
						<Form.Item style={itemStyle}>
					        {getFieldDecorator(idTxt,onceOptions)(onceContent)}
					    </Form.Item>
					) : ''
				}
			</Fragment>
		)
	}

	render(){
		const { searchList=[] } = this.props;
		return(
			<div className={styles.searchFormBox}>
				<Form layout="inline">
					{
						searchList.map((item,index) => this.contentModule(item,index))
					}
				</Form>
			</div>
		)
	}
}


