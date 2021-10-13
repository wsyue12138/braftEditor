import request from '../utils/request';
import { stringify } from 'qs';

// 获取推荐回复列表
export async function getRecommendReply(params) {
  	return request('/onlineService/getRecommendReply', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 获取快捷回复列表
export async function getQuickReply(params) {
  	return request('/onlineService/getQuickReply', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
