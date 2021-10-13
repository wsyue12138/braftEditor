import React,{ Component } from 'react';
import { connect } from 'dva';
import { getMenuData } from '@common/menu';
import Redirect from 'umi/redirect';

@connect(({
	global
}) => ({
	global
}))

class BackgroundDataJump extends Component{
  render(){
    const { global } = this.props;
    const { independentMenusData=[] } = global;
    const rotueData = getMenuData('common');
    const currentRoute = rotueData.filter((item) => {
      return item.code === '01000000';
    })
    const { children=[] } = currentRoute[0];
    let jumpPath = '';
    children.map((item) => {
      const { path,code } = item;
      const _index = independentMenusData.findIndex((i) => {
        return i.permissionCode === code;
      })
      if(jumpPath == '' && _index !== -1){
        jumpPath = path;
      }
    });
    
    return <Redirect to={`/common${jumpPath}`} />
  }

}

export default BackgroundDataJump;
