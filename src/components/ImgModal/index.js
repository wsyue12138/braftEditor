import React,{ Component } from 'react';
import { Modal,Icon } from 'antd';
import styles from './style.less';

/**
 * author：wsyue
 * visible:是否显示
 * title：标题
 * previewImage：图片地址
 * onCancel：关闭回调
 * 
 * **/

export default function ImgModal(props){
	const { visible=false,title='  ',previewImage='',onCancel } = props;
	const cancelIcon = (
		<Icon 
			type="close-circle" 
			className={styles.cancelIcon}
			theme='filled'
		/>
	)
	return(
		<Modal 
			title={title}
			closeIcon={cancelIcon}
			visible={visible} 
			footer={null} 
			onCancel={onCancel}
			wrapClassName={styles.imgModal}
		>
  			<img alt="example" style={{ maxWidth:1100,maxHeight:700,minWidth:520 }} src={previewImage} />
		</Modal>
	)
}
