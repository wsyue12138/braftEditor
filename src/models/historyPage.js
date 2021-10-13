import {
	getKnowledgeHistoryPage
} from '../services/historyApi'
import { handleCode } from '../utils/utils'
export default {
  namespace: 'historyPage',
  state: {
    historyPage:[]
  },

  effects: {
    //获取产品列表
    *getKnowledgeHistoryPage({ payload, callback }, { call, put }) {
      const response =handleCode( yield call(getKnowledgeHistoryPage, payload));
      let { success } = response;
      if(success){
      	yield put({
        	type: 'setKnowledgeHistoryPage',
        	payload: response,
      	});
      }
      if(callback) callback(response)
    },
  },

  reducers: {
    setKnowledgeHistoryPage(state, { payload }) {
    	let { data=[],total=0 ,pageNum=1,pageSize=10 } = payload.data;
    	let historyPage = {
    		list:data,
    		total,
            pageNum,
            pageSize
    	}
      	return {
        	...state,
        	historyPage
      	};
    },
  },
};
