import {
	getProductionList,
    createProduction,
    updateProduction,
	getRoleList,
    getCompanys,
    getKnowledgeProjectListByProduction,
    getDimensionTree,
	getOneLevelCategoryByCompany
} from '../services/productManagementApi'
import { handleCode } from '../utils/utils'
export default {
  namespace: 'productManagement',
  state: {
	name:'产品列表',
    productionData:{},
    roleList:[],
    dimensions:[],
    dimensionList:[{}]
  },

  effects: {
    //获取产品列表
    *fetchGetProductionList({ payload, callback }, { call, put }) {
      const response =handleCode( yield call(getProductionList, payload));
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setProductionList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    
    //获取产品下的知识项目列表
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
	
    //产品创建
    *fetchCreateProduction({ payload, callback }, { call, put }) {
		const response = yield call(createProduction, payload);
		let { success } = response;
		if(callback) callback(response)
    },
    
    //产品更新
    *fetchUpdateProduction({ payload, callback }, { call, put }) {
        const response = yield call(updateProduction, payload);
        let { success } = response;
        
        if(callback) callback(response)
    },

	//角色查询
	*fetchGetRoleList({ payload, callback }, { call, put }) {
		const response = yield call(getRoleList, payload);
		let { success } = response;
		if(success){
			yield put({
				type: 'setRoleList',
				payload: response,
			});
		}
		if(callback) callback(response)
	},

	//企业列表查询
	*fetchGetCompanys({ payload, callback }, { call, put }) {
		const response = yield call(getCompanys, payload);
		let { success } = response;
		if(success){
			yield put({
				type: 'setCompanys',
				payload: response,
			});
		}
		if(callback) callback(response)
	},
	//获取产品统计维度树
	*fetchGetDimensionTree({ payload, callback }, { call, put }) {
		const response = yield call(getDimensionTree, payload);
		let { success } = response;
		if(callback) callback(response)
	},
	//获取企业对应的一级类目
	*fetchGetOneLevelCategoryByCompany({ payload, callback }, { call, put }) {
		const response = yield call(getOneLevelCategoryByCompany, payload);
		if(callback) callback(response)
	},
  },

  reducers: {
	//   存产品列表
    setProductionList(state, { payload }) {
		const { data=[],total=0 } = payload.data;
		const productionData = {
			list:data,
			total
		}
      	return {
        	...state,
        	productionData
      	};
	},
	//   存角色列表
    setRoleList(state, { payload }) {
    	let { data=[] } = payload.data;
      	return {
        	...state,
        	roleList:data
      	};
    },	
	//   存企业列表
    setCompanys(state, { payload }) {
    	let { data=[] } = payload.data;
      	return {
        	...state,
        	companyList:data
      	};
    },
    setKnowledgeProject(state, { payload }) {
        let { data=[] } = payload.data;
      	return {
        	...state,
        	knowledgeProject:data
      	};
    },
    setDimensionList(state, { payload }){
    	const { dimensions,dimensionList } = payload;
    	return {
        	...state,
        	dimensions,
        	dimensionList
      	};
    },
	setOneLevelCategoryByCompany(state, { payload }){
    	console.log(payload)
    	return {
        	...state
      	};
    }
  }
};
