import { stringify } from 'qs';
import request from '../utils/request';

//列表
export async function getQuickReplyPages(params) {
	return request('/quickReply/getQuickReplyPages', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//新增
export async function addQuickReply(params) {
	return request('/quickReply/addQuickReply', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//编辑
export async function updateQuickReply(params) {
	return request('/quickReply/updateQuickReply', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//删除
export async function deleteQuickReply(params) {
	return request('/quickReply/deleteQuickReply', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}