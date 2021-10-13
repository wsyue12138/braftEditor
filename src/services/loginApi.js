import request from '../utils/request';
import { stringify } from 'qs';

// 登录
export async function userLogin(params) {
  	return request('/user/login', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
// 修改密码
export async function changePwd(params) {
  	return request('/user/changePwd', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 重置密码
export async function disablePwd(params) {
  	return request('/user/staffManagement/disable', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 禁用
export async function resetPwd(params) {
  	return request('/user/resetPwd', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//启用
export async function unDisablePwd(params) {
  	return request('/user/staffManagement/unDisable', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//退出登录
export async function logout(params) {
	return request(`/user/logout?${stringify(params)}`);
}
