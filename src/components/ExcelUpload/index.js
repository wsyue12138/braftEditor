import React,{ Component } from 'react';
import { Icon,Upload,Button } from 'antd';
import { modalContent } from '@utils/utils';

/**
 * author：wsyue
 * className
 * title: 按钮名字
 * header；请求头
 * data：参数
 * action：上传地址
 * successCallback：成功回调
 * errorCallback：失败回调
 * **/

export default function ExcelUpload(props){
	const { id,className,title='导入',headers,data,action,successCallback,errorCallback } = props;
	let isSubmit = true;
	let ref = null;
	const uploadProps = {
		accept:
        	'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    	headers,
    	action,
    	data,
    	beforeUpload: file => {
    		if(!isSubmit){
				return false;
			}
			isSubmit = false;
    		if (
      			file.type &&
      			file.type != 'application/vnd.ms-excel' &&
      			file.type != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    		) {
    			ref = modalContent('warning','仅支持excel文件上传!',true);
    			isSubmit = true;
      			return false;
    		} else if (
      			file.name.indexOf('xls') < 0 &&
      			file.name.indexOf('xlsx') < 0
    		) {
    			ref = modalContent('warning','仅支持excel文件上传!',true);
    			isSubmit = true;
      			return false;
    		}
    		ref = modalContent('info','导入中......',false);
    	},
    	onChange(info) {
    		if (info.file.status !== 'uploading') {
      				
			}
			if (info.file.status === 'done') {
				const response = info.file.response;
  				const { ret_code,ret_msg } = response;
  				ref.destroy();
  				if(ret_code === 1){
  					ref = modalContent('success','导入成功',true);
  					if(successCallback){
  						successCallback();
  					}
  				}else{
  					if(ret_code === 11019){
	  					ref = modalContent('error',`导入失败,${ret_msg}`,true);
	  				}else
	  				if(ret_code === 11020){
	  					ref = modalContent('error',`导入失败,${ret_msg}`,true);
	  				}else{
	  					ref = modalContent('error','导入失败,请稍后重试',true);
	  				}
	  				if(errorCallback){
	  					errorCallback();
	  				}
  				}
  				isSubmit = true;
			} else if (info.file.status === 'error') {
				ref.destroy();
  				ref = modalContent('error','导入失败,请稍后重试',true);
  				if(errorCallback){
  					errorCallback();
  				}
  				isSubmit = true;
			}
    	}
	}
	
	if(id){
		uploadProps.id = id ;
	}
	
	return(
		<Upload {...uploadProps}>
          	<Button className={className}>
          		{title}
          		<Icon type="download" />
          	</Button>
      	</Upload>
	)
}
