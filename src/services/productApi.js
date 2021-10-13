import request from '../utils/request';
import { stringify } from 'qs';

//获取产品列表
export async function getPermissionProductions(params) {
  	return request('/common/getPermissionProductions', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
