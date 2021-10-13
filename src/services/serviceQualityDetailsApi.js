import request from '../utils/request';
import { stringify } from 'qs';

// 登录
export async function qaQuality(params) {
  	return request('/data/qaQuality', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

