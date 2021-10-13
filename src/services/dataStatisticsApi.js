import request from '../utils/request';
import { stringify } from 'qs';

//接口内容：业务内容统计
export async function groupCount(params) {
  	return request('/data/groupCount', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：咨询质量统计
export async function consultQuality(params) {
  	return request('/data/consultQuality', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人数
export async function userCount(params) {
  	return request('/data/userCount', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人次
export async function userTimeCount(params) {
  	return request('/data/userTimeCount', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：咨询情况
export async function consultCount(params) {
  	return request('/data/consultCount', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：业务分布组成
export async function groupFormation(params) {
  	return request('/data/groupFormation', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：已解决问题TOP5
export async function solvedQuestion(params) {
  	return request('/data/solvedQuestion', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：热点问题TOP5
export async function topQuestion(params) {
  	return request('/data/topQuestion', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人数近10日变动
export async function recentUser(params) {
  	return request('/data/recentUser', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人次近10日变动
export async function recentUserTime(params) {
  	return request('/data/recentUserTime', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：热点分类TOP5
export async function topGroup(params) {
  	return request('/data/topGroup', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：未解决问题比例
export async function notSolvedQuestion(params) {
  	return request('/data/notSolvedQuestion', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：业务咨询量近10日变动
export async function recentConsult(params) {
  	return request('/data/recentConsult', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：获取分类
export async function getGroup(params) {
	return request(`/data/getGroup?${stringify(params)}`);
}
//接口内容：上传服务功能
export async function workforceUploadServ(params) {
	return request(`/workforce/uploadServ?${stringify(params)}`);
}


//接口内容：问题明细查询
export async function qaDetail(params) {
  	return request('/data/qaDetail', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
//接口内容：服务质量明细查询
export async function qaQuality(params) {
  	return request('/data/qaQuality', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
//接口内容：服务功能明细
export async function serviceConsult(params) {
  	return request('/data/serviceConsult', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
//接口内容：上传服务功能
export async function uploadServ(params) {
  	return request('/data/uploadServ', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
//接口内容：产品类目树查询
export async function getCategoryTreeByProduct(params) {
  	return request('/categoryManagement/getCategoryTreeByProduct', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

