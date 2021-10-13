import request from '../utils/request';
import { stringify } from 'qs';

//获取账号列表
export async function accountList(params) {
  	return request('/appAccount/select', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//修改添加
export async function accountCreate(params) {
  	return request('/appAccount/create', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//修改账号
export async function accountUpdate(params) {
  	return request('/appAccount/update', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}