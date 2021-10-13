import request from '../utils/request';
import { stringify } from 'qs';

//获取产品列表
export async function getKnowledgeHistoryPage(params) {
  	return request('/knowledgeHistory/getKnowledgeHistoryPage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}
