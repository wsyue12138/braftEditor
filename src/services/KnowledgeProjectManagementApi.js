import request from '../utils/request';
import { stringify } from 'qs';

//获取知识项目列表
export async function getKnowledgeProjectPage(params) {
  	return request('/knowledgeProject/getKnowledgeProjectPage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//获取类目组

export async function getCategoryGroup(params) {
	return request(`/categoryManagement/getCategoryGroup?${stringify(params)}`);
}

//创建知识项目接口 
export async function createKnowledgeProject(params) {
	return request('/knowledgeProject/createKnowledgeProject', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//更新知识项目接口
export async function updateKnowledgeProject(params) {
	return request('/knowledgeProject/updateKnowledgeProject', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//角色禁用
export async function disableRole(params) {
    return request('/knowledgeProject/disableKnowledgeProject', {
      method: 'POST',
      body: {
            params,
      },
    });
}

//角色启用
export async function enableRole(params) {
  return request('/knowledgeProject/enableKnowledgeProject', {
    method: 'POST',
    body: {
          params,
    },
  });
}
