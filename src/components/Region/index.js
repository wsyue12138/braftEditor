import React,{ Component,Fragment } from 'react';
import { Input, Cascader } from 'antd';

class RegionModule extends Component{

    constructor(props){
        super(props)
        const { region,initStatus='add',regionType } = props;
        const { regionData=[] } = region;
        this.state = {
            status:initStatus === 'add',
            options:regionType ? [] : regionData,
            value:undefined
        }
    }

    componentDidMount(){
        const { region,onRegionRef,regionType } = this.props;
        const { regionData=[] } = region;
        onRegionRef && onRegionRef(this);
        if(regionType){
            this.getSearchList();
        }else{
            if(!regionData.length){
                this.getList();
            }
        }
    }

    //添加、编辑获取列表
    getList = (parentRegionCode,callback) => {
        const { dispatch } = this.props;
        dispatch({
			type:'region/fetchGetRegionByParentCode',
			payload:{parentRegionCode},
			callback:(res) => {
                const { success } = res;
                const { data=[] } = res.data;
                if(success && !parentRegionCode){
                    const regionData = this.fillerData(data);
                    this.setState({options:regionData},() => {
                        this.setRegionData(regionData);
                    })
                }
				callback && callback(data);
			}
		})
    } 

    //搜索获取列表
    getSearchList = () =>{
        const { dispatch,regionType,global } = this.props;
        const { productionId } = global;
        dispatch({
			type:'region/fetchGetRegionTree',
			payload:{regionType,productionId},
			callback:(res) => {
                const { success } = res;
                const { data=[] } = res.data;
                this.setState({options:data});
			}
		})
    }

    //数据处理
    fillerData = (arr) => {
        let regionData = [];
        arr.map((item,index) => {
            const { regionLevel,regionCode='' } = item;
            const obj = JSON.parse(JSON.stringify(item));
            if(regionLevel !== 5 && regionCode !== '000000000000'){
                obj.isLeaf = false;
            }
            regionData.push(obj);
        })
        return regionData;
    }

    //设置地区数据
    setRegionData = (regionData) => {
        const { dispatch } = this.props;
        dispatch({
            type:'region/setRegionByParentCode',
            payload:{regionData}
        })
    }

    loadData = selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        const { regionCode,children=[] } = targetOption;
        targetOption.loading = true;
        // load options lazily
        this.getList(regionCode,(data) => {
            const regionData = this.fillerData(data);
            targetOption.children = regionData;
            this.setState({options:[...this.state.options]},() => {
                this.setRegionData([...this.state.options]);
                targetOption.loading = false;
            })
        });
    };

    handleChangeInput = () => {
        const { id } = this.props;
        this.setState({status:true},() => {
            const region = document.getElementById(id);
            region.click();
        });
    }

    onChange = (value=[], selectedOptions) => {
        const { onChange } = this.props;
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if(targetOption){
            targetOption.value = value;
        }
        this.setState({value});
        onChange(targetOption)
    }

    clearValue = () => {
        this.setState({value:undefined});
    }

	displayRender = (label) => {
		return label[label.length - 1];
    }
    
    onPopupVisibleChange = (val) => {
        const { initStatus='add' } = this.props;
        const { value } = this.state;
        if(initStatus !== 'add' && !val && !value){
            this.setState({status:false});
        }
    }

    render(){
        const { status,options,value } = this.state;
        const { initInputVal,id='region',placeholder,regionType,region } = this.props;
        const { searchRegionData=[] } = region;
        return(
            <Fragment>
                {
                    status ? (
                        <Cascader
                            id={id}
                            placeholder={placeholder ? placeholder : '请选择地区'}
                            options={regionType ? searchRegionData : options}
                            value={value}
                            loadData={this.loadData}
                            fieldNames={{label: 'regionShortName', value: 'regionCode', children: 'children'}}
                            displayRender={this.displayRender}
                            onChange={this.onChange}
                            onPopupVisibleChange={this.onPopupVisibleChange}
                            changeOnSelect 
                        />
                    ) : (
                        <Input placeholder="请选择地区" onClick={this.handleChangeInput} value={initInputVal} />
                    ) 
                }
            </Fragment>
            
        )
    }
} 

export default RegionModule;