import request from '../utils/request';
import { stringify } from 'qs';

//获取业务分类
export async function getGroup(params) {
	return request(`/data/getGroup?${stringify(params)}`);
}

//获取当前用户的权限信息接口
export async function getUnresolvedQestion(params) {
  	return request('/UnresolvedQestion/select', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//忽略
export async function setIgnore(params) {
  	return request('/UnresolvedQestion/ignore', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//未知问题新增
export async function createKnowledge(params) {
  	return request('/UnresolvedQestion/createKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//未知问题关联相似
export async function relateKnowledge(params) {
  	return request('/UnresolvedQestion/relateKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}