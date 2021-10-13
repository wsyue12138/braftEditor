import React, { Component, Fragment } from 'react';
import { Row, Col } from 'antd';
import Editor from '@components/Editor';
import FormModule from '@components/FormModule';
import AvatarUploader from '@components/AvatarUploader';
import { modalContent, getUserData } from '@utils/utils';
import bodyStr from './body';
import styles from './AddModule.less';

class ArticleCompleteAdd extends Component {
  constructor(props) {
    super(props);
    const { drawerType } = this.props;
    this.editorState = drawerType === 'edit' ? bodyStr : '';
    this.state = {
      initContent:''
    }
  }

  componentDidMount() {
    const {
      form: { setFieldsValue },
      onceData,
      onRef,
    } = this.props;
    const { thumbnail } = onceData;
    onRef(this);
    setFieldsValue({ thumbnail: thumbnail });
    //this.setState({initContent:bodyStr});
  }

  //保存
  handleSave = (callback) => {
    callback();
  };

  //富文本返回
  handleOnChange = (editorState) => {
    console.log(editorState)
    this.editorState = editorState;
  };

  //获取富文本内容预览
  handlePreview = () => {
    const {
      form: { getFieldValue },
    } = this.props;
    const title = getFieldValue('title');
    return { contnet: this.editorState, title };
  };

  //图片上传回调
  uploadCallback = (res) => {
    const { ret_code, ret_msg, data } = res;
    if (ret_code === 1) {
      const {
        form: { setFieldsValue },
      } = this.props;
      const { url } = data;
      setFieldsValue({ picture: url });
      modalContent('success', '上传成功', true);
    } else {
      if (ret_code === 11019) {
        modalContent('warning', '仅支持上传jpg,png,gif文件!', true);
      } else {
        modalContent('error', '上传失败,请稍后重试', true);
      }
    }
  };

  //文章大类变更
  mainTypeChange = (value) => {};

  formModule() {
    const { onceData } = this.props;
    const {
      title,
      editor,
      refUrl,
      srcSite,
      thumbnail,
      subType,
      labs,
      mainType,
      assSubType,
      assLabs,
      quality,
      comment,
      intro,
      infoStr,
    } = onceData;
    const { data = {} } = getUserData();
    const { token = '' } = data;
    const formList = [
      {
        type: 'Input',
        label: '文章标题',
        id: 'title',
        options: {
          initialValue: title,
          rules: [
            { required: true, message: '请输入文章标题' },
            { whitespace: true, message: '请输入文章标题' },
            { max: 100, message: '标题最多24个字符，已超出' },
          ],
        },
        domOptions: { placeholder: '请输入文章标题' },
      },
      {
        type: 'Input',
        label: '小编',
        id: 'editor',
        options: {
          initialValue: editor,
          rules: [
            { required: true, message: '请输入小编' },
            { whitespace: true, message: '请输入小编' },
            { max: 50, message: '小编最多4个字符，已超出' },
          ],
        },
        domOptions: { placeholder: '请输入小编' },
      },
      {
        type: 'Input',
        label: '内容来源',
        id: 'srcSite',
        options: {
          initialValue: srcSite,
          rules: [
            { max: 300, message: '内容最多300字' },
          ],
        },
        domOptions: { placeholder: '请输入文章来源' },
      },
      {
        type: 'Dom',
        label: '缩略图',
        id: 'thumbnail_title',
        onceStyle: { marginBottom: 0 },
        options: {
          rules: [{ required: true }],
        },
        custom: <span></span>,
      },
      {
        type: 'Dom',
        label: '',
        id: 'thumbnail',
        onceStyle: { margin: 0 },
        options: {
          initialValue: thumbnail,
          rules: [{ required: true, message: '请上传文章缩略图' }],
        },
        custom: (
          <Fragment>
            <AvatarUploader
              headers={{ token }}
              action="/icservice/common/uploadImg"
              initUrl={thumbnail}
              callback={this.uploadCallback}
            />
          </Fragment>
        ),
      },
      {
        type: 'Select',
        label: '文章大类',
        id: 'mainType',
        options: {
          initialValue: mainType,
          rules: [
            {
              required: true,
              message: '请选择文章大类',
            },
          ],
        },
        domOptions: { placeholder: '请选择文章大类', onChange: this.mainTypeChange },
        optionList: [],
        valueName: 'val',
        labelName: 'label',
      },
      {
        type: 'Select',
        label: '文章小类',
        id: 'assSubType',
        options: {
          initialValue: assSubType,
        },
        domOptions: { placeholder: '请选择文章小类', mode: 'multiple' },
        optionList: [],
        valueName: 'val',
        labelName: 'label',
      },
      {
        type: 'Select',
        label: '文章标签',
        id: 'assLabs',
        options: {
          initialValue: assLabs,
        },
        domOptions: { placeholder: '请选择文章标签', mode: 'multiple' },
        optionList: [],
        valueName: 'val',
        labelName: 'label',
      },
      {
        type: 'null',//'Input',
        label: 'TES小类',
        id: 'subType',
        onceStyle: { marginTop: 10 },
        options: {
          initialValue: subType,
        },
        domOptions: { placeholder: '输入TES匹配小类' },
      },
      {
        type: 'null',//'Input',
        label: 'TES标签',
        id: 'labs',
        options: {
          initialValue: labs,
        },
        domOptions: { placeholder: '输入TES匹配标签' },
      },
      {
        type: 'TextArea',
        label: '备注',
        id: 'comment',
        options: {
          initialValue: comment,
          rules: [
            { max: 300, message: '备注最多300字' },
          ],
        },
        domOptions: { placeholder: '输入备注', rows: 4 },
      },
      {
        type: 'TextArea',
        label: '文章简介',
        id: 'intro',
        options: {
          initialValue: intro,
          rules: [
            { max: 300, message: '简介最多300字' }
          ]
        },
        domOptions: { placeholder: '输入文章简介', rows: 4 },
      },
      {
        type: 'TextArea',
        label: '文章配置信息',
        id: 'infoStr',
        options: {
          initialValue: infoStr,
        },
        domOptions: { placeholder: '输入配置信息', rows: 4 },
      },
    ];
    return <FormModule form={this.props.form} formList={formList} />;
  }

  render() {
    const { initContent } = this.state;
    return (
      <div style={{ width: '100%',height:'100%', padding: '5px 40px' }}>
        <Row style={{height:'100%'}}>
          <Col span={12} className={styles.form_Box}>
            {this.formModule()}
          </Col>
          <Col span={12} id='editor_Box' className={styles.editor_Box}>
            <Editor
              width={550}
              height={700}
              initContent={initContent}
              onChange={this.handleOnChange}
            />
            {/* <BraftEditor
                            editorContent={bodyStr}
                            callback={this.braftEditorCallback}
                        /> */}
          </Col>
        </Row>
      </div>
    );
  }
}

export default ArticleCompleteAdd;
