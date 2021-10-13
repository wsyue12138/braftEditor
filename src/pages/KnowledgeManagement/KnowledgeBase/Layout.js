import React,{ Component,Fragment } from 'react';
import MenuContent from './MenuContent/MenuContent';
import { connect } from 'dva';

@connect(({
	global,
	knowledgeBase
}) => ({
	global,
	knowledgeBase
}))

class KnowledgeBase extends Component{

	componentDidMount(){

		const { dispatch } = this.props;
		dispatch({
			type:'knowledgeBase/clearData'
		})
	}

	render(){
		const { children,location:{pathname} } = this.props;
    const _index = pathname.indexOf('multiple');
    
		return (
			<div style={{width:'100%'}}>
				<MenuContent type={ _index !== -1 ? 'multiple' : 'single' } />
				{ children }
			</div>
		)
	}
}

export default KnowledgeBase;
