import {
	getQaKnowledgePage,
	getQaKnowledgeTree,
	updateQaKnowledge,
	getOriginQaKnowledge,
	getOriginKnowledge,
	auditQaKnowledge,
	tesHandleQaKnowledge,
	enableQaKnowledge,
	getCustomFieldNameByProduction,
	getQaRelateAnswerInfo,
	delQaKnowLedges
} from '../services/multipleApi';

export default {

  namespace: 'multiple',

  state: {
  	multipleData:{
  		list:[],
  		total:0
  	},
  	customFieldName:'补充说明',
  	multipleSearch:{},
  	multiplePageNum:1,
	multiplePageSize:9,
	multipleVisible:false,
	multipleDrawerType:'',
	drawerWidth:422,
	onceData:{},						//列表项
	detailState:false,					//详情状态
	flowChatData:{},
	detailData:{},						//流程图单个数据
	nodeType:0,							//流程图类别
	drawerWidth:422,
	originKnowledge:null
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //获取多轮列表
    *fetchGetQaKnowledgePage({ payload, callback }, { call, put }) {
      const response = yield call(getQaKnowledgePage, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setQaKnowledgePage',
        	payload: response,
      	});
      }else{
      	yield put({
        	type: 'setQaKnowledgeNoData',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取补充说明
    *fetchGetCustomFieldName({ payload, callback }, { call, put }) {
      const response = yield call(getCustomFieldNameByProduction, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setProductions',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
 	//获取多轮详情
    *fetchGetQaKnowledgeTree({ payload, callback }, { call, put }) {
      const response = yield call(getQaKnowledgeTree, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setQaKnowledgeTree',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取单轮修改
    *fetchUpdateQaKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(updateQaKnowledge, payload);
      if(callback) callback(response)
    },
    //获取多轮修改历史
    *fetchGetOriginQaKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(getOriginQaKnowledge, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setOriginQaKnowledge',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取多轮修改历史
    *fetchGetOriginKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(getOriginKnowledge, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setOriginKnowledge',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取单轮审核
    *fetchAuditQaKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(auditQaKnowledge, payload);
      if(callback) callback(response)
    },
    //多轮知识节点处理、处理完成
    *fetchTesHandleQaKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(tesHandleQaKnowledge, payload);
      if(callback) callback(response)
    },
    //多轮知识节点处理、处理完成
    *fetchEnableQaKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(enableQaKnowledge, payload);
      if(callback) callback(response)
    },
    *fetchGetQaRelateAnswerInfo({ payload, callback }, { call, put }) {
      const response = yield call(getQaRelateAnswerInfo, payload);
      if(callback) callback(response)
    },
	*fetchDelQaKnowLedges({ payload, callback }, { call, put }) {
		const response = yield call(delQaKnowLedges, payload);
		if(callback) callback(response)
	}
  },

  reducers: {
  	setQaKnowledgePage(state, { payload }){
  		const { data=[],total=0 } = payload.data;
  		const multipleData = {
  			list:data,
  			total
  		}
  		return{
  			...state,
  			multipleData
  		}
  	},
  	setQaKnowledgeNoData(state, { payload }){
  		const multipleData = {
  			list:[],
  			total:0
  		}
  		return{
  			...state,
  			multipleData
  		}
  	},
  	//设置补充说明label
    setProductions(state,{ payload }){
    	const { data={} } = payload.data;
    	const { customFieldName='备注' } = data;
    	return{
    		...state,
    		customFieldName
    	}
    },
  	//设置搜索内容
  	setMultipleSearch(state, { payload }){
  		let { multipleSearch } = payload;
  		return{
  			...state,
  			multipleSearch
  		}
  	},
  	//设置分页
  	setMultiplePage(state, { payload }){
  		const { multiplePageNum,multiplePageSize=9 } = payload;
  		return{
  			...state,
  			multiplePageNum,
  			multiplePageSize,
  			detailState:false
  		}
  	},
  	//多轮清空搜索
  	clearMultiple(state, { payload }){
  		return{
  			...state,
		  	multipleSearch:{},
		  	multiplePageNum:1,
			multiplePageSize:9,
			multipleVisible:false,
			multipleDrawerType:'',
			drawerWidth:422,
			onceData:{},						//列表项
			detailState:false,					//详情状态
			flowChatData:{},
			detailData:{},						//流程图单个数据
			nodeType:0,							//流程图类别
			drawerWidth:422,
			originKnowledge:null
  		}
  	},
  	//接受新消息数据
    setFromNewsData(state, { payload }){
    	let { id,nodeContent='' } = payload;
    	return{
    		...state,
  			multipleSearch:{id,nodeContent},
  			multiplePageNum:1,
    		multiplePageSize:9
    	}
    },
  	//详情
  	setQaKnowledgeTree(state, { payload }){
  		const { data=[] } = payload.data;
  		return{
  			...state,
  			flowChatData:data
  		}
  	},
  	//多轮抽屉
    setMultipleVisible(state,{ payload }){
    	const { nodeType=0,multipleVisible,multipleDrawerType='',drawerWidth=422,onceData={},detailData={} } = payload;
    	return{
    		...state,
    		multipleVisible,
    		multipleDrawerType,
    		drawerWidth,
    		nodeType,
    		onceData,
    		detailData
    	}
    },
    //显示流程图
    setDetailState(state,{ payload }){
    	const { detailState=false,onceData={} } = payload;
    	return{
    		...state,
    		detailState,
    		onceData
    	}
    },
    //清除修改抽屉
    clearNodeType(state,{ payload }){
    	return{
    		...state,
    		nodeType:0,
    		multipleDrawerType:'',
    		originKnowledge:null
    	}
    },
    setOriginQaKnowledge(state,{ payload }){
    	const { data=null } = payload.data;
    	return{
    		...state,
    		originKnowledge:data
    	}
    },
    setOriginKnowledge(state,{ payload }){
    	const { data=null } = payload.data;
    	return{
    		...state,
    		originKnowledge:data
    	}
    }
  },

};
