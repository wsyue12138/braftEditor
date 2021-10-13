import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { 
	Row,
	Col,
	Spin,
	DatePicker
} from 'antd';
import moment from 'moment';
import { Chart } from '@antv/g2';
import { setTimeFormat,setPercentage } from '@utils/utils';
import styles from './ReportForm.less';

@connect(({
	global,
	reportForm
}) => ({
	global,
	reportForm
}))


class ReportForm extends Component{
	
	state = {
		dateData:moment().subtract(1, "days"),
		topSpinning:false,
		bottomSpinning:false
	}
	
	componentDidUpdate(prevProps){
		
	}
	
	componentDidMount(){
		this.chart = null;
		this.getCommentStatistic();
		this.getData();
	}
	
	//留言记录统计
	getCommentStatistic = () => {
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({topSpinning:true});
		dispatch({
			type:'reportForm/fetchGetCommentStatistic',
			payload:{appId:appid},
			callback:(res) => {
				this.getTransferStatistic();
			}
		})
	}
	
	//留言记录统计
	getTransferStatistic = () => {
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({topSpinning:true});
		dispatch({
			type:'reportForm/fetchGetTransferStatistic',
			payload:{appId:appid},
			callback:(res) => {
				this.getChatTimeStatistic();
			}
		})
	}
	
	//会话时长统计
	getChatTimeStatistic = () => {
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({topSpinning:true});
		dispatch({
			type:'reportForm/fetchGetChatTimeStatistic',
			payload:{appId:appid},
			callback:(res) => {
				this.getSatisfactionStatistic();
			}
		})
	}
	
	//评价数量统计
	getSatisfactionStatistic = () => {
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({topSpinning:true});
		dispatch({
			type:'reportForm/fetchGetSatisfactionStatistic',
			payload:{appId:appid},
			callback:(res) => {
				this.setState({topSpinning:false});
			}
		})
	}
	
	//获取数据
	getData = () => {
		const { dateData } = this.state;
		const { dispatch,global } = this.props;
		const { appid='' } = global;
		this.setState({bottomSpinning:true});
		const queryDate = dateData.format('YYYY-MM-DD');
		dispatch({
			type:'reportForm/fetchGetLineChatStatistic',
			payload:{appId:appid,queryDate},
			callback:(res) => {
				const { success } = res;
				let list = [];
				if(success){
					const { data={} } = res.data;
					const { 
						feedbackStatisticList=[],
						receptionStatisticList=[],
						tranIcStatisticList=[]
					} = data;
					list = [...feedbackStatisticList,...receptionStatisticList,...tranIcStatisticList];
				}
				this.setState({bottomSpinning:false},() => {
					this.chart ? this.chart.changeData(list) : this.setChart(list);
				});
			}
		})
	}
	
	//选择
	handleChange = (value) => {
		if(value){
			this.setState({dateData:value},() => {
				this.getData();
			})
		}
	}
	
	//设置图表
	setChart = (data) => {
		this.chart = new Chart({
		  	container: 'chart',
		  	autoFit: true,
		  	height: '100%',
		});
		
		this.chart.data(data);
		this.chart.scale({
		  	time: {
		    	range: [0, 1],
		  	},
		  	value: {
		    	nice: true,
		  	},
		});
		
		this.chart.tooltip({
		  	showCrosshairs: true,
		  	shared: true
		});
		
		//chart.legend(false);
		this.chart.legend({
        	position: 'top-left',
        	itemHeight:80
        });
		
		this.chart
		  .line()
		  .position('hour*num')
		  .color('name',(name,vote) => {
		  		if(name === '转人工用户量'){
		  			return '#752CDF';
		  		}else
		  		if(name === '接待量'){
		  			return '#77DC31';
		  		}else
		  		if(name === '评价数量'){
		  			return '#FF4141';
		  		}
		  })
		  .shape('smooth');
		
		this.chart
		  .point()
		  .position('hour*num')
		  .color('name',(name,vote) => {
		  		if(name === '转人工用户量'){
		  			return '#752CDF';
		  		}else
		  		if(name === '接待量'){
		  			return '#77DC31';
		  		}else
		  		if(name === '评价数量'){
		  			return '#FF4141';
		  		}
		  })
		  .shape('circle')
		  .style({
		    stroke: '#fff',
		    lineWidth: 1,
		  });
			
		this.chart
		  	.area()
		  	//.adjust('stack')
		  	.position('hour*num')
		  	.color('name',(name,vote) => {
			  	if(name === '转人工用户量'){
			  		return 'l(90) 0:#752CDF 1:#ffffff';
			  	}else
			  	if(name === '接待量'){
			  		return 'l(90) 0:#77DC31 1:#ffffff';
			  	}else
			  	if(name === '评价数量'){
			  		return 'l(90) 0:#FF4141 1:#ffffff';
			  	}
		  	})
		  	.shape('smooth')
		this.chart.render();
		this.chart.on('tooltip:change', function(ev) {
			const items = ev.items; // tooltip显示的项
			const list = [...items]
			items.splice(0); // 清空
			list.map((item,index) => {
				const { color,name,value } = item;
				if(color.length === 7){
					items.push(Object.assign({
						name,
					    marker: true,
					    value
					}, item));
				}
			})
		});
	}
	
