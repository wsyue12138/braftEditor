import {
	getChatHistory,
	getChatDetails
} from '../services/conversationApi';

export default {

  namespace: 'conversation',

  state: {
  	conversationData:{
  		list:[],
  		total:0
  	},
  	onceData:{},
  	chatDetails:{
  		list:[],
  		total:0
  	}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
      //获取列表
    *fetchGetChatHistory({ payload, callback }, { call, put }) {
      const response = yield call(getChatHistory, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setChatHistory',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //详情
    *fetchGetChatDetails({ payload, callback }, { call, put }) {
      const response = yield call(getChatDetails, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setChatDetails',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
    setChatHistory(state, { payload }) {
    	const { data=[],total=0 } = payload.data;
    	const conversationData = {
    		list:data,
    		total
    	}
    	return {
        ...state,
        conversationData
      };
    },
    setOnceData(state, { payload }){
    	const { onceData={} } = payload;
    	return {
        ...state,
        onceData
      };
    },
    setChatDetails(state, { payload }){
    	const { data=[],total=0 } = payload.data;
    	const chatDetails = {
    		list:data,
    		total
    	}
    	return {
        ...state,
        chatDetails
      };
    },
    clearOnce(state, { payload }){
    	return {
        ...state,
        onceData:{},
        chatDetails:{list:[],total:0}
      };
    }
  },

};
