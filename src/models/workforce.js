import {
	statistics,
	workforceList,
	createWorkforce,
	handleWorkforce,
	deleteWorkforce
} from '../services/workforceApi';

export default {

	namespace: 'workforce',

	state: {
		statistics:{},
		workforceData: {
			list: [],
			total: 0
		},
		onceData:{}
	},

	subscriptions: {
		setup({
			dispatch,
			history
		}) { // eslint-disable-line
		},
	},

	effects: {
		//获取工单统计信息
		*fetchStatistics({payload,callback}, {call,put}) {
			const response = yield call(statistics, payload);
			let {success} = response;
			if(success) {
				yield put({
					type: 'setStatistics',
					payload: response,
				});
			}
			if(callback) callback(response)
		},
		//获取工单分页列表信息
		*fetchWorkforceList({payload,callback}, {call,put}) {
			const response = yield call(workforceList, payload);
			let {success} = response;
			if(success) {
				yield put({
					type: 'setWorkforceList',
					payload: response,
				});
			}
			if(callback) callback(response)
		},
		//创建工单
		*fetchCreateWorkforce({payload,callback}, {call,put}) {
			const response = yield call(createWorkforce, payload);
			if(callback) callback(response)
		},
		//处理工单
		*fetchHandleWorkforce({payload,callback}, {call,put}) {
			const response = yield call(handleWorkforce, payload);
			if(callback) callback(response)
		},
		//删除工单
		*fetchDeleteWorkforce({payload,callback}, {call,put}) {
			const response = yield call(deleteWorkforce, payload);
			if(callback) callback(response)
		}
	},

	reducers: {
		setStatistics(state, {payload}) {
			const { data={} } = payload.data;
			return {
				...state,
				statistics:data
			};
		},
		setWorkforceList(state, {payload}){
			let { data=[],total=0 } = payload.data;
			let workforceData = {
				list:data,
				total
			}
			return {
				...state,
				workforceData
			};
		},
		saveOnceData(state, {payload}){
			let { onceData } = payload;
			return {
				...state,
				onceData
			};
		},
		clearWorkforce(state, {payload}){		//组件卸载清空
			return {
				...state,
				statistics:{},
				workforceData: {
					list: [],
					total: 0
				},
				onceData:{}
			};
		},
	},

};