import request from '../utils/request';
import { stringify } from 'qs';

//获取类目列表
export async function getCategoryPage(params) {
  	return request('/categoryManagement/getCategoryPage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//类目创建 
export async function addCategory(params) {
	return request('/categoryManagement/addCategory', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}
//类目编辑
export async function updateCategory(params) {
	return request('/categoryManagement/updateCategory', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}

