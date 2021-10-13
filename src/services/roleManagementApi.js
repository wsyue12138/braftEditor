import request from '../utils/request';
import { stringify } from 'qs';

//角色创建
export async function createRole(params) {
  	return request('/userRole/createRole', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//角色修改
export async function updateRole(params) {
    return request('/userRole/updateRole', {
      method: 'POST',
      body: {
            params,
      },
    });
}

//角色禁用
export async function disableRole(params) {
    return request('/userRole/disableRole', {
      method: 'POST',
      body: {
            params,
      },
    });
}

//角色启用
export async function enableRole(params) {
  return request('/userRole/enableRole', {
    method: 'POST',
    body: {
          params,
    },
  });
}

//获取角色列表
export async function getRoleList(params) {
    return request('/userRole/getRoleList', {
      method: 'POST',
      body: {
            params,
      },
    });
}

//获取用户信息
export async function getAllPermission(params={}) {
	return request(`/userRole/getAllPermission`);
}

//角色已选权限列表查询
export async function getRolePermissionList(params) {
    return request('/userRole/getRolePermissionList', {
      method: 'POST',
      body: {
            params,
      },
    });
}

//获取角色类型接口
export async function getRoleType(params={}) {
	return request(`/userRole/getRoleType`);
}