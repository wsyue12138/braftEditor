import React, { Component } from 'react';
import { Form,Input,Icon,message } from 'antd';
import styles from './style.less';

@Form.create()

class CategoryAdd extends Component {

    constructor(props){
        super(props)
        this.categoryFromList = [];
        this.timer = null;
        this.sign = 0;
        this.isRepeat = true;
        this.isSubmit = true;
        this.state = {
            categoryList:[{sign:0}]
        }
    }

    componentDidMount(){
        const { drawerType } = this.props;
        this.props.onRef(this);
        if(drawerType === 'edit'){
            this.init();
        }
    }

    //编辑初始化
    init = () => {
        const { onceData } = this.props;
        const { childList } = onceData;
        this.setState({categoryList:childList});
    }

    //保存请求
    saveRequest = (payload,callback) => {
        const { dispatch,drawerType,onceData } = this.props;
        if(drawerType === 'edit'){
            payload.id = onceData.id;
            const obj = JSON.parse(JSON.stringify(payload));
            if(onceData.categoryName.trim() === obj.categoryName.trim()){
                delete payload.categoryName;
            }
        }
        dispatch({
            type: `category/${drawerType === 'add' ? 'addCategory' : 'updateCategory'}`,
            payload,
            callback: (res) => {
                if (res.success) {
                    message.success('保存成功');
                    callback();
                } else {
                    this.isSubmit = true;
                    if(res.code === 11018){
                        message.error('类目组编码已存在');
                    }else{  
                        message.error('保存失败');
                    }
                    
                }
            }
        })
    }

    //保存操作
    handleSave = (callback) => {
        const { form:{validateFields},drawerType } = this.props;
        const { categoryList } = this.state;
        const arr = [...this.categoryFromList,'categoryName'];
        if(drawerType === 'add'){
            arr.push('categoryCode');
        }
        if(this.isSubmit){
            this.isSubmit = false;
            validateFields(arr,(err, values) => {
                if(!err){
                    const { categoryCode,categoryName } = values;
                    this.categoryListValidator();
                    if(this.isRepeat){
                        const obj = {
                            categoryCode,
                            categoryName,
                            children:categoryList
                        }
                        this.saveRequest(obj,callback)
                    }else{
                        this.isSubmit = true;
                    }
                }else{
                    this.isSubmit = true;
                }
            })
        }
    }

    categoryCodeValidator = (rule, value, callback) => {
        let reg = /^\d{8}$/
        if (!reg.test(value)) {
            callback('类目组编码格式为八位数,前缀：01-99，后缀000000')
        } else if ( !Number(value) || Number(value)%1000000 ) {
            callback('类目组编码前缀：01-99，后缀000000')
        }
        callback()
    }

    //业务类目比对
    categoryListValidator = () => {
        const { categoryList } = this.state;
        this.setRepeat('first',categoryList);
        this.isRepeat = true;
        categoryList.map((item) => {
            const { children=[] } = item;
            if(children.length){
                this.setRepeat('second',children);
                children.map((i) => {
                    if(i.children && i.children.length){
                        this.setRepeat('third',i.children);
                    }
                })
            }
        })
    }

