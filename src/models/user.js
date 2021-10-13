import {
	getUserInfo,
	getPublicKey
} from '../services/userApi'

export default {
  namespace: 'user',
  state: {
    userdata: undefined
  },

  effects: {
    //获取用户信息
    *fetchGetUserInfo({ payload, callback }, { call, put }) {
      const response = yield call(getUserInfo, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setUserInfo',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //获取用户信息
    *fetchGetPublicKey({ payload, callback }, { call, put }) {
      const response = yield call(getPublicKey, payload);
      if(callback) callback(response)
    }
  },

  reducers: {
    setUserData(state, { payload }) {
      	return {
        	...state,
        	userdata:payload
      	};
    },
    setUserInfo(state, { payload }) {
    	let { data={} } = payload.data;
    	let userdata = data ? data : {};
      	return {
        	...state,
        	userdata
      	};
    },
    setPermissionInfo(state, { payload }) {
    	let { data } = payload.data;
      	return {
        	...state,
        	permissionInfo:data
      	};
    }
  },
};
