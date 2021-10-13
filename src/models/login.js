import {
	userLogin,
	changePwd,
	resetPwd,
	disablePwd,
	unDisablePwd,
	logout
} from '../services/loginApi'
export default {
  namespace: 'login',
  state: {
    status:undefined
  },

  effects: {
  	//登录
    *fetchLogin({ payload, callback }, { call, put }) {
      // 登录提交
      const response = yield call(userLogin, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'signLogin',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //修改
    *fetchChangePwd({ payload, callback }, { call, put }) {
      const response = yield call(changePwd, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setChangePwd',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
    //重置
    *fetchResetPwd({ payload, callback }, { call, put }) {
      const response = yield call(resetPwd, payload);
      if(callback) callback(response)
    },
    //禁用
    *fetchDisablePwd({ payload, callback }, { call, put }) {
      const response = yield call(disablePwd, payload);
      if(callback) callback(response)
    },
    //启用
    *fetchUnDisablePwd({ payload, callback }, { call, put }) {
      const response = yield call(unDisablePwd, payload);
      if(callback) callback(response)
    },
    //退出登录
    *fetchLogout({ payload, callback }, { call, put }) {
      const response = yield call(logout, payload);
      if(callback) callback(response)
    }
  },

  reducers: {
    signLogin(state, { payload }) {
      	return {
        	...state,
        	status:1
      	};
    },
    setChangePwd(state, { payload }) {
      	return {
        	...state,
        	status:2
      	};
    },
  },
};
