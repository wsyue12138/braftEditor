import React,{ Component } from 'react';
import { connect } from 'dva';
import styles from './UserLayout.less';

@connect(({
    global
}) => ({
    global
}))

class UserLayout extends Component{

    render(){
        return(
            <div className={styles.box}>
                { this.props.children }
            </div>
        )
    }
}

export default UserLayout;
