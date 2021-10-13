import React,{ Component,Fragment } from 'react';
import DetailModule from './DetailModule'; 
import Similar from '@components/Similar';

const UnknownQuestionSimilar = (props) => {

	const { global:{productionId},unknownQuestion:{onceData},getList } = props;
	const { unQuestion='' } = onceData;
	
	//关闭相似弹窗
	const handleBoxClose = () => {
		const { dispatch } = props;
		dispatch({
			type:'unknownQuestion/setVisible',
			payload:{visible:false},
		})	
	}
	
	return <Similar 
		type='unknownQuestion'
		questionContent={unQuestion}
		productionId={productionId}
		DetailModule={DetailModule}
		handleBoxClose={handleBoxClose}
		getList={getList}
		onceData={onceData}
		{...props}
	/>
}

export default UnknownQuestionSimilar;