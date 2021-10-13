import Store from 'store';
import {
	Modal
} from 'antd';
import avatar1 from '../assets/avatar/avatar1.png';
import avatar2 from '../assets/avatar/avatar2.png';
import avatar3 from '../assets/avatar/avatar3.png';
import avatar4 from '../assets/avatar/avatar4.png';
import avatar5 from '../assets/avatar/avatar5.png';
import avatar6 from '../assets/avatar/avatar6.png';
import avatar7 from '../assets/avatar/avatar7.png';
import avatar8 from '../assets/avatar/avatar8.png';
import avatar9 from '../assets/avatar/avatar9.png';
import avatar10 from '../assets/avatar/avatar10.png';
import avatar11 from '../assets/avatar/avatar11.png';
import avatar12 from '../assets/avatar/avatar12.png';
import avatar13 from '../assets/avatar/avatar13.png';
import avatar14 from '../assets/avatar/avatar14.png';
import avatar15 from '../assets/avatar/avatar15.png';
import avatar16 from '../assets/avatar/avatar16.png';

export const avatarArr = [avatar1,avatar2,avatar3,avatar4,avatar5,avatar6,avatar7,avatar8,avatar9,avatar10,avatar11,avatar12,avatar13,avatar14,avatar15,avatar16];

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function getCookie(name) {
	var strcookie = document.cookie;//获取cookie字符串
  var arrcookie = strcookie.split("; ");//分割
  //遍历匹配
  for (var i = 0; i < arrcookie.length; i++) {
    var arr = arrcookie[i].split("=");
    if (arr[0] == name) {
      return arr[1];
    }
  }
  return "";
}

export function setCookie(name, value) {
  var Days = 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 30);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

export function trim(values) {
  let trimFun = (str) => {
    if (typeof (str) == 'string') {
      return str.replace(/(^\s*)|(\s*$)/g, "");
    } else {
      return str
    }
  }
  let arr = Object.keys(values)
  let obj = {}
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i]] = trimFun(values[arr[i]])
  }
  return obj
}

export function strTrim(str) {
  if (typeof (str) == 'string') {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  } else {
    return str
  }

}

//获取store中个人信息
export function getUserData(){
	const { origin,pathname } = window.location;
	let userData = Store.get('userData');
	if(userData){
		let { data={} } = JSON.parse(userData);
		let { loginSuccess=-1,token='',userId='' } = data;
		if(loginSuccess !== -1 && token != '' && userId != ''){         							//登录信息不全
			return JSON.parse(userData);
		}else{
			Store.remove('userData');
			window.location.href = origin + pathname + '#/user/login';
			return {};
		}
	}else{
		Store.remove('userData');
		window.location.href = origin + pathname + '#/user/login';
		return {};
	}
}

export function setCurrentRouters(routersData,parentPath){
		let list =[];
		routersData.map((item,index) => {
			let { path='',component } = item;
			let pathArr = path.split(parentPath);
			if(pathArr.length > 1 && pathArr[1] != ''){
				list.push(item);
			}
		})
		return list;
}

export function getRole(roleType,list=[]){
	let isExistence = false;
	list.map((item,index) => {
		if(item.roleType === roleType){
			isExistence = true;
		}
	})
	return isExistence;
}

//弹窗提示
export function modalContent(type,content,isBtn){
	let ref = Modal[type]({
		title: content,
		content: '',
		className:isBtn ? '' : 'selfMethod',
		okText:isBtn ? '知道了' : ''
	})
	return ref;
}

//设置权限
export function setAuthority(authorityList=[]){
	let workforceAuthority = {};
	let knowledgeAuthority = {};
	let serviceAuthority = {};
	authorityList.map((item,index) => {
		const { parentCode,permissionCode,permissionType } = item;
		if(parentCode === "05010000" && permissionType !== 1){				//知识库总览
			switch (permissionCode){
				case "05010100":											//导入权限
					knowledgeAuthority.importBtn = true;
					break;
				case "05010200":											//导出权限
					knowledgeAuthority.exportBtn = true;
					break;
				case "05010300":											//审核权限
					knowledgeAuthority.examineBtn = true;
					break;
				case "05010400":											//处理、新增完成权限
					knowledgeAuthority.handleBtn = true;
					break;
				case "05010500":											//生效权限
					knowledgeAuthority.takeEffectBtn = true;
					break;
				case "05010600":											//变更权限
					knowledgeAuthority.changeBtn = true;
					break;
				default:
					break;
			}
		}else
		if(parentCode === "05050000" && permissionType !== 1){
			switch (permissionCode){
				case "05050200":											//工单管理-处理权限
					workforceAuthority.handleBtn = true;
					break;
				default:
					break;
			}
		}else
		if(parentCode === '04020000' && permissionType !== 1){
			switch (permissionCode){
				case "04020200":											//服务功能明细导入、导出权限
					serviceAuthority.handleBtn = true;
					break;
				default:
					break;
			}
		}
	})
	return {workforceAuthority,knowledgeAuthority,serviceAuthority};
}


