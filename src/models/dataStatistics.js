import {
    groupCount,
    consultQuality,
    userCount,
    userTimeCount,
    consultCount,
    groupFormation,
    solvedQuestion,
    topQuestion,
    topGroup,
    notSolvedQuestion,
    recentConsult,
    getGroup,
    qaDetail,
    getCategoryTreeByProduct,
    recentUser,
    recentUserTime
} from '../services/dataStatisticsApi'
import {
    getSingleKnowledgePages
} from '../services/singleApi';

export default {

    namespace: 'dataStatistics',

    state: {
        name: '数据统计',
        groupCount: {
            all: '',
            new: ''
        },
        consultQuality: {
            all: 0,
            unKnow: 0
        },
        consultCount: {
            allConsult: 0,
            nowConsult: 0
        },
        userCount: {
            allUser: 0,
            nowUser: 0
        },
        groupFormation: [],
        topGroup: {
            groups: [],
            allConsult: 0
        },
        solvedQuestion: [],
        topQuestion: {
            questions: []
        },
        notSolvedQuestion: [],
        recentConsult: {},
        qaDetail: {
            data: []
        },
        catagoryTree: [],
        recentUser: {}

    },

    subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
    },

    effects: {
        //接口内容：业务内容统计
        *groupCount({ payload, callback }, { call, put }) {
            const response = yield call(groupCount, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setGroupCount',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：咨询质量统计
        *consultQuality({ payload, callback }, { call, put }) {
            const response = yield call(consultQuality, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setConsultQuality',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：服务人数
        *userCount({ payload, callback }, { call, put }) {
            const response = yield call(userCount, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setUserCount',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：服务人次
        *userTimeCount({ payload, callback }, { call, put }) {
            const response = yield call(userTimeCount, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setUserTimeCount',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：咨询情况
        *consultCount({ payload, callback }, { call, put }) {
            const response = yield call(consultCount, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setConsultCount',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：业务分布组成
        *groupFormation({ payload, callback }, { call, put }) {
            const response = yield call(groupFormation, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setGroupFormation',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：已解决问题TOP5
        *solvedQuestion({ payload, callback }, { call, put }) {
            const response = yield call(solvedQuestion, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setSolvedQuestion',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：服务人数10天
        *recentUser({ payload, callback }, { call, put }) {
            const response = yield call(recentUser, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setRecentUser',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：服务人次10天
        *recentUserTime({ payload, callback }, { call, put }) {
            const response = yield call(recentUserTime, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setRecentUserTime',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：热点问题TOP5
        *topQuestion({ payload, callback }, { call, put }) {
            const response = yield call(topQuestion, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setTopQuestion',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：热点分类TOP5
        *topGroup({ payload, callback }, { call, put }) {
            const response = yield call(topGroup, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setTopGroup',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },
        //接口内容：未解决问题比例
        *notSolvedQuestion({ payload, callback }, { call, put }) {
            const response = yield call(notSolvedQuestion, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setNotSolvedQuestion',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：业务咨询量近10日变动
        *recentConsult({ payload, callback }, { call, put }) {
            const response = yield call(recentConsult, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setRecentConsult',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：获取分类
        *getGroup({ payload, callback }, { call, put }) {
            const response = yield call(getGroup, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setGetGroup',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：问题明细查询
        *qaDetail({ payload, callback }, { call, put }) {
            const response = yield call(qaDetail, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setQaDetail',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：产品类目树查询
        *getCategoryTreeByProduct({ payload, callback }, { call, put }) {
            const response = yield call(getCategoryTreeByProduct, payload);
            let { success } = response;
            if (success) {
                yield put({
                    type: 'setCatagoryTree',
                    payload: response,
                });
            }
            if (callback) callback(response)
        },

        //接口内容：问题明细查询
        *getSingleKnowledgePages({ payload, callback }, { call, put }) {
            const response = yield call(getSingleKnowledgePages, payload);
            if (callback) callback(response)
        },
    },

    reducers: {

        // 页面卸载数据恢复默认
        setUninstall(state, { payload }) {
            return {
                name: '数据统计',
                groupCount: {
                    all: '',
                    new: ''
                },
                consultQuality: {
                    all: 0,
                    unKnow: 0
                },
                consultCount: {
                    allConsult: 0,
                    nowConsult: 0
                },
                userCount: {
                    allUser: 0,
                    nowUser: 0
                },
                groupFormation: [],
                topGroup: {
                    groups: [],
                    allConsult: 0
                },
                solvedQuestion: [],
                topQuestion: {
                    questions: []
                },
                notSolvedQuestion: [],
                recentConsult: {},
                qaDetail: {
                    data: []
                },
                catagoryTree: [],
                recentUser: {}

            }
        },

        //接口内容：服务人数10日
        setRecentUser(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                recentUser: data
            }
        },
        
        //接口内容：服务人数10日
        setRecentUserTime(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                recentUserTime: data
            }
        },
        //接口内容：产品类目树查询
        setCatagoryTree(state, { payload }) {
            let { data: { data = [] } = {} } = payload;
            return {
                ...state,
                catagoryTree: data
            }
        },
        //接口内容：业务内容统计
        setGroupCount(state, { payload }) {
            let { data: { data = [] } = {} } = payload;
            return {
                ...state,
                groupCount: data,
            }
        },

        //接口内容：咨询质量统计
        setConsultQuality(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                consultQuality: data,
            }
        },

        //接口内容：服务人数
        setUserCount(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                userCount: data,
            }
        },
        
        //接口内容：服务人次
        setUserTimeCount(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                userTimeCount: data,
            }
        },

        //接口内容：咨询情况
        setConsultCount(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                consultCount: data,
            }
        },

        //接口内容：业务分布组成
        setGroupFormation(state, { payload }) {
            let { data: { data = [] } = {} } = payload;
            
            return {
                ...state,
                groupFormation: data,
            }
        },

        //接口内容：已解决问题TOP5
        setSolvedQuestion(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                solvedQuestion: data,
            }
        },

        //接口内容：热点问题TOP5
        setTopQuestion(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                topQuestion: data,
            }
        },

        //接口内容：热点分类TOP5
        setTopGroup(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                topGroup: data,
            }
        },

        //接口内容：未解决问题比例
        setNotSolvedQuestion(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                notSolvedQuestion: data,
            }
        },

        //接口内容：业务咨询量近10日变动
        setRecentConsult(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                recentConsult: data,
            }
        },

        //接口内容：获取分类
        setGetGroup(state, { payload }) {
            let { data: { data = [] } = {} } = payload;

            return {
                ...state,
                getGroup: data,
            }
        },

        //接口内容：问题明细查询
        setQaDetail(state, { payload }) {
            let { data = [], total = 0, pageNum = 1, pageSize = 10 } = payload.data;
            let qaDetail = {
                list:data,
                total,
                pageNum,
                pageSize
            }
            return {
                ...state,
                qaDetail
            }
        },

    },

};
