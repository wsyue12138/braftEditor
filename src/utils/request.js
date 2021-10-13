import { fetch } from 'dva';
import {
	message
} from 'antd';
import Store from 'store';
import { getUserData } from './utils';

let messageShow = false;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {

	let enableToken = '';
	url = '/icservice' + url;
	if(url.indexOf('/user/login') !== -1) {											//登录接口处理
		enableToken = '';
	}else{
		let userData = getUserData();
		if(userData){
			let { data={} } = userData;
			let { token='' } = data;
			enableToken = token;
		}
	}

	const defaultOptions = {
    credentials: 'include',
    headers: {
      'token': enableToken,
      'resolution': window.screen.width + '*' +window.screen.height,
      //'browsername':getBrowserName(),
    }
  };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST'){
  	if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body.params);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
	  newOptions.body = JSON.stringify(newOptions.body.params);
    }
  }else{
  	newOptions.headers = {
  		...newOptions.headers
  	}
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
    	if(response.status == 200) { // 截断接口报错
            return response.json();
        } else {
				//此处可做错误监听
        return {
          success: false
        }

      }
    })
    .then(response => {
        let newResponse = {};
    	if(parseInt(response.ret_code) === 1){
    		let { ret_code=1,ret_msg='' } = response;
    		let newResponse = {
    			code:ret_code,
    			success:true,
    			message:ret_msg,
    			data:response
    		}
        return newResponse
      } else if(parseInt(response.ret_code) === 11006){
        // message.error('登录失效')
        const { origin,pathname } = window.location;
        response.success = false;
        Store.remove('userData');
        window.location.href = origin + pathname + '#/user/login';
        return response;
      }else
      if(parseInt(response.ret_code) === 11025){
      	const { origin,pathname } = window.location;
      	if(!messageShow){
      		messageShow = true;
      		window.location.href = origin + pathname + '#/welcome';
			    message.warning('操作权限已变更',2).then(() => {
            messageShow = false;
				    //window.location.reload(true);
			    });
      	}
      	return newResponse;
      }else
      if(parseInt(response.ret_code) === 11031){

      	if(!messageShow){
      		messageShow = true;
      		message.error('非法的数据关联关系,请确认关联关系是否正确或联系管理员！',2).then(() => {
	      		messageShow = false;
	      	});
      	}
      	return newResponse;
      }else{
      	let { ret_code=-1,ret_msg='' } = response;
      	let newResponse = {
    			code:ret_code,
    			success:false,
    			message:ret_msg,
    			data:response
    		}
      	return newResponse;
      }
    })
    .catch(err => {
    	const { response={} } = err;
    	let { status=404 } = response;
    	return { code:status,success:false };
    });
}
