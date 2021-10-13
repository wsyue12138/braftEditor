import request from '../utils/request';
import { stringify } from 'qs';

//获取单轮列表
export async function getSingleKnowledgePages(params) {
  	return request('/knowledge/single/getSingleKnowledgePages', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取单轮删除
export async function singleDelete(params) {
  	return request('/knowledge/single/delete', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//单轮生效
export async function singleEnable(params) {
  	return request('/knowledge/single/enableKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//处理、新增完成
export async function tesHandleKnowledge(params) {
  	return request('/knowledge/single/tesHandleKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//审核
export async function singleExamine(params) {
  	return request('/knowledge/single/auditKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//单轮新增
export async function singleAdd(params) {
  	return request('/knowledge/single/add', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//单轮编辑
export async function singleUpdate(params) {
  	return request('/knowledge/single/update', {
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

//审核修改记录
export async function getOriginKnowledge(params) {
  	return request('/knowledge/single/getOriginKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取知识分页列表接口
export async function getSimilarKnowledgePage(params) {
  	return request('/knowledge/single/getSimilarKnowledgePage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//关联相似
export async function associateSimilarKnowledge(params) {
  	return request('/knowledge/single/associateSimilarKnowledge', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//关联答案
export async function getRelateAnswerInfo(params) {
  	return request('/knowledge/single/getRelateAnswerInfo', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//单轮知识批量更新接口
export async function batchUpdate(params) {
	return request('/knowledge/single/batchUpdate', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//单轮知识批量审核接口
export async function batchAuditKnowledge(params) {
	return request('/knowledge/single/batchAuditKnowledge', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//单轮知识批量删除知识接口
export async function batchDelete(params) {
	return request('/knowledge/single/batchDelete', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//单轮知识库操作权限查询接口
export async function userKnowledgePermission(params) {
	return request('/knowledge/single/userKnowledgePermission', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

