import {
	getSingleKnowledgePages,
	singleDelete,
	singleEnable,
	singleExamine,
	tesHandleKnowledge,
	singleAdd,
	singleUpdate,
	getCustomFieldNameByProduction,
	//getKnowledgeHistoryList,
	getOriginKnowledge,
	getSimilarKnowledgePage,
	associateSimilarKnowledge,
	getRelateAnswerInfo,
	batchUpdate,
	batchAuditKnowledge,
	batchDelete,
	userKnowledgePermission,
	getCategoryTreeByProductAndPermission
} from '../services/singleApi';

export default {

  namespace: 'single',

  state: {
  	singleData:{
  		list:[],
  		total:0
  	},
  	singleSearch:{},
  	singlePageNum:1,
	singlePageSize:9,
	singleDrawerType:'',
	singleVisible:false,
	majorList:[],
	drawerWidth:422,
	similarData:{
		list:[],
		total:0
	},
	onceData:{},
	parentData:undefined,
	customFieldName:'补充说明',
	detailData:{},
	originKnowledge:null,
	similarOnce:undefined
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //获取单轮列表
    *fetchGetSingleKnowledgePages({ payload, callback }, { call, put }) {
      const response = yield call(getSingleKnowledgePages, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setSingleKnowledgePages',
        	payload: response,
      	});
      }else{
      	yield put({
        	type: 'setSingleKnowledgeNoData',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取单轮删除
    *fetchSingleDelete({ payload, callback }, { call, put }) {
      const response = yield call(singleDelete, payload);
      if(callback) callback(response)
    },
    //生效
    *fetchSingleEnable({ payload, callback }, { call, put }) {
      const response = yield call(singleEnable, payload);
      if(callback) callback(response)
    },
    //审核
    *fetchSingleExamine({ payload, callback }, { call, put }) {
      const response = yield call(singleExamine, payload);
      if(callback) callback(response)
    },
    //处理、新增完成
    *fetchTesHandleKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(tesHandleKnowledge, payload);
      if(callback) callback(response)
    },
    //添加
    *fetchSingleAdd({ payload, callback }, { call, put }) {
      const response = yield call(singleAdd, payload);
      if(callback) callback(response)
    },
    //编辑
    *fetchSingleUpdate({ payload, callback }, { call, put }) {
      const response = yield call(singleUpdate, payload);
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
    //审核修改记录
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
    //获取知识分页列表接口
    *fetchGetSimilarKnowledgePage({ payload, callback }, { call, put }) {
      const response = yield call(getSimilarKnowledgePage, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setSimilarKnowledgePage',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //关联相似
    *fetchAssociateSimilarKnowledge({ payload, callback }, { call, put }) {
      const response = yield call(associateSimilarKnowledge, payload);
      if(callback) callback(response)
    },
    //关联相似
    *fetchGetRelateAnswerInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRelateAnswerInfo, payload);
      if(callback) callback(response)
	},
	//单轮知识批量更新接口
    *fetchBatchUpdate({ payload, callback }, { call, put }) {
		const response = yield call(batchUpdate, payload);
		if(callback) callback(response)
	},
	//单轮知识批量审核接口
	*fetchBatchAuditKnowledge({ payload, callback }, { call, put }) {
		const response = yield call(batchAuditKnowledge, payload);
		if(callback) callback(response)
	},
	//单轮知识批量删除知识接口
	*fetchBatchDelete({ payload, callback }, { call, put }) {
		const response = yield call(batchDelete, payload);
		if(callback) callback(response)
	},
	//单轮知识库操作权限查询接口
	*fetchUserKnowledgePermission({ payload, callback }, { call, put }) {
		const response = yield call(userKnowledgePermission, payload);
		if(callback) callback(response)
	}
  },

  reducers: {
  	setSingleKnowledgePages(state, { payload }){
  		const { data=[],total=0 } = payload.data;
  		const singleData = {
  			list:data,
  			total
  		}
  		return{
  			...state,
  			singleData
  		}
  	},
  	setSingleKnowledgeNoData(state, { payload }){
  		const singleData = {
  			list:[],
  			total:0
  		}
  		return{
  			...state,
  			singleData
  		}
  	},
  	//单轮搜索内容
  	setSingleSearch(state, { payload }){
  		let { singleSearch } = payload;
  		return{
  			...state,
  			singleSearch
  		}
  	},
    //单轮列表分页
    setSinglePage(state, { payload }){
    	const { singlePageNum,singlePageSize=9 } = payload;
    	return{
    		...state,
    		singlePageNum,
    		singlePageSize
    	}
    },
    //单轮清空搜索
    clearSingle(state, { payload }){
    	return{
    		...state,
		  	singleSearch:{},
		  	singlePageNum:1,
			singlePageSize:9,
			singleDrawerType:'',
			singleVisible:false,
			majorList:[],
			drawerWidth:422,
			similarData:{
				list:[],
				total:0
			},
			onceData:{},
			onceType:'',
			detailData:{},
			originKnowledge:null
    	}
    },
    //接受新消息数据
    setFromNewsData(state, { payload }){
    	let { id,question='' } = payload;
    	return{
    		...state,
  			singleSearch:{id,question},
  			singlePageNum:1,
    		singlePageSize:9
    	}
    },
    //单轮抽屉
    setSingleVisible(state,{ payload }){
    	const { singleVisible,singleDrawerType='',drawerWidth=422,onceData={},onceType='all',parentData=undefined } = payload;
    	return{
    		...state,
    		singleVisible,
    		singleDrawerType,
    		drawerWidth,
			onceData,
			onceType,
			parentData
    	}
    },
    //清除onceData
    clearOnceData(state,{ payload }){
    	return{
    		...state,
    		onceData:{}
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
    //关联相似查看
    setSimilarOnce(state,{ payload }){
    	const { onceData } = payload;
    	return{
    		...state,
    		detailData:onceData
    	}
    },
    setOriginKnowledge(state,{ payload }){
    	const { data=null } = payload.data
    	return{
    		...state,
    		originKnowledge:data
    	}
    },
    //清除originKnowledge
    clearOriginKnowledge(state,{ payload }){
    	return{
    		...state,
    		originKnowledge:null
    	}
    },
    //相似问句分页
    setSimilarKnowledgePage(state,{ payload }){
    	const { data=[],total=0 } = payload.data;
    	let similarData = {
    		list:data,
    		total
    	}
    	return{
    		...state,
    		similarData
    	}
    },
    //清除相似问句分页
    clearSimilarKnowledgePage(state,{ payload }){
    	let similarData = {
    		list:[],
    		total:0
    	}
    	return{
    		...state,
    		similarData
    	}
	}
  },

};
