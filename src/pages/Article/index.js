import React,{ Component } from 'react';
import { connect } from 'dva';
import { getMenuData } from '@common/menu';
import Redirect from 'umi/redirect';

@connect(({
	global
}) => ({
	global
}))

class ArticleJump extends Component{
  render(){
    const { global } = this.props;
    const { independentMenusData=[] } = global;
    const rotueData = getMenuData('common');
    const currentRoute = rotueData.filter((item) => {
      return item.code === '000';
    })
    console.log(currentRoute)
    const { children=[] } = currentRoute[0];
    let jumpPath = '';
    children.map((item) => {
      const { path,code } = item;
      const _index = independentMenusData.findIndex((i) => {
        return i.permissionCode === code;
      })
      if(jumpPath == ''){
        jumpPath = path;
      }
      // if(jumpPath == '' && _index !== -1){
      //   jumpPath = path;
      // }
    });

    return <Redirect to={`/common${jumpPath}`} />
  }

}

export default ArticleJump;
