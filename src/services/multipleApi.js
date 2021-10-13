import request from '../utils/request';
import { stringify } from 'qs';

//获取多轮列表
export async function getQaKnowledgePage(params) {
  	return request('/knowledge/qaKnowledge/getQaKnowledgePage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取补充说明
export async function getCustomFieldNameByProduction(params) {
  	return request('/knowledgeProject/getCustomFieldNameByProduction', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取多轮详情
export async function getQaKnowledgeTree(params) {
  	return request('/knowledge/qaKnowledge/getQaKnowledgeTree', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮知识获取知识节点原有信息
export async function getOriginQaKnowledge(params) {
  	return request('/knowledge/qaKnowledge/getOriginQaKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//审核修改记录
export async function getOriginKnowledge(params) {
  	return request('/knowledge/single/getOriginKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取多轮修改
export async function updateQaKnowledge(params) {
  	return request('/knowledge/qaKnowledge/updateQaKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取多轮审核
export async function auditQaKnowledge(params) {
  	return request('/knowledge/qaKnowledge/auditQaKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮知识节点处理、处理完成
export async function tesHandleQaKnowledge(params) {
  	return request('/knowledge/qaKnowledge/tesHandleQaKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮知识启用接口
export async function enableQaKnowledge(params) {
  	return request('/knowledge/qaKnowledge/enableQaKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮关联答案信息
export async function getQaRelateAnswerInfo(params) {
  	return request('/knowledge/qaKnowledge/getQaRelateAnswerInfo', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//多轮知识删除
export async function delQaKnowLedges(params) {
	return request('/knowledge/qaKnowledge/delQaKnowLedges', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}