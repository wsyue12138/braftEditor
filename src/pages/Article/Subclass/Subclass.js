import React,{ Component,Fragment } from 'react';
import { 
	Form,
    Button,
    Modal,
    message
} from 'antd';
import TableContent from '@components/TableContent';
import SearchForm from '@components/SearchForm';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';

@Form.create()

class ArticleSubclass extends Component{

    constructor(props){
        super(props)
        this.addModule = null;
        this.isSubmit = true;
        this.state = {
            loading:false,
            searchData:{},
            pageNum:1,
            pageSize:10,
            visible:false,
            drawerType:'',
            onceData:{}
        }
    }

    componentDidMount(){
        this.getList();
    }

    //获取列表
    getList = () => {
        const { dispatch } = this.props;
        const { searchData } = this.state;
        //this.setState({loading:true});
        // dispatch({
		// 	type:'productAccount/fetchAccountUpdate',
		// 	payload:{...searchData,pageNum,pageSize},
		// 	callback:(res) => {
        //      this.setState({loading:false});
		// 	}
		// })
    }

    //绑定组件
	onRef = (ref) => {
		this.addModule = ref; 
	}

    //删除请求
    deleteRequest = (data) => {
        const { dispatch } = this.props;
        const { ass_sub_type_code } = data;
        //this.isSubmit = false;
        // dispatch({
		// 	type:'productAccount/fetchAccountUpdate',
		// 	payload:{code:ass_sub_type_code},
		// 	callback:(res) => {
		// 		let { success } = res;
		// 		if(success){
        //          message.success('删除成功');
		// 			this.getList();
		// 		}else{
		// 			message.error('删除失败,请稍后再试');
		// 		}
		// 		this.isSubmit = true;
		// 	}
		// })
    }

    //搜索
    handleSearch = () => {
        const { form:{validateFields} } = this.props;
        validateFields(['search_code','search_name','search_maintype'],(err,values) => {
            const { search_code,search_name,search_maintype } = values;
            this.setState({searchData:{code:search_code,name:search_name,maintype:search_maintype}},() => {
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

    //删除操作提示
    handleTips = (data) => {
        if(this.isSubmit){
            Modal.confirm({
                title:'是否确认删除该小类?',
                content: '',
                className:'selfModal',
                centered:true,
                okText: '是',
                cancelText: '否',
                onOk:() => {
                    this.deleteRequest(data);
                }
            });
        }
    }


    //搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_code',
				domOptions:{placeholder:'小类ID'},
				domStyle:{width:185},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_name',
				domOptions:{placeholder:'小类名称'},
				domStyle:{width:185},
				iconType:'edit'
			},
            {
				type:'Select',
				id:'search_maintype',
				domOptions:{placeholder:'所属大类'},
				domStyle:{width: 185},
				optionList:[],
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
				btnTitle:'新增',
				iconType:'plus',
				domOptions:{onClick:() => this.setState({visible:true,drawerType:'add'})}
			}
		]
		
		return <SearchForm {...this.props} searchList={searchList} />
	}

    //列表部分
	tableModule(){
		const { loading,pageNum,pageSize } = this.state;
		const { Subclass={} } = this.props;
		const { listData={} } = Subclass;
		const { 
            list=[
                {id:0,ass_sub_type_code:'0001111',ass_sub_type_name:'阿斯顿发生',main:'水电费水电费'},
                {id:1,ass_sub_type_code:'0001111',ass_sub_type_name:'阿斯顿发生',main:'大范甘迪发'}
            ],
            total=2
        } = listData;
		let columns = [
			{
				title: '小类ID',
    			key: 'ass_sub_type_code',
    			width:'27%',
    			render: text => {
    				let { ass_sub_type_code='' } = text;
    				return(
    					<span>{ass_sub_type_code}</span>
    				)
    			}
			},
			{
				title: '小类名称',
    			key: 'ass_sub_type_name',
    			width:'27%',
    			render: text => {
    				let { ass_sub_type_name='' } = text;
    				return(
    					<span>{ass_sub_type_name}</span>
    				)
    			}
			},
            {
				title: '所属大类',
    			key: 'main',
    			width:'27%',
    			render: text => {
    				let { main } = text;
    				return(
    					<span>{main}</span>
    				)
    			}
			},
			{
				title: '操作',
    			key: 'operation',
    			render: text => {
    				return(
                        <Fragment>
                            <Button 
                                style={{marginRight:12}}
                                onClick={() => this.setState({visible:true,drawerType:'edit',onceData:text})}
                            >
                                编辑
                            </Button>
                            <Button type="danger" ghost onClick={() => this.handleTips(text)}>删除</Button>
                        </Fragment>    
                        
    				)
    			}
			}
			
		]
		
		const tableOptions = {
			onceKey:'id',
			loading, 
			columns,
			dataSource:list
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
		const { visible,drawerType,onceData } = this.state;
		let drawerOptions = {
			content:(<AddModule 
                onRef={this.onRef} 
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
			title:`文章小类/${titleTxt}`,
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

export default ArticleSubclass;