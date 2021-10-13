import React,{ Component,Fragment } from 'react';
import { 
	Form,
    Button,
    Modal,
    message
} from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import ImgModal from '@components/ImgModal';
import AddModule from './components/AddModule';
import styles from './Icon.less';

@Form.create()

class AppletsIcon extends Component{

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
            onceData:{},
			previewVisible:false,
			previewImage:''
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
		// 		this.setState({loading:false});
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
        const { id } = data;
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
		// })
    }

    //搜索
    handleSearch = () => {
        const { form:{validateFields} } = this.props;
        validateFields(['search_id','search_name','search_status'],(err,values) => {
            const { search_id,search_name,search_status,search_date } = values;
			const obj = {
				id:search_id,
				name:search_name,
				status:search_status
			}
			console.log(obj)
            this.setState({searchData:obj},() => {
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

    //删除操作提示
    handleTips = (data) => {
        if(this.isSubmit){
            Modal.confirm({
                title:'删除后数据无法恢复，是否确认删除?',
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

    //查看banner图
	openBanner = (previewImage) => {
		this.setState({previewVisible:true,previewImage});
	}

    //保存
    handleOk = () => {
        this.addModule.handleSave(() => {
            this.setState({visible:false,drawerType:'',onceData:{}}, () => {
                this.getList();
            })
        })
    }

    //搜索部分
	searchModule(){
		const searchList = [
			{
				type:'Input',
				id:'search_id',
				domOptions:{placeholder:'iconID'},
				domStyle:{width:165},
				iconType:'edit'
			},
			{
				type:'Input',
				id:'search_name',
				domOptions:{placeholder:'icon名称'},
				domStyle:{width:165},
				iconType:'edit'
			},
			{
				type:'Select',
				id:'search_status',
				domOptions:{placeholder:'icon状态'},
				domStyle:{width: 165},
				optionList:[{val:0,label:'上架'},{val:1,label:'下架'}],
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
		const { articleLabel={} } = this.props;
		const { listData={} } = articleLabel;
		const { 
            list=[
                {id:0,name:'阿尔兹',status:0,picture:'https://7niu-article.galaxyeye-tech.com/img/article/200413/1249580655679901696.png',jump_appid:'是否水电费',jump_link:'www.baidu.com',jump_type:0,order:123},
                {id:1,name:'阿尔兹海',status:1,picture:'https://7niu-article.galaxyeye-tech.com/img/article/200413/1249580549433987072.png',jump_appid:'是否水电费',jump_link:'www.baidu.com',jump_type:1,order:122},
				{id:2,name:'阿尔兹海默',status:0,picture:'https://7niu-article.galaxyeye-tech.com/img/article/200316/1239468227180892160.png',jump_appid:'是否水电费',jump_link:'www.baidu.com',jump_type:2,order:125}
            ],
            total=2
        } = listData;
		let columns = [
			{
				title: 'iconID',
    			key: 'id',
    			width:'16%',
    			render: text => {
    				let { id='' } = text;
    				return(
    					<span>{id}</span>
    				)
    			}
			},
			{
				title: 'icon名称',
    			key: 'name',
    			width:'18%',
    			render: text => {
    				let { name='' } = text;
    				return(
    					<span>{name}</span>
    				)
    			}
			},
			{
				title: 'icon图',
    			key: 'picture',
                width:'16%',
    			render: text => {
    				let { picture } = text;
    				return(
    					<div 
                            className={styles.bannerImg}
                            title='点击查看icon图'
							style={{ backgroundImage: 'url(' + picture + ')' }}
							onClick={() => this.openBanner(picture)}
                        >
						</div>
    				)
    			}
			},
            {
				title: 'icon状态',
    			key: 'status',
    			width:'16%',
    			render: text => {
    				let { status } = text;
    				return(
    					<span>{status ? '下架' : '上架'}</span>
    				)
    			}
			},
			{
				title: 'icon显示顺序',
    			key: 'order',
    			width:'16%',
    			render: text => {
    				let { order } = text;
    				return(
    					<span>{order}</span>
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
			title:`icon管理/${titleTxt}`,
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

        const { previewVisible,previewImage } = this.state;
        return(
            <div className={styles.iconBox}>
                {this.searchModule()}
                {this.tableModule()}
                {this.drawerContent()}
                <ImgModal 
					visible={previewVisible}
					previewImage={previewImage}
					onCancel={() => this.setState({previewVisible:false,previewImage:''})}
				/>
            </div>
        )
    }
}

export default AppletsIcon;