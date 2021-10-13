import request from '../utils/request';
import { stringify } from 'qs';

//获取产品列表
export async function getProductionList(params) {
  	return request('/production/getProductionList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//产品创建 
export async function createProduction(params) {
	return request('/production/createProduction', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//产品更新
export async function updateProduction(params) {
	return request('/production/updateProduction', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}


//角色查询
export async function getRoleList(params) {
	return request('/userRole/getRoleList', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}


//企业列表查询
export async function getCompanys(params) {
	return request('/company/getCompanys', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}


//产品下的知识项目列表查询
export async function getKnowledgeProjectListByProduction(params) {
	return request('/knowledgeProject/getKnowledgeProjectListByProduction', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//获取产品统计维度树
export async function getDimensionTree(params) {
	return request(`/data/getDimensionTree?${stringify(params)}`);
}

//获取企业对应的一级类目
export async function getOneLevelCategoryByCompany(params) {
	return request('/categoryManagement/getOneLevelCategoryByCompany', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}