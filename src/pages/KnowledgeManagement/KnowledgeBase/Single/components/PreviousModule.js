import React,{ Fragment } from 'react';
import {
	Form,
    Input,
	Select,
	Radio
} from 'antd';

const { TextArea } = Input;

const PreviousModule = (props) => {
	
	const {  form:{getFieldDecorator},single:{customFieldName,onceData,onceType},previousData } = props;
	//表单部分
	const formContent = () => {
		let { 
			formerQuestion='',
			formerServerTypeName='',
			formerAnswer=JSON.stringify([]),
			formerLinkUrl='',
			formerKnowledgeStatus=1,
			formerCustomField='',
			formerSimilar=JSON.stringify([]),
			changeDescription='',
			formerRegionName='全国'
		} = previousData;
		const { operateType } = onceData;
		formerSimilar = formerSimilar === null ? JSON.stringify([]) : formerSimilar;
		const formerAnswerList = formerAnswer ? JSON.parse(formerAnswer) : [];
        const list = JSON.parse(formerSimilar);
		const formType = 'previous';
		return(
			<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
				{
					onceType !== 'answer' ? (
						<Fragment>
							<Form.Item label="原标准问句">
								{getFieldDecorator('question' + formType,{
									initialValue:formerQuestion,
									rules: [
										{ 
											required: true,
											message:'请输入标准问句'
										}
									]
								})(
									<Input 
										placeholder="请输入标准问句" 
										disabled={true} 
										title={formerQuestion}
									/>
								)}
							</Form.Item>
							{
								list.length === 0 ? '' : (
									<Form.Item label={`原相似问句`} style={{marginBottom:0}}>
										{getFieldDecorator('similar' + formType)(
											<span></span>
										)}
									</Form.Item>
								)
							}
							{
								list.map((item,index) => {
									return(
										item == '' ? '' : (
											<Input 
												key={index}
												value={item}
												disabled={true}
												title={item}
												placeholder='输入新的相似问句' 
												style={{marginBottom:18}}
												suffix={<span />} 
											/>
										)
									)
								})
							}
						</Fragment>
					) : ''
				}	
				{
					onceType !== 'question' ? (
						<Form.Item label={`原地区`}>
							{getFieldDecorator('region' + formType,{
								initialValue:formerRegionName
							})(
								<Input placeholder="请选择地区" disabled />
							)}
						</Form.Item>
					) : ''
				}				
				{
					onceType !== 'answer' ? (
						<Form.Item label={`原业务分类`}>
							{getFieldDecorator('serviceType' + formType,{
								initialValue:formerServerTypeName
							})(
								<Input placeholder="请选择业务分类" disabled />
							)}
						</Form.Item>
					) : ''
				}				
				{
					onceType !== 'question' ? (
						<Fragment>
							{
								formerAnswerList.map((item,index) => {
									const { answer='',id } = item;
									return(
										<Form.Item label={index ? '' : '原答案'} key={id}>
											{getFieldDecorator(`answer_${id}_${formType}`,{
												initialValue:answer.replace(/\\n/g, " \n")
											})(
												<TextArea rows={6} placeholder="请输入答案" disabled style={{resize: 'none'}} />
											)}
										</Form.Item>
									)
								})
							}
							<Form.Item label={`原链接`}>
								{getFieldDecorator('linkUrl' + formType,{
									initialValue:formerLinkUrl
								})(
									<TextArea 
										placeholder="请输入链接" 
										rows={2}
										style={{resize: 'none'}}
										disabled={true} 
										title={formerLinkUrl}
									/>
								)}
							</Form.Item>
							<Form.Item label={`原${customFieldName}`}>
								{getFieldDecorator('customField' + formType,{
									initialValue:formerCustomField
								})(
									<TextArea rows={4} style={{resize: 'none'}} placeholder="请输入内容" disabled={true} />
								)}
							</Form.Item>
						</Fragment>
					) : ''
				}
				{
					operateType !== 1 ? (
						<Form.Item label="启用/停用">
							{getFieldDecorator('knowledgeStatus' + formType,{
								initialValue:formerKnowledgeStatus
							})(
								<Radio.Group disabled={true}>
									<Radio value={1} style={{marginRight:280}}>启用</Radio>
									<Radio value={0}>停用</Radio>
								</Radio.Group>
							)}
						</Form.Item>
					) : ''
				}
			    
			    <Form.Item label="修改说明">
                    {getFieldDecorator('changeDescription' + formType,{
                        initialValue:changeDescription
                    })(
                        <TextArea rows={4} style={{resize: 'none'}} placeholder="请输入内容" disabled={true} />
                    )}
                </Form.Item>
			</Form>
		)
	}
	
	
	return(
        <Fragment>
            {formContent()}
        </Fragment>
    )
}

export default PreviousModule;