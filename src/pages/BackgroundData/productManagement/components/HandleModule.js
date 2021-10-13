import React, { Component, Fragment } from 'react';
import { Form, Button, message } from 'antd';
import debounce from 'lodash/debounce';
import DrawerMount from '@components/DrawerMount';
import FormModule from '@components/FormModule';
import Dimension from './Dimension';
import styles from './HandleModule.less';

@Form.create()
class ProductManagementHand extends Component {

  constructor(props){
    super(props)
    this.enterpriseCategorySearch = debounce(this.enterpriseCategorySearch, 500);
    this.openCategorySearch = debounce(this.openCategorySearch, 500)
    this.state = {
      visible: false,
      companyVal: {},
      roleSelected: [],
      projectSelected: [],
      categoryted: [],
      companyList: [],
      enterpriseCategoryList:[],
      openCategoryList:[]
    };
  }

  componentDidMount() {
    const { drawerType, onRef, onceData = {} } = this.props;
    const { companyId } = onceData;
    this.isSubmit = true;
    onRef(this);
    if (drawerType === 'edit') {
      this.setInitData();
      this.setInitDimension();
      this.getCategoryByCompany(companyId);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'productManagement/setDimensionList',
      payload: { dataList: [], dimensionList: [{}] },
    });
  }

  //请求
  requestFun = (datas, callback) => {
    const { dispatch, onceData, drawerType, productManagement } = this.props;
    const { dimensions = [] } = productManagement;
    const { id } = onceData;
    let type, payload;
    if (drawerType === 'edit') {
      type = 'productManagement/fetchUpdateProduction';
      payload = { ...datas, id };
    } else {
      type = 'productManagement/fetchCreateProduction';
      payload = { ...datas };
    }
    payload.dimensions = dimensions;
    dispatch({
      type,
      payload,
      callback: (res) => {
        const { success } = res;
        if (success) {
          message.success('保存成功');
          callback();
        } else {
          this.isSubmit = true;
          message.error(res.message);
        }
      },
    });
  };

  //初始化维度
  setInitDimension = () => {
    const { dispatch, onceData } = this.props;
    const { id } = onceData;
    dispatch({
      type: 'productManagement/fetchGetDimensionTree',
      payload: { productionId: id },
      callback: (res) => {
        const { success } = res;
        if (success) {
          const { data = [] } = res.data;
          let dimensions = [];
          data.map((item, index) => {
            const { dimensionName = '', dimensionKey = '', dimensionFields = [] } = item;
            dimensions.push({ dimensionName, dimensionKey });
            if (dimensionFields.length) {
              let children = [];
              dimensionFields.map((val, i) => {
                const { dimensionFieldName = '', dimensionCode = '' } = val;
                children.push({ dimensionFieldName, dimensionCode });
              });
              dimensions[index].dimensionFields = children;
            }
          });
          let dimensionList = [...dimensions];
          this.setState({ dimensionList }, () => {
            this.setDimension(dimensions, dimensionList);
          });
        }
      },
    });
  };

  //设置维度值
  setDimension = (dimensions, dimensionList) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'productManagement/setDimensionList',
      payload: { dimensions, dimensionList },
    });
  };

  //获取产品下的知识项目列表
  getCategoryByCompany = (companyId) => {
    this.props.dispatch({
      type: 'productManagement/fetchGetOneLevelCategoryByCompany',
      payload: { companyId },
      callback: (res) => {
        const { success } = res;
        if (success) {
          const { data } = res.data;
          let companyList = [];
          if (data) {
            companyList = data;
          }
          this.setState({ companyList });
        }
      },
    });
  };

  //绑定组件
  onRef = (ref) => {
    this.childModule = ref;
  };

  //多选初始化
  setInitData = () => {
    const { onceData } = this.props;
    const {
      knowledgeProjectName = [],
      userRoleVos = [],
      oneLevelCategorys = [],
      companyId,
      companyName,
    } = onceData;
    const companyVal = { companyId, companyName };
    let projectSelected = [];
    let roleSelected = [];
    let categoryted = [];
    knowledgeProjectName.map((item) => {
      projectSelected.push(item.id);
    });
    userRoleVos.map((item) => {
      roleSelected.push(item.id);
    });
    oneLevelCategorys.map((item) => {
      categoryted.push(item.id);
    });
    this.setState({ projectSelected, roleSelected, categoryted, companyVal });
  };

  //企业大类搜索
  enterpriseCategorySearch = (value) => {
    console.log(value)
    const { enterpriseCategoryList } = this.state;
    const newList = JSON.parse(JSON.stringify(enterpriseCategoryList));
    let val = value.trim();
    if (val.length) {
      let arr = newList.filter((item) => {
        const { name } = item;
        return name.indexOf(val) !== -1;
      });
      this.setState({ enterpriseCategoryList: arr });
    } else {
      this.setState({ enterpriseCategoryList:newList });
    }
  }

  //开放性大类搜索
  openCategorySearch = (value) => {
    console.log(value)
    const { openCategoryList } = this.state;
    const newList = JSON.parse(JSON.stringify(openCategoryList));
    let val = value.trim();
    if (val.length) {
      let arr = newList.filter((item) => {
        const { name } = item;
        return name.indexOf(val) !== -1;
      });
      this.setState({ openCategoryList: arr });
    } else {
      this.setState({ openCategoryList:newList });
    }
  }

  //提交
  handleSubmit = (callback) => {
    const { companyVal } = this.state;
    const {
      form: { validateFields },
      drawerType,
    } = this.props;
    if (this.isSubmit) {
      this.isSubmit = false;
      let validateList = ['roleIds', 'companyId', 'categoryIds', 'memo'];
      if (drawerType === 'add') {
        validateList = [...validateList, 'productName', 'bmAppId'];
      }
      validateFields(validateList, (err, values) => {
        if (!err) {
          const { companyId, companyName } = companyVal;
          const datas = { ...values, companyId, companyName };
          this.requestFun(datas, callback);
        } else {
          this.isSubmit = true;
        }
      });
    }
  };

  //产品名称验证
  validatorProductName = (rule, val = '', callback) => {
    const value = val.trim();
    if (value.length) {
      if (val.length <= 15) {
        callback();
      } else {
        this.isSubmit = true;
        callback('产品名称最多15字符');
      }
    } else {
      this.isSubmit = true;
      callback('请输入产品名称');
    }
  };

  //产品appId验证
  validatorBmappid = (rule, val = '', callback) => {
    const { field } = rule;
    const value = val.trim();
    if (value.length) {
      if (val.length <= 32) {
        callback();
      } else {
        this.isSubmit = true;
        callback(`数据appId最多32字符`);
      }
    } else {
      if (field === 'dataAppId') {
        callback();
      } else {
        this.isSubmit = true;
        callback('请输入数据appId');
      }
    }
  };

  //备注验证
  validatorMemo = (rule, val = '', callback) => {
    if (val.length <= 255) {
      callback();
    } else {
      this.isSubmit = true;
      callback('备注最多255字符');
    }
  };

  //企业选择
  handleCompanySelect = (val, options = {}) => {
    const { form } = this.props;
    const { props = {} } = options;
    const { value, children } = props;
    const companyVal = { companyId: value, companyName: children };
    this.setState({ companyVal }, () => {
      const { companyId } = companyVal;
      form.setFieldsValue({ categoryIds: undefined });
      this.getCategoryByCompany(companyId);
    });
  };

  //编辑数据维度
  handleEdit = () => {
    this.setState({ visible: true });
  };

  //关闭维度编辑
  handleClose = () => {
    this.setState({ visible: false });
  };

  //保存维度
  handleSave = () => {
    this.childModule.handleSave(() => {
      this.setState({ visible: false });
    });
  };

  //产品相关
  productModule() {
    const { roleSelected } = this.state;
    const {
      form: { getFieldDecorator },
      drawerType,
      onceData,
      productManagement,
    } = this.props;
    const { roleList = [], companyList = [] } = productManagement;
    const { productName = '', bmAppId = '', companyId } = onceData;
    const formList = [
      {
        type: 'Dom',
        label: '',
        id: 'productTitle',
        onceStyle: { marginBottom: 0 },
        custom: (
          <div className={styles.titleContent}>
            /// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;产品相关&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ///
          </div>
        ),
      },
      {
        type: 'Input',
        label: '产品名称',
        id: 'productName',
        options: {
          initialValue: productName,
          rules: [
            {
              required: drawerType !== 'edit',
              validator: this.validatorProductName,
            },
          ],
        },
        domOptions: { placeholder: '请输入产品名称', disabled: drawerType === 'edit' },
      },
      {
        type: 'Input',
        label: '数据appId',
        id: 'bmAppId',
        options: {
          initialValue: bmAppId,
          rules: [
            {
              required: drawerType !== 'edit',
              validator: this.validatorBmappid,
            },
          ],
        },
        domOptions: { placeholder: '请输入数据appId', disabled: drawerType === 'edit' },
      },
      {
        type: 'Select',
        label: '关联角色',
        id: 'roleIds',
        options: {
          initialValue: roleSelected,
          rules: [
            {
              required: true,
              message: '请选择关联角色',
            },
          ],
        },
        domOptions: { mode: 'multiple', allowClear: true, placeholder: '请选择关联角色' },
        optionList: roleList,
        valueName: 'id',
        labelName: 'roleName',
      },
      {
        type: 'Select',
        label: '关联企业',
        id: 'companyId',
        onceStyle: { marginBottom: 0 },
        options: {
          initialValue: companyId,
          rules: [
            {
              required: true,
              message: '请选择关联企业',
            },
          ],
        },
        domOptions: {
          allowClear: true,
          placeholder: '请选择关联企业',
          onChange: this.handleCompanySelect,
        },
        optionList: companyList,
        valueName: 'id',
        labelName: 'companyName',
      },
    ];
    return formList;
  }

  //定制服务
  customizedModule() {
    const { categoryted, companyList } = this.state;
    const formList = [
      {
        type: 'Dom',
        label: '',
        id: 'customizedTitle',
        onceStyle: { marginBottom: 0 },
        custom: (
          <div className={styles.titleContent}>
            /// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;定制服务&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ///
          </div>
        ),
      },
      {
        type: 'Select',
        label: '知识库类目',
        id: 'categoryIds',
        options: { initialValue: categoryted },
        domOptions: { mode: 'multiple', allowClear: true, placeholder: '请选择知识库类目' },
        optionList: companyList,
        valueName: 'id',
        labelName: 'categoryName',
      },
      {
        type: 'Dom',
        label: '数据分析维度',
        id: 'editBtn',
        custom: <Button onClick={this.handleEdit}>编辑</Button>,
      }
    ];
    return formList;
  }

  //文章服务
  articleModule() {
    const { enterpriseCategoryList,openCategoryList } = this.state;
    const { onceData } = this.props;
    const { memo = '' } = onceData;
    const formList = [
      {
        type: 'Dom',
        label: '',
        id: 'articleTitle',
        onceStyle: { marginBottom: 0 },
        custom: (
          <div className={styles.titleContent}>
            /// &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文章服务&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ///
          </div>
        ),
      },
      {
        type: 'Select',
        label: '企业级文章大类',
        id: 'enterprise_category',
        optionList: enterpriseCategoryList,
        valueName: 'id',
        labelName: 'name',
        options:{
          initialValue: undefined,
        },
        domOptions: {
          mode:"multiple",
          //showSearch: true,
          placeholder: '请选择',
          // notFoundContent:serchCompanyData.length ? <Spin size="small" /> : null,
          filterOption: false,
          //allowClear: false,
          onSearch: this.enterpriseCategorySearch,
        }
      },
      {
        type: 'Select',
        label: '开放性文章大类',
        id: 'open_category',
        optionList: openCategoryList,
        valueName: 'id',
        labelName: 'name',
        options:{
          initialValue: undefined,
        },
        domOptions: {
          mode:"multiple",
          //showSearch: true,
          placeholder: '请选择',
          // notFoundContent:serchCompanyData.length ? <Spin size="small" /> : null,
          filterOption: false,
          //allowClear: false,
          onSearch: this.openCategorySearch,
        }
      },
      {
        type: 'TextArea',
        label: '备注',
        id: 'memo',
        options: {
          initialValue: memo,
          rules: [
            {
              validator: this.validatorMemo,
            },
          ],
        },
        domOptions: { placeholder: '请输入备注', rows: 6 },
      },
    ];
    return formList;
  }

  //抽屉
  drawerModule() {
    const { visible } = this.state;
    const drawerOptions = {
      content: (
        <Dimension {...this.props} onDimensionRef={this.onRef} setDimension={this.setDimension} />
      ),
      onCancel: this.handleClose,
      okText: '保存',
      onOk: this.handleSave,
    };
    const drawerProps = {
      title: '产品管理/数据分析维度',
      placement: 'right',
      closable: false,
      destroyOnClose: true,
      onClose: this.handleClose,
      visible,
    };
    return <DrawerMount drawerProps={drawerProps} {...drawerOptions} />;
  }

  render() {
    const productList = this.productModule();
    const customizedList = this.customizedModule();
    const articleList = this.articleModule();
    const formList = [...productList, ...customizedList,...articleList];
    return (
      <div className={styles.handleBox}>
        <FormModule {...this.props} formList={formList} />
        {this.drawerModule()}
      </div>
    );
  }
}

export default ProductManagementHand;
