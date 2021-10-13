import React,{ Component } from 'react';
import { Modal } from 'antd';

class CompletePreview extends Component{
    
    render(){
        const { title,content,visible,onCancel } = this.props;
        return(
            <Modal
                title={title}
                className='preview-modal'
                footer={null}
                visible={visible}
                onCancel={onCancel}
                destroyOnClose={true}
                centered={true}
            >
                <div dangerouslySetInnerHTML={{ __html: content }}></div>
            </Modal>
        )
    }
}

export default CompletePreview;