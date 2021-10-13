import request from '../utils/request';
import { stringify } from 'qs';

// 登录
export async function getNoticePages(params) {
  	return request('/common/getNoticePages', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取当前用户的未读通知数量
export async function getUnreadedNoticeCount(params) {
	return request(`/common/getUnreadedNoticeCount?${stringify(params)}`);
}

//设置当前用户未读通知为已读
export async function readNotice(params) {
  	return request('/common/readNotice', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}