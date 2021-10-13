import React,{ Component } from 'react';
import { 
	Form,
    Button,
    Modal
} from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';

@Form.create()

class ArticleSuperClass extends Component{

    constructor(props){
        super(props)
        this.addModule = null;
        this.state = {
            loading:false,
            searchData:{},
            pageNum:1,
            pageSize:10,
            visible:false,
            drawerType:'',
            onceData:{},
			enterpriseArr:[
				{val:0,label:'烟台中集来福士海洋工程有限公司'},
				{val:1,label:'烟台打捞局船厂'}
			]
        }
    }

    componentDidMount(){
        this.getList();
    }

    //获取列表
    getList = () => {
        const { dispatch } = this.props;
        const { searchData,pageNum,pageSize } = this.state;
		console.log(searchData)
        //this.setState({loading:true});
        // dispatch({
		// 	type:'productAccount/fetchAccountUpdate',
		// 	payload:{...searchData,pageNum,pageSize},
		// 	callback:(res) => {
		// 		this.setState({loading:false});
		// 	}
		// })
    }

    //绑定组件
	onRef = (ref) => {
		this.addModule = ref; 
	}

    //开启维护请求
    maintainRequest = () => {

    }

    //恢复正常请求
    recoveryRequest = () => {

    }

    //搜索
    handleSearch = () => {
        const { form:{validateFields} } = this.props;
        validateFields(['search_code','search_name','search_type','enterprise_type'],(err,values) => {
            const { search_code,search_name,search_type,enterprise_type } = values;
            this.setState({searchData:{code:search_code,name:search_name,type:search_type,enterprise:enterprise_type}},() => {
                this.getList();
            });
        })
    }

    //重置
    handleReset = () => {
		const { form } = this.props;
        this.setState({searchData:{}},() => {
            form.resetFields();
		    this.handleSearch();
        });
	}

    //新增
    handleOk = () => {
        this.addModule.handleSave(() => {
            this.setState({visible:false,drawerType:'',onceData:{}}, () => {
                this.getList();
            })
        })
    }

    //操作提示
    handleTypeTips = (data,type) => {
        const title = type == '1' ? '开启维护后系统将不再正常推送此类内容' : '恢复正常后系统将正常推送此类内容';
        Modal.confirm({
    		title,
    		content: '',
    		className:'selfModal',
    		centered:true,
    		okText: '是',
    		cancelText: '否',
    		onOk:() => {
    			if(type == '1'){
                    this.maintainRequest(data);
                }else{
                    this.recoveryRequest(data);
                }
    		}
  		});
    }

    //搜索部分
	searchModule(){
		const { enterpriseArr } = this.state;
		const searchList = [
			{
				type:'Input',
				id:'search_code',
				domOptions:{placeholder:'大类ID'},
				domStyle:{width:185},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_name',
				domOptions:{placeholder:'大类名称'},
				domStyle:{width:185},
				iconType:'edit'
			},
            {
				type:'Select',
				id:'enterprise_type',
				domOptions:{placeholder:'所属企业'},
				domStyle:{width: 185},
				optionList:enterpriseArr,
				valueName:'val',
				labelName:'label'
			},
            {
				type:'Select',
				id:'search_type',
				domOptions:{placeholder:'维护状态'},
				domStyle:{width: 185},
				optionList:[
					{val:0,label:'正常'},
					{val:1,label:'维护'}
				],
				valueName:'val',
				labelName:'label'
			},
			{
				type:'Button',
				btnTitle:'查询',
				iconType:'search',
				domOptions:{type:"primary",onClick:this.handleSearch}
			},
            {
				type:'Button',
				btnTitle:'重置',
				iconType:'sync',
				domOptions:{onClick:this.handleReset}
			},
			{
				type:'Button',
				btnTitle:'新增大类',
				iconType:'plus',
				domOptions:{onClick:() => this.setState({visible:true})}
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}

    //列表部分
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { superClass={} } = this.props;
		const { listData={} } = superClass;
		const { 
            list=[
                {id:0,main_type_code:'0001111',main_type_name:'阿斯顿发生',enterprise_name:'烟台中集来福士海洋工程有限公司',is_maintained:'1'},
                {id:1,main_type_code:'0001111',main_type_name:'阿斯顿发生',enterprise_name:'烟台打捞局船厂',is_maintained:'2'}
            ],
            total=2
        } = listData;
		let columns = [
			{
				title: '大类ID',
    			key: 'main_type_code',
    			width:'20%',
    			render: text => {
    				let { main_type_code='' } = text;
    				return(
    					<span>{main_type_code}</span>
    				)
    			}
			},
			{
				title: '大类名称',
    			key: 'main_type_name',
    			width:'20%',
    			render: text => {
    				let { main_type_name='' } = text;
    				return(
    					<span>{main_type_name}</span>
    				)
    			}
			},
			{
				title: '所属企业',
    			key: 'enterprise_name',
    			width:'20%',
    			render: text => {
    				let { enterprise_name='' } = text;
    				return(
    					<span>{enterprise_name}</span>
    				)
    			}
			},
            {
				title: '维护状态',
    			key: 'is_maintained',
    			width:'20%',
    			render: text => {
    				let { is_maintained } = text;
    				return(
    					<span>{is_maintained == '1' ? '正常' : '维护'}</span>
    				)
    			}
			},
			{
				title: '操作',
    			key: 'operation',
    			render: text => {
    				let { is_maintained } = text;
    				return(
                        // <Button 
                        //     onClick={() => this.handleTypeTips(text,is_maintained)}
                        // >
                        //     {is_maintained == '1' ? '开启维护' : '恢复正常'}
                        // </Button>
						<Button 
							style={{marginRight:12}}
							onClick={() => this.setState({visible:true,drawerType:'edit',onceData:text})}
						>
							编辑
						</Button>
    				)
    			}
			}
			
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list,
			// rowClassName:(record) => {
			// 	const { status=0 } = record;
			// 	return status === 0 ? styles.rowDisabled : '';
			// }
		}
		
		const pageOptions = {
			totalShow:true,
	  		current: pageNum,
	  		pageSize: pageSize,
	  		onChange: (current, pageSize) => {
	  			this.setState({pageNum:current,pageSize},() => {
      				this.getList();
      			});
	  		},
	  		total
		}
		
		return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />
	}

    //抽屉
	drawerContent(){
		const { visible,drawerType,onceData} = this.state;
		let drawerOptions = {
			content:(<AddModule onRef={this.onRef}
				drawerType={drawerType}
                onceData={onceData}
				{...this.props} 
				/>),
			isOk:true,
			okText:'保存',
			onOk:this.handleOk,
			onCancel:() => this.setState({visible:false,drawerType:'',onceData:{}})
		}
		const titleTxt = drawerType === 'add' ? '新增' : '编辑';
		let drawerProps = {
			title:`文章大类/${titleTxt}`,
	        placement:"right",
	        closable:false,
	        destroyOnClose:true,
	        onClose:() => this.setState({visible:false,drawerType:'',onceData:{}}),
	        visible:visible
		}
		return(
			<DrawerMount  
                drawerProps={drawerProps}
                {...drawerOptions}
            />
		)
	}

    render(){
        return(
            <div style={{width:'100%',overflow:'hidden'}}>
                {this.searchModule()}
                {this.tableModule()}
                {this.drawerContent()}
            </div>
        )
    }
}

export default ArticleSuperClass;