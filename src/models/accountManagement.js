import {
	getStaffList,
	getCompanyPrefix,
	getProductionRoles,
	addUser,
	updateUser,
	getRolesByComOrProduct,
	getRoleProductPermissionList,
	getBGPermission,
	getUserBGPermissionList,
	getCategoryByProductAndRoles
} from '../services/accountManagementApi'

export default {
	
	namespace: 'accountManagement',

	state: {
	  	staffData:{
	  		list:[],
	  		total:0
	  	},
	  	selectStaff:[],
	  	visible:false,
	  	drawerType:'add',
	  	onceData:{},
	  	productionRolesArr:[],
	  	rolesList:[],
	  	rolePermissions:{
	  		list:[],
	  		total:0
	  	},
	  	onceJurisdictData:{},
	  	bgPermissionList:[]
	},
	
	subscriptions: {
	    setup({ dispatch, history }) {  // eslint-disable-line
	    },
	},

  	effects: {
	    //获取列表
	    *fetchGetStaffList({ payload, callback }, { call, put }) {
	      	const response = yield call(getStaffList, payload);
	      	let { success } = response;
	      	if(success){
		      	yield put({
		        	type: 'setStaffList',
		        	payload: response,
		      	});
	      	}
	      	if(callback) callback(response)
	    },
	    //获取前缀
	    *fetchGetCompanyPrefix({ payload, callback }, { call, put }) {
	      	const response = yield call(getCompanyPrefix, payload);
		    let { success } = response;
		    if(success){
		      	yield put({
		        	type: 'setCompanys',
		        	payload: response,
		      	});
		    }
		    if(callback) callback(response)
	    },
	    //获取产品角色
	    *fetchGetProductionRoles({ payload, callback }, { call, put }) {
	      	const response = yield call(getProductionRoles, payload);
	     	let { success } = response;
	      	if(success){
	      		yield put({
	        		type: 'setProductionRoles',
	        		payload: response,
	      		});
	      	}
	    },
	    //获取角色分类
	    *fetchGetRolesByComOrProduct({ payload, callback }, { call, put }) {
	      	const response = yield call(getRolesByComOrProduct, payload);
	      	let { success } = response;
	      	if(success){
	      		yield put({
	        		type: 'getRolesByComOrProductList',
	        		payload: response,
	      		});
	      	}
	    },
	    //新增用户
	    *fetchAddUser({ payload, callback }, { call, put }) {
	      	const response = yield call(addUser, payload);
	      	if(callback) callback(response)
	    },
	    //修改用户
	    *fetchUpdateUser({ payload, callback }, { call, put }) {
	      	const response = yield call(updateUser, payload);
	      	if(callback) callback(response)
	    },
	    //获取角色-产品-权限关系分页列表
	    *fetchGetRoleProductPermissionList({ payload, callback }, { call, put }) {
	      	const response = yield call(getRoleProductPermissionList, payload);
	      	let { success } = response;
	      	if(success){
	      		yield put({
	        		type: 'setRoleProductPermissionList',
	        		payload: response,
	      		});
	      	}
	      	if(callback) callback(response)
	    },
	    //获取后台管理权限列表
	    *fetchGetBGPermission({ payload, callback }, { call, put }) {
	      	const response = yield call(getBGPermission, payload);
	      	let { success } = response;
	      	if(success){
	      		yield put({
	        		type: 'setBGPermission',
	        		payload: response,
	      		});
	      	}
	      	if(callback) callback(response)
	    },
	    //账号已选后台权限权限列表查询接口
	    *fetchGetUserBGPermissionList({ payload, callback }, { call, put }) {
	      	const response = yield call(getUserBGPermissionList, payload);
	      	if(callback) callback(response)
	    },
		//根据产品角色组获取类目及权限
	    *fetchGetCategoryByProductAndRoles({ payload, callback }, { call, put }) {
			const response = yield call(getCategoryByProductAndRoles, payload);
			if(callback) callback(response)
	  },
  	},
	
  	reducers: {
	    setStaffList(state, { payload }) {
	    	const { data=[],total=0 } = payload.data;
		  	let staffData = {
		  		list:data,
		  		total
		  	}
	  		return {
	    		...state,
	    		staffData
	  		};
	    },
	    getRolesByComOrProductList(state, { payload }) {
	    	const { data=[] } = payload.data;
	  		return {
	    		...state,
	    		rolesList:data
	  		};
	    },
	    //选择项
	    selectStaffList(state, { payload }) {
	    	let { selectStaff } = payload;
	    	return {
	    		...state,
	    		selectStaff
	  		};
	    },
	    //清除选择项
	    clearSelectStaffList(state, { payload }){
	    	return{
	    		...state,
	    		selectStaff:[]
	    	}
	    },
	    //抽屉开关
	    drawerChange(state, { payload }) {
	    	let { visible,drawerType,onceData={} } = payload;
	    	return {
	    		...state,
	    		visible,
	    		drawerType,
	    		onceData
	  		};
	    },
	    setProductionRoles(state, { payload }) {
	    	const { data=[] } = payload.data;
	    	return{
	    		...state,
	    		productionRolesArr:data
	    	}
	    },
	    setRoleProductPermissionList(state, { payload }) {
	    	const { data=[],total } = payload.data;
	    	let rolePermissions = {
	    		list:data,
	    		total
	    	}
	    	return{
	    		...state,
	    		rolePermissions
	    	}
	    },
	    setOnceJurisdictData(state, { payload }) {
	    	const { onceData={} } = payload;
	    	return{
	    		...state,
	    		onceJurisdictData:onceData
	    	}
	    },
	    //权限描述处理
	    setPermissionDescription(state, { payload }){
	    	const { userPermissionVos } = payload;
	    	let permissionList = [];
			const setFun = (data,key=null) => {
				let childrenNum = 0;
				let permissionStr = '';
				data.map((item,index) => {
					const { permissionType } = item;
					if(permissionType === 2){
						const { description='' } = item;
						if(index !== 0){
							permissionStr += '、' + description;
						}else{
							permissionStr += description;
						}
						
					}else
					if(permissionType === 1){
						const { children=[],permissionName='' } = item
						let name = permissionName;
						if(key !== null){
							name = key + '/' + permissionName;
							childrenNum++;
						}
						setFun(children,name);
					}
					
				})
				
				let obj = {
					permissionName:key,
					permission:permissionStr
				}
				
				if(key !== null && permissionStr != ''){
					if(childrenNum){
						//调整主类顺序
						let newList = [...permissionList];
						let _len = newList.legnth;
						let _idnex = _len - childrenNum;
						permissionList.splice(_idnex,0,obj);
					}else{
						permissionList.push(obj);
					}
				}
			}
			setFun(userPermissionVos);
	    	return{
	    		...state,
	    		permissionList
	    	}
	    },
	    setBGPermission(state, { payload }){
	    	const { data=[] } = payload.data;
	    	return{
	    		...state,
	    		bgPermissionList:data
	    	}
	    }
  	}

};
