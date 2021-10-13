export default {
    namespace: 'socketetModel',
    state: {
    	_ws:null,
    	repeatLogin:false,
    	takeOff:true,
        userInfo:{},
	  	currentInfo:{},
	   	onlineList:[],
	   	chatList:[],
	   	quickList:[],
	   	selfStatus:1,
	   	lineUpNum:0
    },

    effects: {
        
    },

    reducers: {
    	//设置socket对象
    	setWs(state, {payload}){
    		const { _ws } = payload;
	  		return{
	  			...state,
	  			_ws,
	  			takeOff:false
	  		}
    	},
    	//设置socket状态
    	setSocketState(state, {payload}){
    		const { takeOff } = payload;
	  		return{
	  			...state,
	  			takeOff
	  		}
    	},
        //设置自己个人信息
	  	setUserInfo(state, {payload}){
	  		const { userInfo } = payload;
	  		return{
	  			...state,
	  			userInfo
	  		}
	  	},
	  	//修改在线状态
	  	setStatus(state, {payload}){
	  		const { selfStatus } = payload;
	  		const { userInfo={} } = state;
	  		let newObj = {...userInfo};
	  		newObj.staffStatus = selfStatus;
	  		return{
	  			...state,
	  			userInfo:newObj
	  		}
	  	},
	  	//更新列表
	  	setOnlineList(state, {payload}){
	  		const { onlineList=[] } = payload;
	  		return{
	  			...state,
	  			onlineList
	  		}
	  	},
	  	//更新聊天记录
	  	setChatList(state, {payload}){
	  		const { chatList=[] } = payload;
	  		return{
	  			...state,
	  			chatList
	  		}
	  	},
	  	addChatList(state, {payload}){
	   		const { chatList=[] } = state;
	   		const { data } = payload;
	   		let newList = [...chatList];
	   		newList.push(data);
	   		return{
	   			...state,
	   			chatList:newList
	   		}
	    },
	   	//更新排队人数
	   	setLineUp(state, {payload}){
	   		const { lineUpNum=0 } = payload;
	   		return{
	   			...state,
	   			lineUpNum
	   		}
	   	},
	   	//当前会话人
	   	setCurrentInfo(state, {payload}){
	   		const { currentInfo={} } = payload;
	   		return{
	   			...state,
	   			currentInfo
	   		}
	   	},
	   	setQuickReplyContent(state, {payload}){
	   		const { quickList } = payload;
	   		return{
	   			...state,
	   			quickList
	   		}
	   	},
	   	clearQuick(state, {payload}){
	   		return{
	   			...state,
	   			quickList:[]
	   		}
	   	},
	   	setRepeatLogin(state, {payload}){
	   		const { repeatLogin } = payload;
	   		return{
	   			...state,
	   			repeatLogin
	   		}
	   	},
	   	clearAll(state, {payload}){
	   		return{
	   			...state,
	   			userInfo:{},
			  	currentInfo:{},
			   	onlineList:[],
			   	chatList:[],
			   	quickList:[],
			   	lineUpNum:0,
	   		}
	   	}
    }
};
