import {
	serviceConsult
} from '../services/serviceDetailsApi'

export default {
  namespace: 'serviceDetails',
  state: {
    serviceConsultData:{
    	list:[],
    	total:0
    }
  },

  effects: {
    //获取用户信息
    *fetchGetServiceConsult({ payload, callback }, { call, put }) {
      const response = yield call(serviceConsult, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setServiceConsult',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
  	setServiceConsult(state,{ payload }){
  		const { data=[],total=0 } = payload.data;
  		let serviceConsultData = {
  			list:data,
  			total
  		}
  		return{
  			...state,
  			serviceConsultData
  		}
  	}
  },
};
