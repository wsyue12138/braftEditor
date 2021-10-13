import React,{ Component,Fragment } from 'react';
import { connect } from 'dva';
import { ConfigProvider,Layout, Menu, Icon, Badge, message } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Link from 'umi/link';
import PropTypes from 'prop-types';
import Store from 'store';
import { getMenuData } from '@common/menu';
import HeaderContent from '@components/HeaderContent/HeaderContent';
import FooterContent from '@components/FooterContent/FooterContent';
import LayoutContent from '@components/LayoutContent';
import styles from './BasicLayout.less';

const { SubMenu } = Menu;
const { Content, Sider } = Layout;

@connect(({
    global
}) => ({
    global
}))

class BasicLayout extends Component{

    constructor(props){
    	super(props)
    	//主页菜单
    	this.menus = getMenuData();
    	this.state = {
    		openKeys:this.getDefaultCollapsedSubMenus(props)
    	}
    }

    //默认打开的菜单
    getDefaultCollapsedSubMenus(props) {
    	const { location:{pathname} } = props;
    	const currentMenuSelectedKeys = [...this.getCurrentMenuSelectedKeys(props)];
        const currentMenuArr = currentMenuSelectedKeys[0].split('/');
        let openKeys = ['/'+currentMenuArr[1]]
        if(currentMenuArr.length > 3){
            openKeys.push('/'+currentMenuArr[1]+'/' + currentMenuArr[2])
        }
    	return openKeys;
    }

    //菜单展开回调
    handleOpenChange = (openKeys) => {
    	const lastOpenKey = openKeys[openKeys.length - 1];
    	const isMainMenu = this.menus.some(
      		item => lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
        );
    	this.setState({
      		openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    	});
    }

    //当前选中的菜单项 key 数组
    getCurrentMenuSelectedKeys(props) {
    	const { location: { pathname } } = props || this.props;
        const keyArr = pathname.split('/');
    	if (keyArr.length > 1) {
    		if(keyArr.length >= 4){
    			return [`/${keyArr[1]}/${keyArr[2]}`];
    		}else{
    			return [pathname];
    		}
    	}else{
    		return '';
    	}
    }

    //点标
    unreadNumNudule(num){
    	const unmStr = num > 99 ? '99+' : num;
    	return unmStr;
    }

    //生成菜单
    getNavMenuItems(menusData, isParent=true) {
    	const { global } = this.props;
		const { onlineServiceCount=0,keepingMessagesCount=0 } = global;
    	const onlineNnm = onlineServiceCount > 99 ? '99+' : onlineServiceCount;
		const messagesNum = keepingMessagesCount > 99 ? '99+' : keepingMessagesCount;
		const allNum = onlineServiceCount + keepingMessagesCount;
    	if (!menusData || !global.menusData) {
      		return '';
    	}
    	return menusData.map((item) => {
      		if (!item.name) {
        		return null;
      		}
      		let _index = global.menusData.findIndex((i) => i.permissionCode === item.code);
      		if((_index < 0 && item.code != 0)){
      			return '';
      		}
      		let itemPath;
      		if (item.path.indexOf('http') === 0) {
        		itemPath = item.path;
      		} else {
        		itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      		}
      		if (!item.isTab && item.children && item.children.some(child => child.name)) {
        		return (
          			<SubMenu
            			title={
              				item.icon ? (
                				<div className={styles.subMenu_once}>
                  					<Icon type={item.icon} />
                  					<span>{item.name}</span>
									{
										item.code === '06000000' && allNum ? (
											<Badge className={styles.manMachineNum} count={allNum > 99 ? '99+' : allNum} />
										) : ''
									}
                				</div>
              				) : item.name
            			}
            			key={item.key || item.path}
          			>
						{this.getNavMenuItems(item.children, false)}
          			</SubMenu>
        		);
      		}
      		const icon = item.icon && <Icon type={item.icon} />;
      		return (
        		<Menu.Item key={item.key || item.path} className={styles['basic-menu-item']}>
          			<Link
          				className={isParent ? styles.otherMenu : 0}
        				to={itemPath}
        				target={item.target}
        				replace={itemPath === this.props.location.pathname}
						style={{position:'relative'}}
      				>
        				{icon}
        				<span>
        					{item.name}
        				</span>
						{
							item.code === '06010000' && keepingMessagesCount ? (
								<Badge className={styles.messagesNum} style={{top:'9px'}} count={messagesNum} />
							) : ''
						}
						{
							item.code === '06020000' && onlineServiceCount ? (
								<Badge className={styles.onlineNnm} style={{top:'9px'}} count={onlineNnm} />
							) : ''
						}
      				</Link>
        		</Menu.Item>
      		);
    	});
    }

    render(){
        const { location,children } = this.props;
        const { openKeys,loadModule,loadUser } = this.state;
        //主页子路由菜单用来生成route
        const layout = (
            <Layout className={styles['basic-layout']}>
                {/**头部**/}
                <HeaderContent />
                {/**侧边栏**/}
                <Layout className={styles['basic-sider-box']}>
                    <Sider
                        collapsible={false}
                        theme='light'
                        breakpoint="md"
                        className={styles['basic-sider']}
                        collapsed={false}
                    >
                        <Menu
                            theme="light"
                            mode="inline"
                            openKeys={openKeys}
                            onOpenChange={this.handleOpenChange}
                            selectedKeys={this.getCurrentMenuSelectedKeys()}
                            className={styles['basic-menu']}
                        >
                            {this.getNavMenuItems(getMenuData())}
                        </Menu>
                    </Sider>
                    <Layout className={styles['content-layout']}>
                        <Content className={styles['basic-content']}>
                            <LayoutContent {...this.props} routeType='basic' routeList={children} />
                            {/**底部信息**/}
                            {/**<FooterContent />**/}
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

export default BasicLayout;
