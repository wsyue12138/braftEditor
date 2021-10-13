import request from '../utils/request';
import { stringify } from 'qs';

//获取企业列表
export async function getCompanyList(params) {
  	return request('/company/getCompanyList', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//企业创建 
export async function createCompany(params) {
	return request('/company/createCompany', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

//企业更新
export async function updateCompany(params) {
	return request('/company/updateCompany', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

