import {
    getRegionByParentCode,
    getRegionTree
} from '../services/regionApi';
export default {
    namespace: 'region',
    state: {
        regionData:[],
        searchRegionData:[]
    },

    effects: {
        //添加获取地区
        *fetchGetRegionByParentCode({ payload, callback }, { call, put }) {
            const response = yield call(getRegionByParentCode, payload);
            let { success } = response;
            if(callback) callback(response)
        },
        //搜索获取地区
        *fetchGetRegionTree({ payload, callback }, { call, put }) {
            const response = yield call(getRegionTree, payload);
            let { success } = response;
            if(success){
                yield put({
	        		type: 'setSearchRegion',
	        		payload: response,
	      		});
            }
            if(callback) callback(response)
        }
    },

    reducers: {
        //添加编辑
        setRegionByParentCode(state, { payload }) {
            const { regionData } = payload;
            return {
                ...state,
                regionData
            };
        },
        //搜索
        setSearchRegion(state, { payload }){
            const { data } = payload.data;
            return {
                ...state,
                searchRegionData:data
            };
        }
    }
};
