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

class ArticleRunlog extends Component{

    constructor(props){
        super(props)
        this.addModule = null;
        this.state = {
            loading:false,
            searchData:{},
            pageNum:1,
            pageSize:10,
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
        validateFields(['search_date','search_code','search_name','operate_type','data_type','data_id','data_name'],(err,values) => {
            const { search_date,search_code,search_name,operate_type,data_type,data_id,data_name } = values;
            this.setState({searchData:{searchDate:search_date,code:search_code,name:search_name,operateType:operate_type,dataType:data_type,dataId:data_id,dataName:data_name}},() => {
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
				type:'RangePicker',
				id:'search_date',
				domOptions:{format:'YYYY-MM-DD HH:mm:ss',placeholder:'操作时间',showTime:{ format: 'HH:mm:ss' }},
				domStyle:{width: 330}
			},
			{
				type:'Input',
				id:'search_code',
				domOptions:{placeholder:'操作人工号'},
				domStyle:{width:135},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_name',
				domOptions:{placeholder:'操作人姓名'},
				domStyle:{width:135},
				iconType:'edit'
			},
            {
				type:'Select',
				id:'operate_type',
				domOptions:{placeholder:'操作类型'},
				domStyle:{width:135},
				optionList:[
					{val:0,label:'新增'},
					{val:1,label:'修改'},
					{val:2,label:'删除'}
				],
				valueName:'val',
				labelName:'label'
			},
            {
				type:'Select',
				id:'data_type',
				domOptions:{placeholder:'数据类型'},
				domStyle:{width:135},
				optionList:[
					{val:0,label:'文章'},
					{val:1,label:'文章小类'},
					{val:2,label:'文章标签'}
				],
				valueName:'val',
				labelName:'label'
			},
			{
				type:'Input',
				id:'data_id',
				domOptions:{placeholder:'数据ID'},
				domStyle:{width:135},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'data_name',
				domOptions:{placeholder:'数据名'},
				domStyle:{width:135},
				iconType:'edit'
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
                {id:0,operate_date:'2021-01-01 12:12:55',operate_code:'000001',operate_name:'李雷雷',operate_type:0,data_type:2,data_id:'176829850293761452',data_name:'科学家假设：如果人类不吃肉至少节1科学家假设：如果人类不吃肉至少节1科学家假设：如果人类不吃肉至少节1'},
                {id:1,operate_date:'2021-01-02 12:12:55',operate_code:'000002',operate_name:'韩梅梅',operate_type:1,data_type:1,data_id:'276829850293761452',data_name:'科学家假设：如果人类不吃肉至少节2'},
                {id:2,operate_date:'2021-01-03 12:12:55',operate_code:'000003',operate_name:'田丹丹',operate_type:2,data_type:0,data_id:'376829850293761452',data_name:'科学家假设：如果人类不吃肉至少节3'}
            ],
            total=3
        } = listData;
		let columns = [
			{
				title: '操作时间',
    			key: 'operate_date',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { operate_date='' } = text;
    				return(
    					<span>{operate_date}</span>
    				)
    			}
			},
			{
				title: '操作人工号',
    			key: 'operate_code',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { operate_code='' } = text;
    				return(
    					<span>{operate_code}</span>
    				)
    			}
			},
			{
				title: '操作人姓名',
    			key: 'operate_name',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { operate_name='' } = text;
    				return(
    					<span>{operate_name}</span>
    				)
    			}
			},
            {
				title: '操作类型',
    			key: 'operate_type',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { operate_type } = text;
    				return(
						<>
							{
								this.operateType(operate_type)
							}
						</>
    				)
    			}
			},
            {
				title: '数据类型',
    			key: 'data_type',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { data_type } = text;
    				return(
						<>
							{
								this.dataType(data_type)
							}
						</>
    				)
    			}
			},
			{
				title: '数据ID',
    			key: 'data_id',
    			width:'13%',
                ellipsis: true,
    			render: text => {
    				let { data_id='' } = text;
    				return(
    					<span>{data_id}</span>
    				)
    			}
			},
			{
				title: '数据名',
    			key: 'data_name',
    			width:'13%',
    			render: text => {
    				let { data_name='' } = text;
    				return(
    					<span style={{'WebkitBoxOrient':'vertical','overflow':'hidden','textOverflow':'ellipsis','display':'-webkit-box','WebkitLineClamp':'2'}} title={data_name}>{data_name}</span>
    				)
    			}
			},
			
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
	//操作类型
	operateType = (type) => {
        switch (type) {
		case 0:
			return <span >新增</span>
			break;
        case 1:
            return <span >修改</span>
            break;
        case 2:
            return <span >删除</span>
            break;
        default:
            break;
        }
    }
	//数据类型
	dataType = (type) => {
        switch (type) {
		case 0:
			return <span >文章</span>
			break;
        case 1:
            return <span >文章小类</span>
            break;
        case 2:
            return <span >文章标签</span>
            break;
        default:
            break;
        }
    }
  
    render(){
        return(
            <div style={{width:'100%',overflow:'hidden'}}>
                {this.searchModule()}
                {this.tableModule()}
            </div>
        )
    }
}

export default ArticleRunlog;