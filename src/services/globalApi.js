import request from '../utils/request';
import { stringify } from 'qs';

//获取当前用户的权限信息接口
export async function getPermissionInfo(params) {
  	return request('/user/getPermissionInfo', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取当前用户的直属权限信息
export async function getIndependentPermissionInfo(params) {
	return request(`/user/getIndependentPermissionInfo?${stringify(params)}`);
}
