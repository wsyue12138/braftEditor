import React,{ Component,Fragment } from 'react';
import DetailModule from './DetailModule';
import Similar from '@components/Similar';

const SingleSimilar = (props) => {

	const { global:{productionId},single:{onceData},getList,dispatch } = props;
	const { question='',id } = onceData;

	const unmountCallback = () => {
		dispatch({
			type:'single/clearOnceData'
		})
		dispatch({
			type:'single/clearSimilarKnowledgePage',
		})
	}

	const intoDetailCallback = (onceData) => {
		dispatch({
			type:'single/setSimilarOnce',
			payload:{onceData}
		})
	}

	//关闭相似
	const handleBoxClose = () => {
		dispatch({
			type:'single/setSingleVisible',
			payload:{singleVisible:false}
		})
	}

	return <Similar 
		type='single'
		questionContent={question}
		productionId={productionId}
		currentKnowledgeId={id}
		DetailModule={DetailModule}
		intoDetailCallback={intoDetailCallback}
		handleBoxClose={handleBoxClose}
		unmountCallback={unmountCallback}
		getList={getList}
		onceData={onceData}
		{...props}
	/>
}

export default SingleSimilar;
