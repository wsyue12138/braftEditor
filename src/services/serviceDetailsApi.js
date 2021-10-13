import request from '../utils/request';
import { stringify } from 'qs';

// 列表
export async function serviceConsult(params) {
  	return request('/data/serviceConsult', {
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
