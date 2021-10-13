import React,{Component,Fragment} from 'react';
import { connect } from 'dva';
import { 
	Button
} from 'antd';
import FlowChart from '@components/FlowChart';
import styles from './style.less';

class MultipleProcedure extends Component{
	
	componentDidMount(){
		const { readonly=false } = this.props;
		if(!readonly){
			this.props.onRef(this);
		}
	}
	
	handleCloseDetail = () => {
		const { dispatch,getList } = this.props;
		dispatch({
			type:'multiple/setDetailState',
			payload:{detailState:false}
		})	
		getList(true);
	}
	
	//绑定组件
	onRef = (ref) => {
		this.childModule = ref; 
	}
	
	//获取流程图数据
	getFlowChartData = () => {
		
	}
	
	//构建流程图
	setFlowChart = () => {
		this.childModule.getDatas();
	}
	
	render(){
		const { readonly=false } = this.props;
		let contentStyle;
		if(readonly){
			contentStyle = {
				height:'100%',
				paddingBottom:0
			}
		}else{
			contentStyle = {
				height:780,
				paddingBottom:55
			}
		}
		return(
			<div 
				className={styles.procedureContent} 
				style={contentStyle}
			>
				<div className={styles.content}>
					<div className={styles.signBox}>
						<div className={styles.sign}>
							<span>待审核</span>
							<span>审核通过</span>
							<span>操作中</span>
							<span>待生效</span>
							<span>锁定</span>
							<span>停用</span>
						</div>
						<div>(未带标识即为启用状态)</div>
					</div>
					<FlowChart {...this.props} onRef={this.onRef} />
				</div>
				{
					!readonly ? (
						<div className={styles.btnBox}>
							<Button onClick={this.handleCloseDetail}>返回</Button>
						</div>
					) : ''
				}
			</div>
		)
	}
}

export default MultipleProcedure;
