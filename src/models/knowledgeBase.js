import {
	getCatagoryTree,
	getSingleHistoryList,
	getMultipleHistoryList,
	getKnowledgeProjectListByProduction,
	getCategoryTreeByProductAndPermission
} from '../services/knowledgeBaseApi';

export default {

  namespace: 'knowledgeBase',

  state: {
  	productList:[],
  	serviceList:[],
  	productKey:undefined,
  	productValue:[],
  	historyData:[],
  	fromNews:'',
  	knowledgeProject:[],
	operationTree:{}
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //获取类目树
    *fetchGetCatagoryTree({ payload, callback }, { call, put }) {
      const response = yield call(getCatagoryTree, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setCatagoryTree',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取单轮历史记录
    *fetchGetSingleHistoryList({ payload, callback }, { call, put }) {
      const response = yield call(getSingleHistoryList, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setKnowledgeHistoryList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取多轮历史记录
    *fetchGetMultipleHistoryList({ payload, callback }, { call, put }) {
      const response = yield call(getMultipleHistoryList, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setKnowledgeHistoryList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取知识库项目
    *fetchGetKnowledgeProject({ payload, callback }, { call, put }) {
      const response = yield call(getKnowledgeProjectListByProduction, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setKnowledgeProject',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
	//权限类目
	*fetchGetTreeByPermission({ payload, callback }, { call, put }) {
		const response = yield call(getCategoryTreeByProductAndPermission, payload);
		let { success } = response;
		if(success){
			yield put({
				type: 'setTreeByPermission',
				payload: response,
			});
		}
		if(callback) callback(response)
	}
  },

  reducers: {
  	setCatagoryTree(state, { payload }){
  		const { data={} } = payload.data;
  		let productList = [...data];
  		return{
  			...state,
  			productList,
  			serviceList:data
  		}
  	},
    setProductKey(state, { payload }){
    	const { productKey,productValue={} } = payload;
    	return{
    		...state,
    		productKey,
    		productValue
    	};
    },
    //消息跳转
    setFromNewsData(state, { payload }){
    	const { id } = payload;
    	return{
    		...state,
    		productKey:undefined,
    		fromNews:id
    	};
    },
    setBtnType(state, { payload }){
    	const { btnType } = payload;
    	return{
    		...state,
    		btnType
    	}
    },
    //获取历史记录
    setKnowledgeHistoryList(state,{ payload }){
    	const { data=[] } = payload.data;
    	return{
    		...state,
    		historyData:data
    	}
    },
    //获取历史记录
    clearKnowledgeHistoryList(state,{ payload }){
    	return{
    		...state,
    		historyData:[]
    	}
    },
    setKnowledgeProject(state,{ payload }){
    	let { data=[] } = payload.data;
    	return{
    		...state,
    		knowledgeProject:data
    	}
    },
    clearData(state,{ payload }){
    	
    	return{
    		...state,
    		productList:[],
		  	serviceList:[],
		  	productKey:undefined,
		  	historyData:[],
		  	fromNews:'',
		  	knowledgeProject:[]
    	}
    },
	setTreeByPermission(state,{ payload }){
		const { data } = payload.data;
		const operationTree = data ? data : {};
		return{
    		...state,
			operationTree
    	}
	}
  },

};
