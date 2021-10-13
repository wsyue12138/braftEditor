import React,{ useState,useEffect,Fragment } from 'react';
import { Tabs } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import welcomePng from '@assets/welcome.png';
import welcome1 from '@assets/home/welcome1.png';
import welcome2 from '@assets/home/welcome2.png';
import welcome3 from '@assets/home/welcome3.png';
import welcome5 from '@assets/home/welcome5.png';
import welcome6 from '@assets/home/welcome6.png';
import welcome7 from '@assets/home/welcome7.png';
import welcome8 from '@assets/home/welcome8.png';
import welcome9 from '@assets/home/welcome9.png';
import { setDateFormat } from '@utils/utils';
import styles from './Welcome.less';

const { TabPane } = Tabs;

const Welcome = (props) => {

	const { global,user } = props;
	const { menusData=[] } = global;
	const { userdata={} } = user;
	const { belongCompanyName='' } = userdata;

	//tab选择
	const handleTabClick = (val) => {
		let routerUrl = '';
		switch (val){
			case '05050000':
				routerUrl = '/knowledgeManagement/workforce';
				break;
			case '04010000':
				routerUrl = '/dataAnalysis/dataStatistics';
				break;
			case '05010000':
				routerUrl = '/knowledgeManagement/knowledgeBase';
				break;
			case '02010000':
				routerUrl = '/accountManagement/staff';
				break;
			case '06010000':
				routerUrl = '/manMachine/message';
				break;
			case '06020000':
				routerUrl = '/manMachine/customerService';
				break;
			case '03010000':
				routerUrl = '/productService/account';
				break;
			case '04020000':
				routerUrl = '/dataAnalysis/detailed';
				break;
			case '06050000':
				routerUrl = '/manMachine/attendance';
				break;
			default:
				break;
		}
		router.replace(routerUrl);
	}

	//单个模块
	const onceModuleFun = (item) => {
		const { code,title='',content='',imgUrl } = item;
		return(
			<div className={styles.onceBox} onClick={() => handleTabClick(code)}>
				<div className={styles.signBox}>
					<img src={imgUrl} />
				</div>
				<div className={styles.contentLabel}>
					<p>{title}</p>
					<div>{content}</div>
				</div>
			</div>
		)
	}

	//滑块
	const tabsContent = (list) => {
		return(
			<Tabs
				tabPosition='top'
				style={{ height: '100%' }}
			>
		        {
		        	list.map((item,index) => {
		        		const { code } = item;
		        		const onceModule = onceModuleFun(item);
		        		return(
		        			<TabPane tab={onceModule} key={code}>

				            </TabPane>
		        		)
		        	})
		        }
	        </Tabs>
		)
	}

	//无需滑块
	const contentModule = (list) => {
		return(
			<div className={styles.contentModule}>
				<div className={styles.contentList}>
					{
			        	list.map((item,index) => {
			        		const { code } = item;
			        		const onceModule = onceModuleFun(item);
			        		return(
			        			<Fragment key={code}>
			        				{onceModule}
			        			</Fragment>
			        		)
			        	})
			        }
				</div>
			</div>
		)
	}

	//设置列表
	const setList = () => {
		let tabArr = [];
		const list = [
			{code:'05050000',title:'工单管理',content:'知识库相关工单处理情况跟进',imgUrl:welcome1},
			{code:'04010000',title:'知识库数据分析',content:'智能咨询相关数据分析可视化查看',imgUrl:welcome2},
			{code:'05010000',title:'知识库管理',content:'新增编辑语料库问答相关内容',imgUrl:welcome3},
			{code:'06010000',title:'留言记录',content:'来自该产品用户的留言反馈管理',imgUrl:welcome5},
			{code:'06020000',title:'在线客服',content:'支持客服在线与用户实时交流',imgUrl:welcome6},
			{code:'03010000',title:'产品账号管理',content:'人保客服产品登录帐号管理 ',imgUrl:welcome7},
			{code:'04020000',title:'知识库明细查询',content:'各维度智能咨询情况明细查询',imgUrl:welcome8},
			{code:'06050000',title:'考勤信息',content:'客服在线工作情况考勤记录',imgUrl:welcome9}
		]
		list.map((item,index) => {
			const { code } = item;
			const _index = menusData.findIndex((value) => value.permissionCode === code);
			if(_index > 0){
				tabArr.push(item);
			}
		})
		return tabArr;
	}

	const tabArr = setList();
	
	return(
		<div className={styles.welcomeBox}>
			<div className={styles.welcomeContent}>
				<div className={styles.topContent}>
					<div>
						<span>欢迎进入{belongCompanyName}!</span>
						<span className={styles.dateContent}>{setDateFormat(new Date().getTime(),0)}</span>
					</div>
				</div>
				<div
					className={styles.bottomContent}
					style={{padding:tabArr.length > 4 ? '0 120px' : 0}}
				>
					<div className={styles.contentBox}>
						<div className={styles.content}>
							{
								tabArr.length > 4 ? tabsContent(tabArr) : contentModule(tabArr)
							}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		global:state.global,
		user:state.user
	}
}

export default connect(mapStateToProps)(Welcome);
