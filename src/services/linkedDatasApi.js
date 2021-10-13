import request from '../utils/request';
import { stringify } from 'qs';

//获取产品列表
export async function getPermissionProductions(params) {
  	return request('/common/getPermissionProductions', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：业务内容统计
export async function groupCount(params) {
  	return request('/data/groupCount/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：咨询质量统计
export async function consultQuality(params) {
  	return request('/data/consultQuality/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人数
export async function userCount(params) {
  	return request('/data/userCount/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人次
export async function userTimeCount(params) {
  	return request('/data/userTimeCount/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：咨询情况
export async function consultCount(params) {
  	return request('/data/consultCount/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：业务分布组成
export async function groupFormation(params) {
  	return request('/data/groupFormation/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：已解决问题TOP5
export async function solvedQuestion(params) {
  	return request('/data/solvedQuestion/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：热点问题TOP5
export async function topQuestion(params) {
  	return request('/data/topQuestion/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人数近10日变动
export async function recentUser(params) {
  	return request('/data/recentUser/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：服务人次近10日变动
export async function recentUserTime(params) {
  	return request('/data/recentUserTime/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：热点分类TOP5
export async function topGroup(params) {
  	return request('/data/topGroup/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：未解决问题比例
export async function notSolvedQuestion(params) {
  	return request('/data/notSolvedQuestion/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

//接口内容：业务咨询量近10日变动
export async function recentConsult(params) {
  	return request('/data/recentConsult/full', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}