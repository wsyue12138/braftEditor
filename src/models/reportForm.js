import {
	getCommentStatistic,
	getTransferStatistic,
	getChatTimeStatistic,
	getSatisfactionStatistic,
	getLineChatStatistic
} from '../services/reportFormApi';

export default {

  namespace: 'reportForm',

  state: {
  	commentStatistic:{},
  	transferStatistic:{},
  	chatTimeStatistic:{},
  	satisfactionStatistic:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
     //留言记录统计接口
    *fetchGetCommentStatistic({ payload, callback }, { call, put }) {
      const response = yield call(getCommentStatistic, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setCommentStatistic',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //转人工用户量统计
    *fetchGetTransferStatistic({ payload, callback }, { call, put }) {
      const response = yield call(getTransferStatistic, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setTransferStatistic',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //会话时长统计
    *fetchGetChatTimeStatistic({ payload, callback }, { call, put }) {
      const response = yield call(getChatTimeStatistic, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setChatTimeStatistic',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //评价数量统计
    *fetchGetSatisfactionStatistic({ payload, callback }, { call, put }) {
      const response = yield call(getSatisfactionStatistic, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setSatisfactionStatistic',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //折线图统计
    *fetchGetLineChatStatistic({ payload, callback }, { call, put }) {
      const response = yield call(getLineChatStatistic, payload);
      if(callback) callback(response)
    }
  },

  reducers: {
    setCommentStatistic(state, { payload }) {
    	const { data={} } = payload.data;
    	return {
        ...state,
        commentStatistic:data
      };
    },
    setTransferStatistic(state, { payload }){
    	const { data={} } = payload.data;
    	return{
    		...state,
        transferStatistic:data
    	}
    },
    setChatTimeStatistic(state, { payload }){
    	const { data={} } = payload.data;
    	return{
    		...state,
    		chatTimeStatistic:data
    	}
    },
    setSatisfactionStatistic(state, { payload }){
    	const { data={} } = payload.data;
    	return{
    		...state,
    		satisfactionStatistic:data
    	}
    }
  },

};