	//块状表
	topModule(){
		const { topSpinning } = this.state;
		const { reportForm } = this.props;
		const { commentStatistic={},transferStatistic={},chatTimeStatistic={},satisfactionStatistic={} } = reportForm;
		const { invalidCommentNum=0,replyCommentNum=0,totalComment=0 } = commentStatistic;
		const { receptionRate=0,receptionNum=0,totalTransfer=0 } = transferStatistic;
		const { avgFirstResponseTime=0,avgChatTime=0,avgResponseTime=0 } = chatTimeStatistic;
		const { feedBackNum=0,feedBackRate=0,satisfactionRate=0 } = satisfactionStatistic;
		return(
			<div className={styles.topModule}>
				{
					topSpinning ? (
						<div className={styles.spin}>
							<Spin />
						</div>
					) : ''
				}
				<Row gutter={20}>
					<Col span={6}>
						<div className={`${styles.topOnce} ${styles.message}`}>
							<div className={styles.titleBox}>
								<span>留言总量</span>
								<span style={{float:'right',fontSize:22}}>{totalComment}</span>
							</div>
							<div className={styles.content}>
								<p className={styles.first}>
									<span style={{width:100}}>留言回复量</span>
									<span style={{fontSize:22}}>{replyCommentNum}</span>
								</p>
								<p className={styles.second}>
									<span style={{width:100}}>无效留言量</span>
									<span style={{fontSize:22}}>{invalidCommentNum}</span>
								</p>
							</div>
						</div>
					</Col>
					<Col span={6}>
						<div className={`${styles.topOnce} ${styles.user}`}>
							<div className={styles.titleBox}>
								<span>转人工用户量</span>
								<span style={{float:'right',fontSize:22}}>{totalTransfer}</span>
							</div>
							<div className={styles.content}>
								<p className={styles.first}>
									<span style={{width:100}}>接待量</span>
									<span style={{fontSize:22}}>{receptionNum}</span>
								</p>
								<p className={styles.second}>
									<span style={{width:100}}>接待率</span>
									<span style={{fontSize:22}}>{setPercentage(receptionRate)}</span>
								</p>
							</div>
						</div>
					</Col>
					<Col span={6}>
						<div className={`${styles.topOnce} ${styles.duration}`}>
							<div className={styles.titleBox}>
								<span>平均会话时长</span>
								<span style={{float:'right',fontSize:22}}>{setTimeFormat(avgChatTime,0,'en_GB')}</span>
							</div>
							<div className={styles.content}>
								<p className={styles.first}>
									<span style={{width:140}}>平均首次响应时间</span>
									<span style={{fontSize:22}}>{setTimeFormat(avgFirstResponseTime,0,'en_GB')}</span>
								</p>
								<p className={styles.second}>
									<span style={{width:140}}>平均响应时间</span>
									<span style={{fontSize:22}}>{setTimeFormat(avgResponseTime,0,'en_GB')}</span>
								</p>
							</div>
						</div>
					</Col>
					<Col span={6}>
						<div className={`${styles.topOnce} ${styles.evaluate}`}>
							<div className={styles.titleBox}>
								<span>评价数量</span>
								<span style={{float:'right',fontSize:22}}>{feedBackNum}</span>
							</div>
							<div className={styles.content}>
								<p className={styles.first}>
									<span style={{width:100}}>参评率</span>
									<span style={{fontSize:22}}>{setPercentage(feedBackRate)}</span>
								</p>
								<p className={styles.second}>
									<span style={{width:100}}>相对满意度</span>
									<span style={{fontSize:22}}>{setPercentage(satisfactionRate)}</span>
								</p>
							</div>
						</div>
					</Col>
				</Row>
			</div>
		)
	}
	
	//折线表
	bottomModule(){
		const { bottomSpinning } = this.state;
		const disabledDate = (current) => {
  			return current && current > moment().startOf('day');
		}
		return(
			<div className={styles.bottomModule}>
				<div className={styles.bottomContent}>
					{
						bottomSpinning ? (
							<div className={styles.spin}>
								<Spin size="large" />
							</div>
						) : ''
					}
					<div className={styles.linenName}>
						转人工用户量、接待量、评价数量
    					<DatePicker
    						defaultValue={moment().subtract(1, "days")}
    						allowClear={false}
    						disabledDate={disabledDate}
    						format="YYYY-MM-DD"
    						style={{ float:'right',marginTop:9 }} 
    						onChange={this.handleChange} 
    					/>
					</div>
					<div className={styles.linenContent}>
						<div className={styles.box}>
							<div id='chart' style={{width:'100%',height:'100%'}}></div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	
	render(){
		return(
			<div className={styles.reportForm}>
				{this.topModule()}
				{this.bottomModule()}
			</div>
		)
	}
}

export default ReportForm;