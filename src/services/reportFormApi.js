import request from '../utils/request';
import { stringify } from 'qs';

//留言记录统计接口
export async function getCommentStatistic(params) {
	return request(`/csWorkStatistic/getCommentStatistic?${stringify(params)}`);
}

//转人工用户量统计
export async function getTransferStatistic(params) {
	return request(`/csWorkStatistic/getTransferStatistic?${stringify(params)}`);
}

//会话时长统计
export async function getChatTimeStatistic(params) {
	return request(`/csWorkStatistic/getChatTimeStatistic?${stringify(params)}`);
}

//评价数量统计
export async function getSatisfactionStatistic(params) {
	return request(`/csWorkStatistic/getSatisfactionStatistic?${stringify(params)}`);
}

//折线图统计
export async function getLineChatStatistic(params) {
  	return request('/csWorkStatistic/getLineChatStatistic', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}