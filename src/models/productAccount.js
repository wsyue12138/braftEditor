import {
	accountList,
	accountUpdate,
	accountCreate
} from '../services/productAccountApi';

export default {

  namespace: 'productAccount',

  state: {
  	accountData:{
  		list:[],
  		total:0
  	}
  },

  effects: {
    //获取账号列表
    *fetchGetAccountList({ payload, callback }, { call, put }) {
      const response = yield call(accountList, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setAccountList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取账号列表
    *fetchAccountCreate({ payload, callback }, { call, put }) {
      const response = yield call(accountCreate, payload);
      if(callback) callback(response)
    },
    //获取账号列表
    *fetchAccountUpdate({ payload, callback }, { call, put }) {
      const response = yield call(accountUpdate, payload);
      if(callback) callback(response)
    }
  },

  reducers: {
    setAccountList(state, { payload }) {
   		const { data=[],total=0 } = payload.data;
			let accountData = {
   			list:data,
   			total
   		}
      return {
        ...state,
        accountData
      };
    },
    clearAccountList(state, { payload }){
    	let accountData = {
    		list:[],
    		total:0
    	}
    	return{
    		...state,
        	accountData
    	}
    }
  },

};
