import request from '../utils/request';
import { stringify } from 'qs';

//获取列表
export async function getWorkReportPage(params) {
  	return request('/csWorkReport/getWorkReportPage', {
    	method: 'POST',
    	body: {
      		params,
    	},
  	});
}

