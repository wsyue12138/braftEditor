import React, { Component, Fragment } from 'react';
import { Form, Button, Modal, message } from 'antd';
import SearchForm from '@components/SearchForm';
import TableContent from '@components/TableContent';
import DrawerMount from '@components/DrawerMount';
import AddModule from './components/AddModule';
import PreviewModule from './components/PreviewModule';
import bodyStr from './components/body';

@Form.create()
class OfficialComplete extends Component {
  constructor(props) {
    super(props);
    this.addModule = null;
    this.isSubmit = true;
    this.state = {
      loading: false,
      searchData: {},
      pageNum: 1,
      pageSize: 10,
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      drawerType: '',
      onceData: {},
      previewVisible: false,
      previewImage: '',
      mainTypeVal: undefined,
      articleVisible: false,
      articleTitle: '',
      articleContent: bodyStr,
    };
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    console.log(bodyStr);
  };

  //绑定组件
  onRef = (ref) => {
    this.addModule = ref;
  };

  //搜索
  handleSearch = () => {};

  //大类切换
  handleMainType = (value) => {
    this.setState({ mainTypeVal: value });
  };

  //状态切换
  handleStatus = (data) => {
    if (this.isSubmit) {
      const { enable } = data;
      const txt = enable ? '下架' : '上架';
      Modal.confirm({
        title: `确认${txt}此篇文章？`,
        content: '',
        className: 'selfModal',
        centered: true,
        okText: '是',
        cancelText: '否',
        onOk: () => {
          //this.deleteRequest(data);
        },
      });
    }
  };

  //保存
  handleOk = () => {
    this.addModule.handleSave(() => {
      this.setState({ visible: false, drawerType: '', onceData: {} }, () => {
        this.getList();
      });
    });
  };

  //删除提醒
  deleteTip = () => {
    if (this.isSubmit) {
      this.isSubmit = false;
      Modal.confirm({
        title: `是否确认删除？`,
        content: '',
        className: 'selfModal',
        centered: true,
        okText: '是',
        cancelText: '否',
        onOk: () => {this.isSubmit = true},
        onCancel: () => {this.isSubmit = true}
      });
    }
  }

  //批量状态判断
  batchStatus = (type) => {
    const { selectedRows } = this.state;
    const initEnable = type === 'open' ? 0 : 1;
    const txt = type === 'open' ? '上架' : '下架';
    const status = selectedRows.every((item) => {
      return item.enable === initEnable;
    });
    if (!status) {
      message.warning(`所选知识包含${txt}状态，请重新确认`);
    }
    return status;
  };

  //批量操作提醒
  operationTip = (type) => {
    if (this.isSubmit) {
      const { selectedRowKeys } = this.state;
      if (selectedRowKeys.length) {
        let txt = '';
        if(type === 'open'){
          txt = '上架';
        }else
        if(type === 'close'){
          txt = '下架';
        }else{
          txt = '删除';
        }
        const allStatus = this.batchStatus(type);
        if (allStatus) {
          Modal.confirm({
            title: `是否执行批量${txt}操作？`,
            content: '',
            className: 'selfModal',
            centered: true,
            okText: '是',
            cancelText: '否',
            onOk: () => {},
          });
        }
      } else {
        message.warning('请选择操作项');
      }
    }
  };

  //开启预览
  articleOpen = (articleTitle) => {
    this.setState({ articleVisible: true, articleTitle });
  };

  //关闭预览
  articleCancel = () => {
    this.setState({ articleVisible: false });
  };

  //编辑、添加预览
  handlePreview = () => {
    const obj = this.addModule.handlePreview();
    const { contnet, title = '' } = obj;
    let articleContent = contnet;
    try {
      articleContent = contnet.toHTML();
    } catch (error) {}
    this.setState({ articleVisible: true, articleContent, articleTitle: title });
  };

  //搜索部分
  searchModule() {
    const { mainTypeVal } = this.state;
    const searchList = [
      {
        type: 'Input',
        id: 'search_strId',
        domOptions: { placeholder: '文章ID' },
        domStyle: { width: 140 },
        iconType: 'edit',
      },
      {
        type: 'Input',
        id: 'search_title',
        domOptions: { placeholder: '文章标题' },
        domStyle: { width: 140 },
        iconType: 'edit',
      },
      {
        type: 'Select',
        id: 'search_enable',
        domOptions: { placeholder: '启用状态' },
        domStyle: { width: 120 },
        optionList: [
          { val: 'true', label: '上架' },
          { val: 'false', label: '下架' },
        ],
        valueName: 'val',
        labelName: 'label',
      },
      {
        type: 'Button',
        btnTitle: '查询',
        iconType: 'search',
        domOptions: { type: 'primary', onClick: this.handleSearch },
      },
      {
        type: 'Button',
        btnTitle: '新增',
        iconType: 'plus',
        domOptions: { onClick: () => this.setState({ visible: true, drawerType: 'add' }) },
      },
    ];
    return <SearchForm {...this.props} searchList={searchList} />;
  }

