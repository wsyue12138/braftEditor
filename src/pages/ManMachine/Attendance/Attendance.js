import React,{ Component } from 'react';
import { connect } from 'dva';
import { 
	Form,
	Icon,
	Button,
	message,
	Popover
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import ExcelExport from '@components/ExcelExport';
import { setTimeFormat,setPercentage,getUserData,setDateFormat } from '@utils/utils';
import styles from './Attendance.less';

@connect(({
	global,
	attendance
}) => ({
	global,
	attendance
}))

@Form.create()

class Attendance extends Component{
	
	state = {
		loading:false,
		searchData:{},
		pageNum:1,
		pageSize:10
	}
	
	componentDidMount(){
		this.getList();
	}
	
	//获取列表
	getList = () => {
		const { searchData,pageNum,pageSize } = this.state;
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({topSpinning:true});
		dispatch({
			type:'attendance/fetchGetWorkReportPage',
			payload:{...searchData,appId:appid,pageNum,pageSize},
			callback:(res) => {
				const { success=false } = res;
				if(success){
					this.setState({topSpinning:false});
				}
			}
		})
	}
	
	//搜索
	handleSearch = () => {
		const { form:{validateFields} } = this.props;
		validateFields(['search_createTime','staffName'],(err, values) => {
			const { search_createTime=[],staffName } = values;
			let searchData = {
				staffName
			}
			if(search_createTime.length){
				searchData.startTime = search_createTime[0].format('YYYY-MM-DD');
				searchData.endTime = search_createTime[1].format('YYYY-MM-DD');
			}
			this.setState({searchData,pageNum:1},() => {
				this.getList();
			})
		})
	}
	
	//导出模块
	exportModule(){
		const { data={} } = getUserData();
		const { token=''} = data;
		const { searchData } = this.state;
		const { global:{appid} } = this.props;
		const params = {...searchData,appid}
		const newTime = setDateFormat(new Date().getTime(),4);
		const options = {
			action:'/icservice/csWorkReport/exportWorkReport',
			headers:{
				'Content-Type': 'application/json;charset=GB2312',
                credentials: 'same-origin',
                token
			},
			data:{...params},
			fileName:`人机协作考勤信息${newTime}`
		}
		return(
			<ExcelExport {...options} />
		)
		
	}

	//搜索
	searchModule(){
		const searchList = [
			{
				type:'RangePicker',
				id:'search_createTime',
				domOptions:{format:"YYYY-MM-DD",placeholder:['查询日期','']},
				domStyle:{width:250}
			},
			{
				type:'Input',
				id:'staffName',
				iconType:'edit',
				domOptions:{placeholder:'客服姓名'},
				domStyle:{width:250}
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.handleSearch}
			},
			{
				type:'Dom',
				onceStyle:{marginRight:20},
				custom:this.exportModule()
			},
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}
	
	//列表
	listModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { attendance } = this.props;
		const { attendanceData={} } = attendance;
		const { list=[],total=0 } = attendanceData;
		let columns = [
			{
				title: '日期',
				key: 'statisticTime',
				width:'10%',
				render: record => {
					let { statisticTime='' } = record;
					return(
						<span>{statisticTime}</span>
					)
				}
			},
			{
				title: '客服',
				key: 'name',
				ellipsis:true,
				width:'5%',
				render: record => {
					let { staffName,staffId='' } = record;
					const name = staffName ? staffName : staffId;
					return(
						<span title={name}>{name}</span>
					)
				}
			},
			{
				title: '登录时长',
				key: 'loginDuration',
				width:'10%',
				render: record => {
					let { loginDuration='' } = record;
					return(
						<span>{setTimeFormat(loginDuration)}</span>
					)
				}
			},
			{
				title: '在线时长',
				key: 'onlineDuration',
				width:'9%',
				render: record => {
					let { onlineDuration='' } = record;
					return(
						<span>{setTimeFormat(onlineDuration)}</span>
					)
				}
			},
			{
				title: '挂起时长',
				key: 'hangupDuration',
				width:'10%',
				render: record => {
					let { hangupDuration='' } = record;
					return(
						<span>{setTimeFormat(hangupDuration)}</span>
					)
				}
			},
			{
				title: '接待量',
				key: 'receptionNum',
				width:'5%',
				render: record => {
					let { receptionNum=0 } = record;
					return(
						<span>
							{receptionNum}
						</span>
					)
				}
			},
			{
				title: '平均会话时长',
				key: 'avgChatDuration',
				width:'9%',
				render: record => {
					let { avgChatDuration='' } = record;
					return(
						<span>
							{setTimeFormat(avgChatDuration)}
						</span>
					)
				}
			},
			{
				title: '平均响应时长',
				key: 'avgResponseDuration',
				width:'10%',
				render: record => {
					let { avgResponseDuration='' } = record;
					return(
						<span>
							{setTimeFormat(avgResponseDuration)}
						</span>
					)
				}
			},
			{
				title: '相对满意度',
				key: 'satisfactionRate',
				width:'9%',
				render: record => {
					let { satisfactionRate=0,satisfactionInfo="[]" } = record;
					const list = JSON.parse(satisfactionInfo);
					let content = '';
					if(list.length){
						content = (
							<div className={styles.satisfactionContent}>
								{
									list.map((item,index) => {
										const itemArr = item.split(':');
										return(
											<div key={index}>
												<span className={styles.label}>{`${itemArr[0]} : `}</span>
												<span className={styles.num}>{itemArr[1]}</span>
											</div>
										)
									})
								}
							</div>
						)
					}
					return(
						<div>
							<span style={{marginRight:6}}>
								{setPercentage(satisfactionRate)}
							</span>
							{
								list.length ? (
									<Popover placement="rightTop" title='' content={content} trigger="hover">
										<Icon 
											type="info-circle"
											theme='filled'
											style={{cursor:'pointer',color:'#FFC75F'}}
										/>
									</Popover>
								) : ''
							}
						</div>
					)
				}
			},
			{
				title: '首次登录时间',
				key: 'firstLoginTime',
				width:'10%',
				render: record => {
					let { firstLoginTime='' } = record;
					return(
						<span>
							{firstLoginTime}
						</span>
					)
				}
			},
			{
				title: '最后登出时间',
				key: 'endTime',
				width:'13%',
				render: record => {
					let { lastLogoutTime='',loginInfo="[]" } = record;
					let list = JSON.parse(loginInfo);
					const setContent = () => {
						return(
							<div className={styles.endTimeContent}>
								{
									list.map((item,index) => {
										return(
											<div key={index}>
												<span>{item}</span>
											</div>
										)
									})
								}
							</div>
						)
					}
					return(
						<div>
							<span style={{marginRight:6}}>
								{lastLogoutTime}
							</span>
							{
								lastLogoutTime && list.length ? (
									<Popover 
										placement="leftTop" 
										title='' 
										content={setContent()} 
										trigger="hover"
										overlayClassName={styles.lastLogoutTime}
									>
										<Icon 
											type="info-circle"
											theme='filled'
											style={{cursor:'pointer',color:'#FFC75F'}}
										/>
									</Popover>
								) : ''
							}
						</div>
						
					)
				}
			}
		]
		
		const tableOptions = {
			onceKey:'id',
			loading,
			dataSource:list,
			columns
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize,
	  		onChange: (current, pageSize) => {
	  			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			})
	  		},
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}
	
	render(){
		return(
			<div className={styles.attendance}>
				{this.searchModule()}
				{this.listModule()}
			</div>
		)
	}
}

export default Attendance;