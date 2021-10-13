import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { Form, Button, Popover,Tree, Icon } from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';
import styles from './category.less';

const { TreeNode } = Tree;

@connect(state => ({
    msg: { ...state.category }
}))

@Form.create()

class Category extends Component {

    state = {
    	loading:false,
        visible: false,
        sideInputArr: [],
        requestData: {},
        describeArr: [],
        roleNamebeArr: [],
        pageNum: 1
    }

    componentDidMount() {
        this.getList()
    }
    
    getList = () => {
        const { dispatch } = this.props;
        this.setState({loading:true});
        dispatch({
            type: 'category/getCategoryPage',
            payload: {
                "pageNum": this.state.pageNum,
                "pageSize": 9,
                ...this.state.requestData
            },
            callback:(res) => {
            	this.setState({loading:false});
            }
        })
    }
    
    // 置空搜索条件
    resetRequestData = () => {
    	const { form:{resetFields} } = this.props;
        this.setState({ requestData: {}, pageNum: 1 }, () => {
        	this.getList()
        	resetFields();
        })
    }
    
    // 搜索（查询按钮触发）
    searchValue = (data) => {
    	const { form:{validateFields} } = this.props;
    	validateFields(['search_startCode','search_categoryName','search_sCategoryName'],(err, values) => {
    		const { search_startCode,search_categoryName,search_sCategoryName } = values;
    		const requestData = {
    			startCode:search_startCode,
    			categoryName:search_categoryName,
    			sCategoryName:search_sCategoryName
    		}
    		this.setState({ requestData, pageNum: 1 }, () => this.getList());
    	})   
    }

    onRef = (ref) => {
        this.child = ref
    }
    
    handleSave = () => {
        this.child.handleSave(() => {
            this.setState({visible:false,onceData:{},drawerType:''},() => {
                this.getList();
            });
        })
    }

    handleClose = () => {
        this.setState({visible:false,onceData:{},drawerType:''});
    }
    
    searchModule(){
    	const searchList = [
        	{
				type:'Input',
				id:'search_startCode',
				domOptions:{placeholder:'类目组编码'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_categoryName',
				domOptions:{placeholder:'类目组名称'},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_sCategoryName',
				domOptions:{placeholder:'业务类目'},
				iconType:'edit'
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.searchValue}
			},
			{
				type:'Button',
				btnTitle:'重置',
				iconType:'sync',
				domOptions:{onClick:this.resetRequestData}
			},
			{
				type:'Button',
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:() => this.setState({visible: true,drawerType:'add',onceData:{}})}
			}
        ]
    	return <SearchForm {...this.props} searchList={searchList} />
    }

    setCategoryTree = (data) => {
        const mapList = (list) => {
            return(
                <Fragment>
                    {
                        list.map((item) => {
                            const { children=[] } = item;
                            return(
                                <TreeNode 
                                    title={item.categoryName} 
                                    key={item.categoryCode}
                                >
                                    {
                                       children.length && mapList(children)
                                    }
                                </TreeNode>
                            )
                        })
                    }
                </Fragment>
            )   
        }
        return (
            <div style={{minWidth:'150px',maxHeight:'300px',padding:'12px',overflow:'auto'}}>
                <Tree
                    defaultExpandAll
                    switcherIcon={<Icon type="down" />}
                >
                    {mapList(data)}
                </Tree>
            </div>
        )
    }
	
	tableModule(){
		const { loading } = this.state;
		const { ProductionCatagoryList={} } = this.props.msg;
		const { list=[], total=0, pageNum, pageSize } = ProductionCatagoryList;
		const columns = [
            { title: '类目组编码', dataIndex: 'categoryCode', key: 'categoryCode', ellipsis: true, width: '15%' },
            { title: '类目组名称', dataIndex: 'categoryName', key: 'categoryName', ellipsis: true, width: '15%' },
            {
                title: '业务类目', dataIndex: 'childList', key: 'childList', width: '50%',
                render: (text, record, index) => {
                    return (
                        <Popover
                            key={`popover${index}`}
                            placement="bottomLeft"
                            overlayClassName={styles.categoryPopover}
                            content={<div className={styles.CatagoryVosPopover}>
                                {this.setCategoryTree(text)}
                            </div>}
                        >
                            <div className={styles.CatagoryVos} >
                                <div className={styles.CatagoryVosItem_father} >
                                    {text.map(
                                        (item, index) => <div
                                            key={`fa_${index}`}
                                            className={item.children ? styles.CatagoryVosItemHave : styles.CatagoryVosItem}
                                        >
                                            {index < 10 ? item.categoryName : (index == 10 ? '…' : '')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Popover>
                    )
                }
            },
            {
                title: '操作', dataIndex: 'operation', ellipsis: true, width: '20%',
                render: (text, record, index) => {
                    return (
                        <div>
                            <Button 
                                className='btn' 
                                onClick={() => this.setState({visible: true,drawerType:'edit',onceData:record})}
                            >
                                编辑
                            </Button>
                        </div>
                    )
                }
            }
        ]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			dataSource:list,
			columns
		}	
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: 9,
	  		onChange: (pageNum) => {
                this.setState({ pageNum }, () => { this.getList() })
            },
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}

    //抽屉
	drawerModule(){
        const { dispatch } = this.props;
		const { visible,drawerType,onceData } = this.state;
		let drawerOptions;
		drawerOptions = {
            content:(<AddModule onRef={this.onRef} onceData={onceData} drawerType={drawerType} dispatch={dispatch} />),
            onCancel:this.handleClose,
            okText:'保存',
            onOk:this.handleSave,
        }
        const titleName = drawerType === 'add' ? '新增' : '编辑';
		let drawerProps = {
			title:`产品类目管理/${titleName}`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:this.handleClose,
	        visible
		}
		return(
			<DrawerMount  
				drawerProps={drawerProps}
				{...drawerOptions}
			/>
		)
	}
	
    render() {
        const { visible, businessArr,operateType } = this.state;
        return (
            <div style={{width:'100%'}}>
               	{this.searchModule()}
               	{this.tableModule()}
                {this.drawerModule()}
            </div>
        )
    }
}

export default Category;