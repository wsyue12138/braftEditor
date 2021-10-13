/**
 * author：wsyue
 * 头像类单张上传组件
 * opeionName:发到后台的文件参数名
 * action:上传的地址
 * method:上传方式
 * headers：请求头
 * maxSize:文件最大上传体积
 * initUrl:初始化图片地址
 * callback:上传回调
 * **/

import React,{ useState } from 'react';
import { Upload, Icon } from 'antd';
import { modalContent } from '@utils/utils';
import styles from './style.less';

const AvatarUploader = (props) => {

    const { 
        opeionName='file',
        action='',
        method='post',
        headers={},
        maxSize=2,
        initUrl,
        callback=(res) => {},
    } = props;
    
    const [imageUrl, setImageUrl] = useState(initUrl);
    const [loading, setLoading] = useState(false);

    //base64转换
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
      
    //上传之前处理
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            modalContent('warning','只可上传 JPG/PNG/Gif 文件!',true);
        }
        const isLt2M = file.size / 1024 / 1024 < maxSize;
        if (!isLt2M) {
            modalContent('warning',`文件大小不得超过${maxSize}M!`,true);
        }
        return isJpgOrPng && isLt2M;
    }

    //回调
    const onChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            const response = info.file.response;
            const { ret_code } = response;
            if(ret_code === 1){
                getBase64(info.file.originFileObj, imageUrl => {
                    setImageUrl(imageUrl);
                });
            }
            setLoading(false);
            callback(response);
        } else if (info.file.status === 'error') {
            setLoading(false)
            modalContent('error','上传失败，请稍后重试',true);
            callback({ret_code:2,ret_msg:'上传失败，请稍后重试'});
        }
    }

    const uploadButton = (
        <div>
          <Icon type={loading ? 'loading' : 'plus'} style={{fontSize:45,color:'#d9d9d9'}} />
        </div>
    );

    const uploadProps = {
        accept:'.jpg, .png, .gif',
        action,
        name:opeionName,
        method,
        headers,
        listType:"picture-card",
        className:styles.avatarUploader,
        showUploadList:false,
        beforeUpload,
        onChange
    }   
    return(
        <Upload {...uploadProps}>
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
    )
}

export default AvatarUploader;