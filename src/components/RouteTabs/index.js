import React,{ Component } from 'react';
import { Tabs } from 'antd';
import router from 'umi/router';
import styles from './style.less';

const { TabPane } = Tabs;

const RouteTabs = (props) => {

    const { global,location,route,type='' } = props;
    const { independentMenusData=[],menusData=[] } = global;
    const { pathname='' } = location;
    const { routes=[] } = route;
    const callback = (key) => {
        router.push(key);
    }
    return(
        <div className={styles.basicTab}>
            <Tabs onChange={callback} activeKey={pathname}>
                {
                    routes.map((item,index) => {
                      const { name='',path,code='' } = item;
                      const menus = type === 'common' ? independentMenusData : menusData;
                      const _index = menus.findIndex((item) => item.permissionCode === code);
                      const isArticle = path && path.indexOf('article');
                      if(path && _index !== -1){
                        return <TabPane tab={name} key={path}></TabPane>
                      }else
                      if(isArticle !== -1 && path !== '/common/article'){
                        return <TabPane tab={name} key={path}></TabPane>
                      }else{
                        return ''
                      }
                      // return (path && _index !== -1) || code === '000' ? <TabPane tab={name} key={path}></TabPane> : ''
                    })
                }
            </Tabs>
        </div>
    )
}

export default RouteTabs;
