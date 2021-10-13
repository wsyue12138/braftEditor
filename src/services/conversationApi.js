import request from '../utils/request';
import { stringify } from 'qs';

//获取列表
export async function getChatHistory(params) {
  	return request('/chatHistory/getChatHistory', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//详情
export async function getChatDetails(params) {
  	return request('/chatHistory/getChatDetails', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}