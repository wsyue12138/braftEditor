import {
	getCommentGroupPage,
	ignoreOrTerminateComment,
	getCommentDetails,
	replyComment
} from '../services/messageApi';
export default {
  namespace: 'message',
  state: {
    messageData:{
    	list:[],
    	total:0
    },
    visible:false,
    drawerType:'',
    onceData:{},
    messageList:[]
  },

  effects: {
  	//列表
    *fetchGetCommentGroupPage({ payload, callback }, { call, put }) {
      const response = yield call(getCommentGroupPage, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setCommentGroupPage',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //忽略、终止
    *fetchIgnoreOrTerminateComment({ payload, callback }, { call, put }) {
      const response = yield call(ignoreOrTerminateComment, payload);
      if(callback) callback(response)
    },
    //忽略、终止
    *fetchGetCommentDetails({ payload, callback }, { call, put }) {
      const response = yield call(getCommentDetails, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setCommentDetails',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //回复
    *fetchReplyComment({ payload, callback }, { call, put }) {
      const response = yield call(replyComment, payload);
      if(callback) callback(response)
    },
  },

  reducers: {
  	setCommentGroupPage(state, {payload}){
  		const { data=[],total=0 } = payload.data;
			const messageData = {
				list:data,
				total
			}
  		return{
  			...state,
  			messageData
  		}
  	},
  	setCommentDetails(state, {payload}){
  		const { data=[] } = payload.data;
  		return{
  			...state,
  			messageList:data
  		}
  	},
  	clearList(state, {payload}){
  		return{
  			...state,
  			messageData:{list:[],total:0},
  			messageList:[]
  		}
  	},
  	clearDetail(state, {payload}){
  		return{
  			...state,
  			messageList:[]
  		}
  	},
    visibleChange(state, {payload}) {
    	const { visible,drawerType='',onceData={} } = payload;
      return { 
      	...state,
      	visible,
      	drawerType,
      	onceData
      };
    },
  },
};