export  function handleCode(response){
      if(parseInt(response.code) === 11021){
        // message.error('该是数字的传了字符串')
    		let { code=1,ret_msg='' } = response;
    		let newResponse = {
    			code,
    			success:true,
    			message:ret_msg,
    			data:{
                    data: [],
                    pageNum: 1,
                    pageSize: 10
                }
    		}
      	return newResponse
    }else if(parseInt(response.code) === 11018){
        // message.error('校验重复')
    		let { code=1,message='' } = response;
    		let newResponse = {
    			code,
    			success:false,
                message:message,
                repeat:message.split('$')[0]
    		}
      	return newResponse
    }
    return response
}


export function contrast({editId, editRecord ,operateType},dataCon){
    let data = {}
    if (operateType == '编辑') {
        for(var key in dataCon){
            if(dataCon[key] != editRecord[key]){
                data[key] = dataCon[key]
            }
        }
        if(Object.keys(data).length == 0){
            return false
        }
        data.id = editId
        return data
    }
    return dataCon
}

//换行处理
export function lineBreak(str){
	let content = str.replace(/\\n/g, " \n");
	let newStr = content.replace(/[\r\n]+/g,'@_@');
	let arr = newStr.split('@_@');
	let finalStr = '';
	if(arr.length){
		arr.map((item,index) => {
			if(index === 0){
				finalStr += item.trim();
			}else{
				finalStr += '\n' + item.trim();
			}
		})
	}else{
		finalStr = str.trim();
	}
	return finalStr;
}

//日期格式
export function setDateFormat(timers,type=1){   //type:0 YYYY年MM月DD日; 1 YYYY/MM/DD; 2 YYYY-MM-DD; 3 YYYY:MM:DD; 4 YYYYMMDD
	const timeData = new Date(timers);
	let sign = '';
	if(type === 1){
		sign = '/';
	}else
	if(type === 2){
		sign = '-';
	}else
	if(type === 3){
		sign = ':';
	}
	const Y = timeData.getFullYear();
    const M = (timeData.getMonth()+1 < 10 ? '0' + (timeData.getMonth()+1) : timeData.getMonth()+1);
    const D = (timeData.getDate() < 10 ? '0' + timeData.getDate() : timeData.getDate());
    let timerStr = Y + '' + sign + '' + M + '' + sign + '' + D;
    if(type === 0){
    	timerStr = Y + '年' + M + '月' + D + '日';
    }
    return timerStr;
}

//时间格式
export function setTimeFormat(endTime,startTime=0,type='zh_CN'){
	const endNum = new Date(endTime).getTime();
	const createNum = new Date(startTime).getTime();
	let difference = endNum - createNum;
	let timeTxt = '';
	if(difference > 0){
		let num = parseInt(difference / 1000);
		let h = Math.floor(num / 3600);
		let h1 = num % 3600;
		let m = Math.floor(h1 / 60);
		let s = h1 % 60;
		if(type === 'zh_CN'){
			if(h > 0){
				timeTxt += h + '小时';
			}
			if(m > 0 || h > 0){
				timeTxt += m + '分';
			}
			timeTxt += s + '秒';
		}else{
			if(h > 0){
				timeTxt += h + 'h';
			}
			if(m > 0 || h > 0){
				timeTxt += m + 'm';
			}
			timeTxt += s + 's';
		}

	}else{
		if(type === 'zh_CN'){
			timeTxt = '0秒';
		}else{
			timeTxt = '0s';
		}
	}
	return timeTxt;
}

//百分比处理
export function setPercentage(data,isString=true){
	const num = Number(data);
	const percentage = parseInt(num * 10000) / 100;
	return isString ? percentage + '%' : percentage;
}

//导出方法
export function handleExport(options){
	const { className,method='POST',fileName='导出案例',title='导出',headers,data,action,successCallback,errorCallback } = options;
	let ref = null;
	ref = Modal.info({
		title: '导出中......',
		content: '',
		className:'',
		okText:'知道了'
	});
	let requestData = {
		method,
        headers
	}
	if(method === 'POST'){
		requestData.body = JSON.stringify(data);
	}
    fetch(action, requestData)
        .then(response => response.blob())
        .catch(error => {
        	if(errorCallback){
        		errorCallback();
        	}
       	})
        .then(blob => {
        	if (window.navigator.msSaveOrOpenBlob) {
        		ref.destroy();
				navigator.msSaveBlob(blob, fileName);
			}else {
				ref.destroy();
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a)
                a.click();
			}
			if(successCallback){
				successCallback();
			}
        });
}

//保留两位小数
export function setFixed(data,proportion){
	const a = String(data).indexOf(".");
	const b = (data / proportion);
	let num;
	if(a != -1){
		num = b.toFixed(2);
	}else{
		num = b;
	}
	return num;
}

//富文本提取图片数组
export function extractImg(str){
  let newHtml = '';
  let imgArr = [];
  str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, function(match, capture) {
    imgArr.push(capture);
  });
  return imgArr;
};

//富文本内容提取
export function extractText(str){
let texts = str;
texts = texts.replace(/(\n)/g, '');
texts = texts.replace(/(\t)/g, '');
texts = texts.replace(/(\r)/g, '');
texts = texts.replace(/<\/?[^>]*>/g, '');
texts = texts.replace(/\s*/g, '');
return texts;
};
