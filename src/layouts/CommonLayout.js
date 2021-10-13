import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Link from 'umi/link';
import { Layout, Menu, Icon, Badge, Tabs, message } from 'antd';
import { getMenuData } from '@common/menu';
import LayoutContent from '@components/LayoutContent';
import HeaderContent from '@components/HeaderContent/HeaderContent';
import styles from './CommonLayout.less';

const { Content, Sider } = Layout;

@connect(({
    global
}) => ({
    global
}))

class CommonLayout extends Component{

    constructor(props){
    	super(props)
    	//主页菜单
    	this.state = {

    	}
    }

    //设置当前菜单
    setCurrentMenus = (path) => {
    	const { hash } = window.location;
    	const _index = hash.indexOf(path);
    	return _index;
    }

    //侧边栏
    getNavMenuItems(){
    	const { global } = this.props;
    	const { independentMenusData=[] } = global;
    	const menusData = getMenuData('common');
    	return(
    		<div className={styles.menusBox}>
    			{
    				menusData.map((item,index) => {
    					const { name,path,icon,target,code } = item;
    					const itemPath = '/common' + path;
    					const iconDom = icon && <Icon type={icon} />;
    					const isCurrentMenus = this.setCurrentMenus(itemPath);
    					const boxClass = isCurrentMenus !== -1 ? styles.clicked : '';
    					const isHas = independentMenusData.some((item) => {
    						return item.permissionCode === code;
    					});

    					return(
    						<Fragment key={path}>
    							{
    								code === '0' || code === '000' || isHas ? (
    									<div className={`${styles.menusOnce} ${boxClass}`}>
    										<Link
                          className={styles.otherMenu}
    					        				to={itemPath}
    					        				target={target}
    					        				replace={itemPath === this.props.location.pathname}
    					      			>
    					        				<span className={`${styles.menuIcon} ${styles[icon]}`}></span>
    					        				<span className={styles.menusName}>
    					        					{name}
    					        				</span>
    					        				<span className={styles.occlusion}></span>
    					      				</Link>
    					      				{isCurrentMenus !== -1 ? (<span className={styles.currentSign}></span>) : ''}
    									</div>
    								) : ''
    							}
    						</Fragment>
    					)
    				})
    			}
    		</div>
    	)
    }

    render(){
        const { children } = this.props;
        //主页子路由菜单用来生成route
        const layout = (
            <Layout className={styles['basic-layout']}>
                {/**头部**/}
                <HeaderContent type="common" />
                {/**侧边栏**/}
                <Layout className={styles['basic-sider-box']}>
                    <Sider
                        collapsible={false}
                        theme='light'
                        breakpoint="md"
                        className={styles['basic-sider']}
                        collapsed={false}
                    >
                        {this.getNavMenuItems()}
                    </Sider>
                    <Layout className={styles['content-layout']}>
                        <Content className={styles['basic-content']}>
                             <LayoutContent {...this.props} routeType='common' routeList={children} />
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        )

        return(
            <ConfigProvider locale={zhCN} style={{height:'100%'}}>
                <div style={{height:'100%'}}>
                    {layout}
                </div>
            </ConfigProvider>
        )
    }
}

export default CommonLayout;
