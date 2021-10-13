import request from '../utils/request';
import { stringify } from 'qs';

//获取产品列表
export async function getUserInfo(params) {
  	return request('/user/getUserInfo', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取公钥
export async function getPublicKey(params) {
	return request(`/user/getPublicKey?${stringify(params)}`);
}