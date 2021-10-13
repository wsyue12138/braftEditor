import {
	getQuickReplyPages,
	addQuickReply,
	updateQuickReply,
	deleteQuickReply
} from '../services/quickReplyApi'
export default {
  	namespace: 'quickReply',
  	state: {
    	quickReplyData:{
    		list:[],
    		total:0
    	}
  	},

  	effects: {
  		//列表
    	*fetchGetQuickReplyPages({ payload, callback }, { call, put }) {
	      	const response = yield call(getQuickReplyPages, payload);
	      	let { success } = response;
	     	if(success){
	      		yield put({
	        		type: 'setQuickReplyPages',
	        		payload: response,
	      		});
	      	}
	      	if(callback) callback(response)
    	},
    	//新增
    	*fetchAddQuickReply({ payload, callback }, { call, put }) {
	      	const response = yield call(addQuickReply, payload);
	      	if(callback) callback(response)
    	},
    	//编辑
    	*fetchUpdateQuickReply({ payload, callback }, { call, put }) {
	      	const response = yield call(updateQuickReply, payload);
	      	if(callback) callback(response)
    	},
    	//编辑
    	*fetchDeleteQuickReply({ payload, callback }, { call, put }) {
	      	const response = yield call(deleteQuickReply, payload);
	      	if(callback) callback(response)
    	}
  	},

  	reducers: {
    	setQuickReplyPages(state, { payload }) {
    		const { data=[],total=0 } = payload.data;
    		const quickReplyData = {
    			list:data,
    			total
    		}
      		return {
        		...state,
        		quickReplyData
      		};
    	}
  	},
};
