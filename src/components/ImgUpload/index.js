import React,{ Component } from 'react';
import { Icon,Upload } from 'antd';
import { modalContent } from '@utils/utils';

/**
 * author：wsyue
 * className
 * data：参数
 * imgList:已上传图片列表
 * action：上传地址
 * maxLen：最大上传个数
 * maxSize:最大上传大小
 * **/

export default function ImgUpload(props){
	const { className,headers,data,action,imgList=[],maxLen=0,maxSize=2,successCallback,errorCallback } = props;
	let isSubmit = true;
	const uploadProps = {
		accept:'.jpg, .jpeg, .png',
    	headers,
    	action,
    	data,
    	beforeUpload: file => {
    		if(!isSubmit){
				return false;
			}
			isSubmit = false;
			if(maxLen !== 0 && imgList.length === maxLen){
				modalContent('warning',`最多上传${maxLen}张图片`,true);
    			isSubmit = true;
      			return false;
			}
    		if (
      			file.type && file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png'
    		) {
    			modalContent('warning','仅支持上传jpeg,jpg,png文件!',true);
    			isSubmit = true;
      			return false;
    		} else if (
      			file.name.indexOf('jpg') < 0 &&
      			file.name.indexOf('jpeg') < 0 &&
      			file.name.indexOf('png') < 0 
    		) {
    			modalContent('warning','仅支持上传jpeg,jpg,png文件!',true);
    			isSubmit = true;
      			return false;
    		}
    		if(file.size && file.size > (1024 * maxSize * 1000)){
    			modalContent('warning',`文件大小不得超过${maxSize}M!`,true);
    			isSubmit = true;
    			return false;
    		}
    		//ref = modalContent('info','导入中......',false);
    	},
    	onChange(info) {
    		if (info.file.status !== 'uploading') {
  				
			}
			if (info.file.status === 'done') {
				const response = info.file.response;
				successCallback(response);
  				isSubmit = true;
			} else if (info.file.status === 'error') {
				errorCallback();
  				isSubmit = true;
			}
    	}
	}
	
	return(
		<Upload {...uploadProps}>
			<Icon 
				type="picture"
				title='上传图片'
				style={{color:'#333333'}}
				className={className}
			/>
		</Upload>	
	)
}
