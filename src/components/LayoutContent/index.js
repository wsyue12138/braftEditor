import React,{ Component,Fragment } from 'react';
import { Layout, Tabs } from 'antd';
import Redirect from 'umi/redirect';
import { getMenuData } from '@common/menu';
import styles from './style.less';

const { Content } = Layout;
const { TabPane } = Tabs;

export default function LayoutContent(props){
	const { routeType,routeList=[],route,location } = props;
  const { pathname } = location;
  let currentTitle = '';
  const setTitle = (data) => {
    data.map((item,index) => {
      const { routes=[],path='',title='' } = item;
      if(path === pathname){
        currentTitle = title;
      }else{
        if(routes.length){
          setTitle(routes)
        }
      }
    })
  }
  setTitle(route.routes);
	return(
		<Fragment>
			{
				currentTitle != '' ? (
					<div className={styles.contentTitle}>
						<div className={styles.sign}>
							<span></span>
						</div>
						<div className={styles['basic-titleName']}>{currentTitle}</div>
					</div>
				) : ''
			}
			<div className={styles['content']} >
              	{routeList}
            </div>
        </Fragment>
	)
}
