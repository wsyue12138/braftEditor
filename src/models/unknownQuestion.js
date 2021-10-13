import {
	getGroup,
	getUnknownQestion,
	setIgnore,
	createKnowledge,
	relateKnowledge
} from '../services/unknownQuestionApi'

export default {

  namespace: 'unknownQuestion',

  state: {
  	groupList:[],
  	unknownQestionData:{},
  	selectedRowKeys:[],
  	onceData:{},
  	visible:false,
  	drawerType:''
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //业务分类
    *fetchGetGroup({ payload, callback }, { call, put }) {
      const response = yield call(getGroup, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setGroup',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //列表
    *fetchGetUnknownQestion({ payload, callback }, { call, put }) {
      const response = yield call(getUnknownQestion, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setUnknownQestion',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //忽略
    *fetchSetIgnore({ payload, callback }, { call, put }) {
      const response = yield call(setIgnore, payload);
      if(callback) callback(response)
    },
    //新增
    *fetchCreateKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(createKnowledge, payload);
      if(callback) callback(response)
    },
    //未知问题关联相似
    *fetchRelateKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(relateKnowledge, payload);
      if(callback) callback(response)
    }
  },

  reducers: {
    setGroup(state, { payload }) {
    	const { data={} } = payload.data;
    	let groupList = [];
    	for(let i in data){
    		let obj = {
    			id:i,
    			val:data[i]
    		}
    		groupList.push(obj);
    	}
    	return {
        	...state,
        	groupList
      };
    },
    setUnknownQestion(state, { payload }){
    	let { data=[],total } = payload.data;
    	let unknownQestionData = {
    		list:data,
    		total
    	}
    	return{
    		...state,
    		unknownQestionData
    	}
    },
    setSelect(state, { payload }){
    	const { selectedRowKeys=[] } = payload;
    	return{
    		...state,
    		selectedRowKeys
    	}
    },
    setVisible(state, { payload }){
    	const { visible,drawerType='',onceData={} } = payload;
    	return{
    		...state,
    		visible,
    		drawerType,
    		onceData
    	}
    },
    clearSelectedRowKeys(state, { payload }){
    	return{
    		...state,
    		selectedRowKeys:[]
    	}
    }
  },

};
