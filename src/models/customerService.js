import {
	getRecommendReply,
	getQuickReply
} from '../services/customerServiceApi';
export default {
  namespace: 'customerService',
  state: {
  	sendContent:'',
  	recommendReply:[],
	quickReply:[]
  },

  effects: {
    // 获取推荐回复列表
    *fetchGetRecommendReply({ payload, callback }, { call, put }) {
      const response = yield call(getRecommendReply, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setRecommendReply',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    // 获取快捷回复列表
    *fetchGetQuickReply({ payload, callback }, { call, put }) {
      const response = yield call(getQuickReply, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setQuickReply',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
  	//输入内容
  	changeContent(state, {payload}){
  		const { sendContent } = payload;
  		return{
   			...state,
   			sendContent
   		}
  	},
   	setRecommendReply(state, {payload}){
   		const { data=[] } = payload.data;
   		return{
   			...state,
   			recommendReply:data
   		}
   	},
   	setQuickReply(state, {payload}){
   		const { data=[] } = payload.data;
   		return{
   			...state,
   			quickReply:data
   		}
   	}
  },
};
