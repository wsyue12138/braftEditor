import React,{ Component } from 'react';
import { Popover,Button,Icon } from 'antd';
import faceList from './list';
import emojiStyle from './emoji.less';
import styles from './style.less';
let jEmoji = require('emoji');

/**
 * author：wsyue
 * className:样式
 * fontSize:按钮大小
 * icon：图标
 * title：按钮名称
 * trigger：触发方式
 * placement：弹出位置
 * onChange：表情点击回调
 * **/

export default function EmojiMouunt (props){
	const { 
		className=styles.emojiMouunt,
		fontSize=22,
		icon='smile',
		title='表情',
		trigger='click',
		placement='topLeft',
		onChange= (data) => {}
	} = props;
	
	const handleSelect = (native) => {
		onChange(native);
	}
	
	const creatOnce = () => {
		let html = '';
		return(
			<div className={styles.emojiBox}>
				<div className={emojiStyle.emojiConent}>
					{
						faceList.map((item,index) => {
							const { id,faceArr } = item;
							return(
								<div key={id} style={{overflow:'hidden'}}>
									{
										faceArr.map((val,i) => {
											const { code,title,native } = val;
											let className = 'emoji' + ' emoji' + code;
											return(
												<div 
													className={styles.once} 
													title={title} 
													key={i} 
													onClick={() => handleSelect(native)}
												>
													<span className={className}></span>
												</div>
											)
										})
									}
								</div>
							)
						})
					}
					
				</div>
			</div>
		)
		
		return html;
	}
	return(
		<div className={styles.emojiMouunt}>
			<Popover
				overlayClassName={styles.popover}
				placement={placement}  
				content={creatOnce()} 
				trigger={trigger}
			>
        		<Icon type={icon} style={{fontSize:fontSize + 'px',color:'#333333'}} title={title} />
      		</Popover>
  		</div>
	)
}
