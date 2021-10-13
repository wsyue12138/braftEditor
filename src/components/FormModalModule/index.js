import React from 'react';
import { Modal } from 'antd';
import styles from './style.less';

const FormModal = (props) => { 

    const { title='',width=420,content='',footerContent='',visible } = props;

    const footer = (
        <div className={styles.footerBox}>
            {footerContent}
        </div>
    )
    
    return(
        <Modal
            title=""
            width={width}
            centered={true}
            closable={false}
            visible={visible}
            maskClosable={false}
            destroyOnClose={true}
            wrapClassName={styles.formModal}
            footer={footer}
            bodyStyle={{padding:'24px 50px 20px 50px'}}
        >
            <div className={styles.contentBox}>
                {
                    title != '' ? (<h3 className={styles.title}>{title}</h3>) : ''
                }

                <div className={styles.content}>
                    {content}
                </div>
            </div>
        </Modal>
    )
}

export default FormModal;