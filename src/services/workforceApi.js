import request from '../utils/request';
import { stringify } from 'qs';

//获取工单统计信息
export async function statistics(params) {
  return request(`/workforce/statistics?${stringify(params)}`);
}

//获取工单分页列表信息
export async function workforceList(params) {
  	return request('/workforce/workforceList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//创建工单
export async function createWorkforce(params) {
  	return request('/workforce/createWorkforce', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//处理工单
export async function handleWorkforce(params) {
  	return request('/workforce/handleWorkforce', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//处理删除
export async function deleteWorkforce(params) {
  	return request('/workforce/deleteWorkforce', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}