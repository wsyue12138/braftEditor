import React,{ Component,Fragment } from 'react';
import DetailModule from './DetailModule'; 
import Similar from '@components/Similar';

const UnresolvedQuestionSimilar = (props) => {
	
	
	
	//关闭弹窗
	const handleBoxClose = () => {
		const { dispatch } = props;
		dispatch({
			type:'unresolvedQuestion/setVisible',
			payload:{visible:false},
		})	
	}

	const { global:{productionId},unresolvedQuestion:{onceData},getList } = props;
	const { unQuestion='' } = onceData;
	
	return <Similar 
		type='UnresolvedQuestion'
		questionContent={unQuestion}
		productionId={productionId}
		DetailModule={DetailModule}
		handleBoxClose={handleBoxClose}
		getList={getList}
		onceData={onceData}
		{...props}
	/>
}

export default UnresolvedQuestionSimilar;