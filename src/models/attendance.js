import {
	getWorkReportPage
} from '../services/attendanceApi';

export default {

  namespace: 'attendance',

  state: {
  	attendanceData:{
  		list:[],
  		total:100
  	}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
     // 获取列表
    *fetchGetWorkReportPage({ payload, callback }, { call, put }) {
      const response = yield call(getWorkReportPage, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setWorkReportPage',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
    setWorkReportPage(state, { payload }) {
    	const { data=[],total=0 } = payload.data;
    	const attendanceData = {
    		list:data,
    		total
    	}
    	return {
        ...state,
       	attendanceData
      };
    }
  },

};
