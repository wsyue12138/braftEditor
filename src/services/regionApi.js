import request from '../utils/request';

// 添加获取地区
export async function getRegionByParentCode(params) {
  	return request('/region/getRegionByParentCode', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//搜索获取地区
export async function getRegionTree(params) {
	return request('/region/getRegionTree', {
	  method: 'POST',
	  body: {
			params,
	  },
	});
}
