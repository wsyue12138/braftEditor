import React,{Component} from 'react';
import { connect } from 'dva';
import { 
	Form,
	Row,
	Col
} from 'antd';
import styles from './style.less';

@connect(({
	accountManagement
}) => ({
	accountManagement
}))

@Form.create()

class RolePermissionsDetail extends Component{
	
	state = {
		permissionList:[]
	}
	
	componentWillMount(){
		this.permissionList = [];
	}
	
	componentDidMount(){
		const { dispatch,accountManagement } = this.props;
		const { onceJurisdictData:{userPermissionVos} } = accountManagement;
		dispatch({
			type:'accountManagement/setPermissionDescription',
			payload:{userPermissionVos}
		})	
	}
	
	componentWillUnmount(){
		const { dispatch } = this.props;
		dispatch({
			type:'accountManagement/setOnceJurisdictData',
			payload:{onceData:{}}
		})	
	}
	
	//产品名称处理
	setProductName = (data) => {
		let str = '';
		data.map((item,index) => {
			const { productName='' } = item;
			if(index !== 0){
				str += `/${productName}`;
			}else{
				str += productName;
			}
		})
		return str;
	}
	
	
	render(){
		const { form:{getFieldDecorator},accountManagement } = this.props;
		const { onceJurisdictData={},permissionList=[] } = accountManagement;
		const { productionVos=[],roleName='',description='' } = onceJurisdictData;
		return(
			<div className={styles.rolePermissionsDetailBox}>
				<Row>
					<Form layout="inline" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
						<Col>
					        <Form.Item label="产品名称">
					          	{getFieldDecorator('productName')(
					           		<div className={styles.contentTxt}>
					           			{this.setProductName(productionVos)}
					           		</div>
					          	)}
					        </Form.Item>
				        </Col>
				        <Col>
					        <Form.Item label="角色名称">
					          	{getFieldDecorator('roleName')(
					            	<div className={styles.contentTxt}>{roleName}</div>
					          	)}
					        </Form.Item>
					    </Col>    
					    <Col>
					        <Form.Item label="角色描述">
					          	{getFieldDecorator('roleDescription')(
					            	<div className={styles.contentTxt}>{description}</div>
					          	)}
					        </Form.Item>
				        </Col>
				        <Col>
					        <Form.Item label="权限说明">
					          	{getFieldDecorator('authorityDescription')(
					            	<div 
					            		className={styles.contentTxt}
					            		style={{minHeight:115}}
					            	>
					            		<ul>
					            			{
					            				permissionList.map((item,index) => {
					            					const { permissionName='',permission='' } = item;
					            					return(
					            						<li key={index}>
					            							{`${permissionName} : ${permission}`}
					            						</li>
					            					)
					            				})
					            			}
					            		</ul>
					            	</div>
					          	)}
					        </Form.Item>
				        </Col>
				    </Form>
			    </Row>
			</div>
		)
	}
}

export default RolePermissionsDetail;