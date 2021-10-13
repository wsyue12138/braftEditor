import {
    getCompanyList,
    createCompany,
    updateCompany
} from '../services/enterpriseManagementApi'
import { resetPwd } from '../services/loginApi'
import { handleCode } from '../utils/utils'
export default {
    namespace: 'enterpriseManagement',
    state: {
        name: '企业管理列表',
        companyList: { data: [], total: 0, pageNum: 1, pageSize: 10 }
    },

    effects: {
        //获取产品列表
        *fetchGetCompanyList({ payload, callback }, { call, put }) {
            const response =handleCode( yield call(getCompanyList, payload));
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setCompanyList',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //产品创建
        *createCompany({ payload, callback }, { call, put }) {
            const response = yield call(createCompany, payload);
            let { success } = response;
            if (callback) callback(response)
        },

        //产品更新
        *updateCompany({ payload, callback }, { call, put }) {
            const response = yield call(updateCompany, payload);
            let { success } = response;
            if (callback) callback(response)
        },

        //重置
        *fetchResetPwd({ payload, callback }, { call, put }) {
            const response = yield call(resetPwd, payload);
            if (callback) callback(response)
        },
    },

    reducers: {
        //   存产品列表
        setCompanyList(state, { payload }) {
            let { data = [], total = 0, pageNum = 1, pageSize = 10 } = payload.data;
            let newData = data.map((item, key) => {
                return {
                    ...item,
                    productNameStr: item.productionList.map((sonItem, index) => {
                        return item.productionList.length == (index + 1) ? sonItem.productName : sonItem.productName + '/'
                    }).join("")
                }
            })
            let companyList = {
                list: newData,
                total,
                pageNum,
                pageSize
            }
            return {
                ...state,
                companyList
            };
        },
    }
};
