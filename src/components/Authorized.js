import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { Spin,message } from 'antd';
import Redirect from 'umi/redirect';
import Store from 'store';

@connect(({
  global,
  user
}) => ({
  global,
  user
}))

class Authorized extends Component{

  state = {
    type:0,
    isUser:false,
    isPermission:false
  }

  componentDidMount(){
    this.init();
	
  }
	
  init = () => {
    let userData = Store.get('userData');
    let returnDom = '';
    if (userData) {
        let { data = {} } = JSON.parse(userData);
        let { token = '', loginSuccess = 0 } = data;
        if(token == ''){
          this.setState({type:1});
        }else{
          this.getUserInfo(data);
          this.getPermissionInfo(data);
        }
    } else {
        this.setState({type:1});
    }
  }

  //获取个人信息
  getUserInfo = (data) => {
  	const { dispatch } = this.props;
  	let { productionId=-1 } = data;
  	let payload = productionId === -1 ? {} : {productionId};
  	dispatch({
  		type:'user/fetchGetUserInfo',
  		payload,
  		callback:(res) => {
  			let { success } = res;
  			if(success){
  				this.setState({isUser:true},() => {
            //this.setRouter();
          });
  			}else{
  				Store.remove('userData');
  				this.setState({type:1});
  			}
  		}
  	})
  }

  //获取权限
  getPermissionInfo = (data) => {
  	const { dispatch,match } = this.props;
    const { path } = match;
    let requestUrl = '';
    let payload = {};
    if(path === '/common'){
      requestUrl = 'global/fetchGetIndependentPermissionInfo';
    }else{
      let { productionId=-1 } = data;
      payload = productionId === -1 ? {} : {productionId};
      requestUrl = 'global/fetchGetPermissionInfo';
    }
  	dispatch({
  		type:requestUrl,
      payload,
  		callback:(res) => {
  			let { success,code } = res;
  			if(!success){
  				if(code === 11030 || code === 11013){
  					message.error(res.message);
  				}
  				Store.remove('userData');
  				this.setState({type:1});
  			}else{
          this.setState({isPermission:1});
        }
  		}
  	})
  }

  //设置保存路由列表
  setRouter(){
  	const { dispatch,getRouteData } = this.props;
  	dispatch({
  		type:'global/setRouter',
  		payload:{data:getRouteData('BasicLayout')}
  	})
  }

  render(){
    const { children } = this.props;
    const { isUser,isPermission,type } = this.state;
    let returnDom = '';
    if(isUser && isPermission){   //个人信息与权限加载完场
      returnDom = (<div style={{height:'100%'}}>{ children }</div>);
    }else{
      if(type){    //登录失败
        returnDom = (<Redirect to="/user/login" />);
      }else{        //加载过程
        returnDom = (<div style={{width:'100%',textAlign:'center',lineHeight:'500px'}}><Spin size="large" /></div>);
      }
    }
    return <Fragment>{returnDom}</Fragment>
  }

}

export default Authorized;
