import {
	getNoticePages,
	getUnreadedNoticeCount,
	readNotice
} from '../services/newsApi'
export default {
  namespace: 'news',
  state: {
    newsData:{},
    newsCount:{
    	unreadedNoticeCount:0
    }
  },

  effects: {
    //获取未读消息列表
    *fetchGetNoticePages({ payload, callback }, { call, put }) {
      const response = yield call(getNoticePages, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setNoticePages',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取未读消息个数
    *fetchGetUnreadedNoticeCount({ payload, callback }, { call, put }) {
      const response = yield call(getUnreadedNoticeCount, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setUnreadedNoticeCount',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //设置当前用户未读通知为已读
    *fetchsetReadNotice({ payload, callback }, { call, put }) {
      const response = yield call(readNotice, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setReadNotice',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
  },

  reducers: {
   	setNoticePages(state, { payload }) {
   		const { data=[],total=0 } = payload.data;
   		let newsData = {
   			list:data,
   			total
   		}
      	return {
        	...state,
        	newsData
      	};
    },
    setUnreadedNoticeCount(state, { payload }) {
    	let { data } = payload.data;
    	let { count=0 } = data;
    	let obj = {...state.newsCount};
    	obj.unreadedNoticeCount = count;
    	return {
        	...state,
        	newsCount:obj
      	};
    },
    setReadNotice(state, { payload }) {
    	let { count=0 } = payload.data;
    	let obj = {...state.newsCount};
    	obj.unreadedNoticeCount = 0;
    	return {
        	...state,
        	newsCount:obj
      	};
    },
    clearNoticePages(state, { payload }){
    	return {
        	...state,
        	newsData:{list:[],total:0}
      	};
    }
  }
};
