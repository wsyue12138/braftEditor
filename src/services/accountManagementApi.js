import request from '../utils/request';
import { stringify } from 'qs';

//获取用户信息
export async function getUserInfo(params={}) {
	let newTime = new Date().getTime();
	params.time = newTime;
	return request(`/user/getUserInfo?${stringify(params)}`);
}

//获取列表
export async function getStaffList(params) {
  	return request('/user/staffManagement/staffList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取公司前缀
export async function getCompanyPrefix(params) {
  	return request('/user/getCompanyPrefix', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取产品与角色
export async function getProductionRoles(params) {
  	return request('/production/getProductionRoles', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取角色分类
export async function getRolesByComOrProduct(params) {
  	return request('/userRole/getRolesByComOrProduct', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//添加人员
export async function addUser(params) {
  	return request('/user/staffManagement/add', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//修改人员
export async function updateUser(params) {
  	return request('/user/staffManagement/update', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取角色-产品-权限关系分页列表
export async function getRoleProductPermissionList(params) {
  	return request('/userRole/getRoleProductPermissionList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取后台管理权限列表
export async function getBGPermission(params) {
	return request(`/userRole/getBGPermission?${stringify(params)}`);
}

//账号已选后台权限权限列表查询接口
export async function getUserBGPermissionList(params) {
  	return request('/userRole/getUserBGPermissionList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//根据产品角色组获取类目及权限
export async function getCategoryByProductAndRoles(params) {
	return request('/user/getCategoryByProductAndRoles', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}