    //是否重名
    setRepeat = (type,arr) => {
        const { form:{setFields} } = this.props;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i].categoryName === arr[j].categoryName) {
                    this.isRepeat = false;
                    const _key = arr[j].categoryCode || arr[j].sign;
                    setFields({
                        [`category_${_key}`]: {
                            value:arr[j].categoryName,
                            errors: [new Error('类目不可重复')],
                        }
                    });
                }
            }
        }
    }

    //添加业务类目
    handleAddInput = (type,firstIndex,secondIndex) => {
        const { categoryList } = this.state;
        const newList = JSON.parse(JSON.stringify(categoryList));
        this.sign ++;
        if(type === 'first'){
            newList.push({sign:this.sign});
        }else
        if(type === 'second'){
            let { children=[] } = newList[firstIndex];
            newList[firstIndex].children = children;
            newList[firstIndex].children.push({sign:this.sign});
        }else{
            let { children=[] } = newList[firstIndex].children[secondIndex];
            newList[firstIndex].children[secondIndex].children = children;
            newList[firstIndex].children[secondIndex].children.push({sign:this.sign});
        }
        this.setState({categoryList:newList});
    }

    //删除业务类目
    handleRemoveInput = (type,firstIndex,secondIndex,thirdIndex) => {
        const { form:{resetFields} } = this.props;
        const { categoryList } = this.state;
        const newList = JSON.parse(JSON.stringify(categoryList));
        if(type === 'first'){
            newList.splice(firstIndex,1);
        }else
        if(type === 'second'){
            let { children=[] } = newList[firstIndex];
            newList[firstIndex].children = children;
            newList[firstIndex].children.splice(secondIndex,1);
        }else{
            let { children=[] } = newList[firstIndex].children[secondIndex];
            newList[firstIndex].children[secondIndex].children = children;
            newList[firstIndex].children[secondIndex].children.splice(thirdIndex,1);
        }
        this.setState({categoryList:newList});
        resetFields([...this.categoryFromList]);
    }

    //内容改变
    handleChange = (e,type,firstIndex,secondIndex,thirdIndex) => {
        const { categoryList } = this.state;
        const newList = JSON.parse(JSON.stringify(categoryList));
        const val = e.target.value;
        clearTimeout(this.timer);
        if(type === 'first'){
            newList[firstIndex].categoryName = val;
        }else
        if(type === 'second'){
            newList[firstIndex].children[secondIndex].categoryName = val;
        }else{
            newList[firstIndex].children[secondIndex].children[thirdIndex].categoryName = val;
        }   
        this.timer = setTimeout(() => {
            this.setState({categoryList:newList});
        },500)
    }

    deleteModule = (type,firstIndex,secondIndex,thirdIndex) => {
        return (
            <Icon 
                type="close" 
                style={{cursor:'pointer',color:'#f5222d'}} 
                onClick={() => this.handleRemoveInput(type,firstIndex,secondIndex,thirdIndex)}
            />
        )
    }

    render(){
        const { categoryList } = this.state;
        const { form:{getFieldDecorator},onceData={},drawerType } = this.props;
        const { categoryCode='',categoryName='' } = onceData;
        this.categoryFromList = [];
        return(
            <div className={styles.addBox}>
                <Form layout="horizontal">
                    {
                        drawerType === 'add' ? (
                            <Form.Item label='类目组编码'>
                                {getFieldDecorator('categoryCode',{
                                    initialValue:categoryCode,
                                    rules: [
                                        {
                                            required: true,
                                            validator: this.categoryCodeValidator
                                        }
                                    ]
                                })(
                                    <Input placeholder="请输入类目组ID" />
                                )}
                            </Form.Item>    
                        ) : ''
                    }
                    <Form.Item label='类目组名称'>
                        {getFieldDecorator('categoryName',{
                            initialValue:categoryName,
                            rules: [
                                { required: true, message: '请输入类目组名称' },
                                { whitespace: true, message: '请输入类目组名称' },
                            ]
                        })(
                            <Input placeholder="请输入类目组名称" />
                        )}
                    </Form.Item>
                    <Form.Item label='业务类目' style={{marginBottom:0}}>
                        {getFieldDecorator('categoryLabel',{
                            initialValue:categoryName,
                            rules: [ { required: true} ]
                        })(
                            <span></span>
                        )}
                    </Form.Item>
                    <div className={styles.categoryBox}>
                        <span 
                            className={styles.addFirst} 
                            onClick={() => this.handleAddInput('first')} 
                            title="添加一级类目"
                        >
                            <Icon type="plus" />
                        </span>
                        {/* 一级类目 */}
                        {
                            categoryList.map((item,firstIndex) => {
                                const firstKey = item.categoryCode ? 'category_' + item.categoryCode : 'category_' + item.sign;
                                const secondChildren = categoryList[firstIndex].children || [];
                                this.categoryFromList.push(firstKey);
                                return (
                                    <div className={styles.firstBox} key={firstKey}>
                                        <Icon 
                                            type="plus-circle" 
                                            className={styles.addSecond} 
                                            title="添加二级类目"
                                            onClick={() => this.handleAddInput('second',firstIndex)}
                                        />
                                        <span className={styles.firstHorizontal}></span>
                                        {
                                            firstIndex !== (categoryList.length - 1) ? (
                                                <div className={styles.firstVerticalBox}><span></span></div>
                                            )  : ''
                                        }
                                        <div style={{overflow:'hidden'}}>
                                            <Form.Item>
                                                {getFieldDecorator(firstKey,{
                                                    initialValue:item.categoryName,
                                                    rules: [ { required: true, message: '请输入一级类目'} ]
                                                })(
                                                    <Input 
                                                        placeholder="请输入一级类目" 
                                                        suffix={categoryList.length === 1 || secondChildren.length ? <span /> : this.deleteModule('first',firstIndex)} 
                                                        onChange={(e) => this.handleChange(e,'first',firstIndex)}
                                                    />
                                                )}
                                            </Form.Item>
                                        </div>    
                                        

                                        {/* 二级类目 */}

                                        {
                                            secondChildren.map((i,secondIndex) => {
                                                const secondKey = i.categoryCode ? 'category_' + i.categoryCode : 'category_' + i.sign;
                                                const thirdChildren = secondChildren[secondIndex].children || [];
                                                this.categoryFromList.push(secondKey);
                                                return(
                                                    <div className={styles.secondBox} key={secondKey}>
                                                        <Icon 
                                                            type="plus-circle" 
                                                            className={styles.addThird} 
                                                            title="添加三级类目"
                                                            onClick={() => this.handleAddInput('third',firstIndex,secondIndex)}
                                                        />
                                                        <span className={styles.secondHorizontal}></span>
                                                        {
                                                            !secondIndex ? (
                                                                <span className={styles.onceHorizontal} style={{borderColor:'#85a5ff'}}></span>
                                                            ) : ''
                                                        }
                                                        {
                                                            secondIndex !== (secondChildren.length - 1) ? (
                                                                <div className={styles.secondVerticalBox}><span></span></div>
                                                            )  : ''
                                                        }
                                                        <div style={{overflow:'hidden'}}>
                                                            <Form.Item>
                                                                {getFieldDecorator(secondKey,{
                                                                    initialValue:i.categoryName,
                                                                    rules: [ { required: true, message: '请输入二级类目'} ]
                                                                })(
                                                                    <Input 
                                                                        placeholder="请输入二级类目" 
                                                                        suffix={thirdChildren.length ? <span/> : this.deleteModule('second',firstIndex,secondIndex)} 
                                                                        onChange={(e) => this.handleChange(e,'second',firstIndex,secondIndex)}
                                                                    />
                                                                )}
                                                            </Form.Item>
                                                        </div>

                                                        {/* 三级类目 */}

                                                        {
                                                            thirdChildren.map((l,thirdIndex) => {
                                                                const thirdKey = l.categoryCode ? 'category_' + l.categoryCode : 'category_' + l.sign;
                                                                this.categoryFromList.push(thirdKey);
                                                                return(
                                                                    <div className={styles.thirdBox} key={thirdKey}>
                                                                        <span className={styles.thirdHorizontal}></span>
                                                                        {
                                                                            !thirdIndex ? (
                                                                                <span className={styles.onceHorizontal} style={{borderColor:'#C4D4FF'}}></span>
                                                                            ) : ''
                                                                        }
                                                                        {
                                                                            thirdIndex !== (thirdChildren.length - 1) ? (
                                                                                <div className={styles.thirdVerticalBox}><span></span></div>
                                                                            )  : ''
                                                                        }
                                                                        <div style={{overflow:'hidden'}}>
                                                                            <Form.Item>
                                                                                {getFieldDecorator(thirdKey,{
                                                                                    initialValue:l.categoryName,
                                                                                    rules: [ { required: true, message: '请输入三级类目'} ]
                                                                                })(
                                                                                    <Input 
                                                                                        placeholder="请输入三级类目" 
                                                                                        suffix={this.deleteModule('third',firstIndex,secondIndex,thirdIndex)} 
                                                                                        onChange={(e) => this.handleChange(e,'third',firstIndex,secondIndex,thirdIndex)}
                                                                                    />
                                                                                )}
                                                                            </Form.Item>
                                                                        </div>
                                                                    </div>
                                                                ) 
                                                            })
                                                        }

                                                    </div>    
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                      

                    </div>
                </Form>
            </div>
        )
    }
}

export default CategoryAdd;