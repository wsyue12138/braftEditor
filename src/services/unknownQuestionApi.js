import request from '../utils/request';
import { stringify } from 'qs';

//获取业务分类
export async function getGroup(params) {
	return request(`/data/getGroup?${stringify(params)}`);
}

//获取列表
export async function getUnknownQestion(params) {
  	return request('/UnknownQestion/select', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//忽略
export async function setIgnore(params) {
  	return request('/UnknownQestion/ignore', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//未知问题新增
export async function createKnowledge(params) {
  	return request('/UnknownQestion/createKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//未知问题关联相似
export async function relateKnowledge(params) {
  	return request('/UnknownQestion/relateKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}