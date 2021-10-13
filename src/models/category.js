import {
    getCategoryPage,
    addCategory,
    updateCategory
} from '../services/categoryApi'
import { handleCode } from '../utils/utils'
export default {
    namespace: 'category',
    state: {
        name: '类目管理',
        ProductionCatagoryList: { data: [], total: 0, pageNum: 1, pageSize: 10 }
    },

    effects: {
        //产品类目分页查询
        *getCategoryPage({ payload, callback }, { call, put }) {
            const response = handleCode(yield call(getCategoryPage, payload));
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setProductionCatagory',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //产品类目编辑
        *updateCategory({ payload, callback }, { call, put }) {
            const response = handleCode(yield call(updateCategory, payload));
            // const response = yield call(updateCategory, payload);
            let { success } = response;
            if (callback) callback(response)
        },
        //产品类目新建
        *addCategory({ payload, callback }, { call, put }) {
            const response = handleCode(yield call(addCategory, payload));
            // const response = yield call(addCategory, payload);
            let { success } = response;
            if (callback) callback(response)
        },
    },

    reducers: {
        //   存产品列表
        setProductionCatagory(state, { payload }) {
            let { data = [], total = 0, pageNum = 1, pageSize = 10 } = payload.data;
            let ProductionCatagoryList = {
                list: data,
                total,
                pageNum,
                pageSize
            }
            return {
                ...state,
                ProductionCatagoryList
            };
        },
    }
};
