import React,{ Component } from 'react';
import { connect } from 'dva';
import RouteTabs from '@components/RouteTabs';

@connect(({
  global
}) => ({
  global
}))

class DataAnalysisDetailed extends Component{
	
	render(){
    const { children } = this.props;
		return (
      <div style={{width:'100%',height:'100%'}}>,
        <RouteTabs {...this.props} />
        <div style={{width:'100%',marginTop:20}}>
          {children}
        </div>
      </div>
    )
	}
}
export default DataAnalysisDetailed;