import {
	qaQuality
} from '../services/serviceQualityDetailsApi'

export default {
  namespace: 'serviceQualityDetails',
  state: {
    qaQualityData:{
    	list:[],
    	total:0
    }
  },

  effects: {
    //获取用户信息
    *fetchGetQaQuality({ payload, callback }, { call, put }) {
      const response = yield call(qaQuality, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setQaQuality',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
  	setQaQuality(state,{ payload }){
  		const { data=[],total=0 } = payload.data;
  		let qaQualityData = {
  			list:data,
  			total
  		}
  		return{
  			...state,
  			qaQualityData
  		}
  	}
  },
};
