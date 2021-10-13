import request from '../utils/request';
import { stringify } from 'qs';

//获取类目树
export async function getCatagoryTree(params) {
  	return request('/categoryManagement/getCategoryTreeByProduct', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//单轮历史记录
export async function getSingleHistoryList(params) {
  	return request('/knowledge/single/getKnowledgeHistoryList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮历史记录
export async function getMultipleHistoryList(params) {
  	return request('/knowledge/qaKnowledge/getQaKnowledgeHistory', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}


//知识项目列表
export async function getKnowledgeProjectListByProduction(params) {
  	return request('/knowledgeProject/getKnowledgeProjectListByProduction', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//权限类目
export async function getCategoryTreeByProductAndPermission(params) {
	return request('/categoryManagement/getCategoryTreeByProductAndPermission', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}