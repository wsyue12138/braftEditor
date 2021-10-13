import React,{ Component } from 'react';
import { Icon,Upload,Button } from 'antd';
import { modalContent } from '@utils/utils';

/**
 * author：wsyue
 * className
 * fileName:导出文件名
 * title: 按钮名字
 * method：请求方式
 * header；请求头
 * data：参数
 * action：上传地址
 * successCallback：成功回调
 * errorCallback：失败回调
 * **/

export default function ExcelExport(props){
	const { className,method='POST',fileName='导出案例',title='导出',headers,data,action,successCallback,errorCallback } = props;
	let isSubmit = true;
	let ref = null;
	const handleExport = () => {
		if(!isSubmit){
			return false;
		}
		isSubmit = false;
		let ref = modalContent('info','导出中......',true);
		let requestData = {
			method,
            headers
		}
		if(method === 'POST'){
			requestData.body = JSON.stringify(data);
		}
	    fetch(action, requestData)
            .then(response => {
				const suffix = response.headers.get('content-disposition').split(';')[1].split('=')[1].split('.')[1]
            	if (window.navigator.msSaveOrOpenBlob) {
            		ref.destroy();
					response.blob().then(blob => {
						navigator.msSaveBlob(blob, fileName);
					})
  				}else {
  					ref.destroy();
					response.blob().then(blob => {
						var url = window.URL.createObjectURL(blob);
						var a = document.createElement('a');
						a.href = url;
						a.download = `${fileName}.${suffix}`;
						document.body.appendChild(a)
						a.click();
					})
  				}
  				if(successCallback){
  					successCallback();
  				}
  				isSubmit=true
			})
            .catch(error => {
				ref.destroy();
            	if(errorCallback){
            		errorCallback();
            	}else{
					modalContent('error','导出失败，稍后再试',true)
				}
            	isSubmit=true;
           	})
	}
	return(
		<Button className={className} onClick={handleExport}>
      		{title}
      		<Icon type="upload" />
      	</Button>
	)
}
