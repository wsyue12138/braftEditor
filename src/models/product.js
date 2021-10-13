import {
	getPermissionProductions
} from '../services/productApi'
export default {
  namespace: 'product',
  state: {
    productList:{}
  },

  effects: {
    //获取产品列表
    *fetchGetProductions({ payload, callback }, { call, put }) {
      const response = yield call(getPermissionProductions, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setProductList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
  },

  reducers: {
    setProductList(state, { payload }) {
    	let { data=[],total=0 } = payload.data;
    	let productList = {
    		list:data,
    		total
    	}
      	return {
        	...state,
        	productList
      	};
    },
  },
};
