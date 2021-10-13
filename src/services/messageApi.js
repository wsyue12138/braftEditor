import request from '../utils/request';
import { stringify } from 'qs';

// 列表
export async function getCommentGroupPage(params) {
  	return request('/comment/getCommentGroupPage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 忽略、终止
export async function ignoreOrTerminateComment(params) {
  	return request('/comment/ignoreOrTerminateComment', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 详情
export async function getCommentDetails(params) {
  	return request('/comment/getCommentDetails', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

// 回复
export async function replyComment(params) {
  	return request('/comment/replyComment', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}