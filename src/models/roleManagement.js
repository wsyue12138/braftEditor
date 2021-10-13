import {
    createRole,
    updateRole,
    disableRole,
    getRoleList,
    getAllPermission,
    getRolePermissionList,
    enableRole,
    getRoleType
} from '../services/roleManagementApi'
import { handleCode } from '../utils/utils'
export default {
  namespace: 'roleManagement',
  state: {
	name:'企业管理列表',
    roleList:{ 
        data:[],
        total:0,
        pageNum:1,
        pageSize:10
    },
    allPermission : [],
    rolePermissionList : [],
    roleType:[]
  },
    // code码权限数组，rolePermissionList
    // 权限名称数组，permissionNameList
    // 全部权限，allPermission

  effects: {
    //获取角色列表
    *getRoleList({ payload, callback }, { call, put }) {
      const response =handleCode( yield call(getRoleList, payload));
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setRoleList',
        	payload: response,
      	});
      }
      if(callback) callback(response)
	},
	
    //角色创建
    *createRole({ payload, callback }, { call, put }) {
		const response = yield call(createRole, payload);
		let { success } = response;
//		if(success){
//          console.log('角色创建',response)
//		}
		if(callback) callback(response)
    },
    
    //角色修改
    *updateRole({ payload, callback }, { call, put }) {
        const response = yield call(updateRole, payload);
        let { success } = response;
//      if(success){
//          console.log('角色修改',response)
//      }
        if(callback) callback(response)
    },

    //角色禁用
    *disableRole({ payload, callback }, { call, put }) {
        const response = yield call(disableRole, payload);
        let { success } = response;
//      if(success){
//          console.log('角色禁用',response)
//      }
        if(callback) callback(response)
    },

    // 角色启用
    *enableRole({ payload, callback }, { call, put }) {
      const response = yield call(enableRole, payload);
      let { success } = response;
//    if(success){
//        console.log('角色启用',response)
//    }
      if(callback) callback(response)
  },
    
    //全部权限列表查询
    *getAllPermission({ payload, callback }, { call, put }) {
        const response = yield call(getAllPermission);
        let { success } = response;
        if(success){
            yield put({
              type: 'setAllPermission',
              payload: response,
            });
            
        }
        if(callback) callback(response)
      },
      
    //角色已选权限列表查询
    *getRolePermissionList({ payload, callback }, { call, put }) {
        const response = yield call(getRolePermissionList, payload);
        let { success } = response;
        if(success){
            yield put({
              type: 'setRolePermissionList',
              payload: response,
            });
        }
        if(callback) callback(response)
      },
      //获取角色类型接口
    *fetchGetRoleType({ payload, callback }, { call, put }) {
      const response = yield call(getRoleType, payload);
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setRoleType',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    }
  },

  reducers: {
	//   存产品列表
    setRoleList(state, { payload }) {
        let { data=[],total=0,pageNum=1,pageSize=10 } = payload.data;
    	let roleList = {
    		list:data,
            total,
            pageNum,
            pageSize
    	}
      	return {
        	...state,
        	roleList
      	};
    },
    
	//   存全部权限列表
    setAllPermission(state, { payload }) {
    	let { data=[] } = payload.data;
        let allPermission = data
      	return {
        	...state,
        	allPermission
      	};
    },
    
	//   存角色已选权限列表
    setRolePermissionList(state, { payload }) {
    	let { data=[] } = payload.data;
        let rolePermissionList = data.permissionCodes;
      	return {
        	...state,
            rolePermissionList
      	};
    },
    
    resetPermissionList(state, { payload }){
        return {
          ...state,
          permissionNameList:[],
          rolePermissionList:[]
        };
    },
    setRoleType(state, { payload }){
    	const { data=[] } = payload.data;
    	return{
    		...state,
    		roleType:data
    	}
    }
  }
};