  //列表部分
  tableModule() {
    const { loading, pageNum, pageSize, selectedRowKeys } = this.state;
    const { articleLabel = {} } = this.props;
    const { listData = {} } = articleLabel;
    const {
      list = [
        {
          id: 0,
          strId: '1334429305886740480',
          title: '一片小文章',
          enable: 0,
          mainType: '文章大类',
          assSubType: ['02000834'],
          assLabs: ['03001075'],
          labList: ['水痘', '胃炎'],
        },
        {
          id: 1,
          strId: '1334429305886740480',
          title: '一片小文章',
          enable: 1,
          mainType: '文章大类',
          assSubType: ['02000834'],
          assLabs: ['03001075'],
          labList: ['水痘', '胃炎'],
        },
        {
          id: 2,
          strId: '1334429305886740480',
          title: '一片小文章',
          enable: 0,
          mainType: '文章大类',
          assSubType: ['02000834'],
          assLabs: ['03001075'],
          labList: ['水痘', '胃炎'],
        },
      ],
      total = 2,
    } = listData;
    let columns = [
      {
        title: '文章ID',
        key: 'strId',
        width: '25%',
        render: (text) => {
          let { strId = '' } = text;
          return <span>{strId}</span>;
        },
      },
      {
        title: '文章标题',
        key: 'title',
        width: '25%',
        render: (text) => {
          let { title = '' } = text;
          return <span onClick={() => this.articleOpen(title)}>{title}</span>;
        },
      },
      {
        title: '启用状态',
        key: 'enable',
        width: '25%',
        render: (text) => {
          let { enable } = text;
          return <span>{enable ? '上架' : '下架'}</span>;
        },
      },
      {
        title: '创建日期',
        key: 'creat_date',
        width: '25%',
        render: (text) => {
          let { enable } = text;
          return <span>2021-04-12 12:22:10</span>;
        },
      },
      {
        title: '操作',
        key: 'operation',
        width: 270,
        render: (text) => {
          let { id,enable } = text;
          return (
            <Fragment>
              <Button
                style={{ marginRight: 12 }}
                onClick={() => this.setState({ visible: true, drawerType: 'edit', onceData: text })}
              >
                编辑
              </Button>
              <Button
                style={{ marginRight: 12 }}
                onClick={() => this.handleStatus(text)}
              >
                {enable ? '下架' : '上架'}
              </Button>
              <Button type="danger" ghost onClick={() => this.deleteTip(id)}>
                删除
              </Button>
            </Fragment>
          );
        },
      },
    ];

    //勾选
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };

    const tableOptions = {
      onceKey: 'id',
      loading,
      columns,
      dataSource: list,
      rowSelection,
    };

    const pageOptions = {
      totalShow: true,
      current: pageNum,
      pageSize: pageSize,
      onChange: (current, pageSize) => {
        this.setState({ pageNum: current, pageSize, selectedRowKeys: [], selectedRows: [] }, () => {
          this.getList();
        });
      },
      total,
      custom: (
        <Fragment>
          <Button style={{ marginRight: 12 }} onClick={() => this.operationTip('open')}>
            批量上架
          </Button>
          <Button style={{ marginRight: 12 }} onClick={() => this.operationTip('close')}>
            批量下架
          </Button>
          <Button style={{ marginRight: 12 }}type="danger" ghost  onClick={() => this.operationTip('delete')}>
            批量删除
          </Button>
        </Fragment>
      ),
    };

    return <TableContent tableOptions={tableOptions} pageOptions={pageOptions} />;
  }

  //抽屉
  drawerContent() {
    const { visible, drawerType, onceData } = this.state;
    let drawerOptions = {
      size: 'large',
      content: (
        <AddModule onRef={this.onRef} drawerType={drawerType} onceData={onceData} {...this.props} />
      ),
      isOk: true,
      okText: '保存',
      onOk: this.handleOk,
      onCancel: () => this.setState({ visible: false, drawerType: '', onceData: {} }),
      moreBtnData: [
        {
          text: '预览',
          type: '',
          onClick: this.handlePreview,
        },
      ],
    };
    const titleTxt = drawerType === 'add' ? '新增' : '编辑';
    let drawerProps = {
      title: `官网文章管理/${titleTxt}`,
      placement: 'right',
      closable: false,
      destroyOnClose: true,
      onClose: () => this.setState({ visible: false, drawerType: '', onceData: {} }),
      visible: visible,
    };
    return <DrawerMount drawerProps={drawerProps} {...drawerOptions} />;
  }

  render() {
    const { articleTitle = '', articleVisible, articleContent = '' } = this.state;
    return (
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {this.searchModule()}
        {this.tableModule()}
        {this.drawerContent()}
        <PreviewModule
          title={articleTitle}
          visible={articleVisible}
          onCancel={this.articleCancel}
          content={articleContent}
        />
      </div>
    );
  }
}

export default OfficialComplete;
