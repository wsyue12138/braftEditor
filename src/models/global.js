import {
	getPermissionInfo,
	getIndependentPermissionInfo
} from '../services/globalApi'
import { setAuthority } from '../utils/utils';

export default {

  namespace: 'global',

  state: {
  	collapsed: false,
    messageStatus: false,
    appid:'',
    productName:'',
    productionId:'',
    userPermissionVos:[],
    menusData:[],
    routeData:[],
    workforceAuthority:{},
    knowledgeAuthority:{},
    independentMenusData:[],
    unreadNum:0,
	initQueryMsg:0,
	keepingMessagesCount:0
  },

  subscriptions: {
    setup({ dispatch, history }) {  // eslint-disable-line
    },
  },

  effects: {
    //获取当前用户的权限信息接口
    *fetchGetPermissionInfo({ payload, callback }, { call, put }) {
      	const response = yield call(getPermissionInfo, payload);
      	let { success } = response;
      	if(success){
      		yield put({
        		type: 'setPermissionInfo',
        		payload: response,
      		});
      	}
      	if(callback) callback(response)
    },
    //获取当前用户的权限信息接口
    *fetchGetIndependentPermissionInfo({ payload, callback }, { call, put }) {
	    const response = yield call(getIndependentPermissionInfo, payload);
	    let { success } = response;
	    if(success){
	      	yield put({
	        	type: 'setIndependentPermissionInfo',
	        	payload: response,
	      	});
	    }
	    if(callback) callback(response)
    }
  },

  reducers: {
    setCurrentProduct(state, { payload }) {
    	let { appid='',productName='',productionId='' } = payload;
    	return {
	        ...state,
	        appid,
	        productName,
	        productionId
      };
    },
    //获取菜单
    setPermissionInfo(state, { payload }) {
    	let { data=[] } = payload.data;
    	const newList = [...data];
    	const menusData = newList.filter(item => item.permissionType === 1);
    	const { workforceAuthority={},knowledgeAuthority={},serviceAuthority={} } = setAuthority(data);
      	return {
        	...state,
        	menusData,
        	userPermissionVos:data,
        	workforceAuthority,
        	knowledgeAuthority,
        	serviceAuthority
      	};
    },
    setIndependentPermissionInfo(state, { payload }){
    	const { data=[] } = payload.data;
    	const newList = data.filter((item) => item.permissionType === 1);
    	return{
    		...state,
    		independentMenusData:newList
    	}
    },
    //设置路由
    setRouter(state, { payload }){
    	let { data=[] } = payload;
    	return{
    		...state,
    		routeData:[...data]
    	}
    },
    //客服未读消息数量
    setUnreadMessages(state, {payload}){
   		const { unreadNum } = payload;
   		return{
   			...state,
   			unreadNum
   		}
    },
	//设置未读数
	initMessagesCount(state, {payload}){
		const { keepingMessagesCount=0,onlineServiceCount=0 } = payload.data;
		return{
			...state,
			keepingMessagesCount,
			onlineServiceCount
		}
	},
	//设置留言未读
	setMessagesCount(state, {payload}){
		const { keepingMessagesCount } = payload;
		return{
			...state,
			keepingMessagesCount
		}
	},
	//设置客服未读
	setOnlineCount(state, {payload}){
		const { onlineServiceCount } = payload;
		return{
			...state,
			onlineServiceCount
		}
	}
  },

};
