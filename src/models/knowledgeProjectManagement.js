import {
    getKnowledgeProjectPage,
    createKnowledgeProject,
    updateKnowledgeProject,
    disableRole,
    enableRole,
    getCategoryGroup
} from '../services/KnowledgeProjectManagementApi'
import { handleCode } from '../utils/utils'
export default {
    namespace: 'KnowledgeProjectManagement',
    state: {
        name: '知识库项目管理',
        knowledgeList: { list: [], total: 0, pageNum: 1, pageSize: 10 }
    },

    effects: {
        //获取知识项目列表
        *getKnowledgeProjectPage({ payload, callback }, { call, put }) {
            const response = yield call(getKnowledgeProjectPage, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setKnowledgeList',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //获取类目组
        *getCategoryGroup({ payload, callback }, { call, put }) {
            const response = yield call(getCategoryGroup, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setCategoryGroup',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //创建知识项目接口
        *createKnowledgeProject({ payload, callback }, { call, put }) {
            const response =handleCode( yield call(createKnowledgeProject, payload));
            let { success } = response;
            if (callback) callback(response)
        },

        //更新知识项目接口
        *updateKnowledgeProject({ payload, callback }, { call, put }) {
            const response =handleCode( yield call(updateKnowledgeProject, payload));
            let { success } = response;
            if (callback) callback(response)
        },
        //角色禁用
        *disableRole({ payload, callback }, { call, put }) {
            const response = yield call(disableRole, payload);
            let { success } = response;
            if (callback) callback(response)
        },

        // 角色启用
        *enableRole({ payload, callback }, { call, put }) {
            const response = yield call(enableRole, payload);
            let { success } = response;
            if (callback) callback(response)
        },

    },

    reducers: {
        //   存产品列表
        setKnowledgeList(state, { payload }) {
            let { data = [], total = 0, pageNum = 1, pageSize = 10 } = payload.data;

            let newData = data.map((item, key) => {
                return {
                    ...item,
                    productNameArr: item.productNames.map((sonItem, index) => {
                        return item.productNames.length == (index + 1) ? sonItem : sonItem + '、'
                    }).join("")
                }
            })
            let knowledgeList = {
                list: newData,
                total,
                pageNum,
                pageSize
            }
            return {
                ...state,
                knowledgeList
            };
        },
        setCategoryGroup(state, { payload }) {
            let { data = [], total = 0, pageNum = 1, pageSize = 10 } = payload.data;
            let categoryGroup = {
                list: data,
                total,
                pageNum,
                pageSize
            }
            return {
                ...state,
                categoryGroup
            };
        },
    }
};
