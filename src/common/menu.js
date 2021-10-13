const basicMenuData = [
  {
    name: '产品首页',
    path: 'welcome',
    icon: 'home',
    code: '0',
  },
  {
    name: '数据分析',
    path: 'dataAnalysis',
    icon: 'pie-chart',
    code: '04000000',
    children: [
      {
        name: '知识库数据分析',
        path: 'dataStatistics',
        code: '04010000',
      },
      {
        name: '知识库明细查询',
        path: 'detailed',
        code: '04020000',
        isTab: true,
        children: [
          {
            name: '问题明细',
            path: 'problemDetails',
            tabTitle: '问题明细',
            code: '0',
          },
          {
            name: '服务功能明细',
            path: 'serviceDetails',
            tabTitle: '服务功能明细',
            code: '0',
          },
          {
            name: '服务质量明细',
            path: 'serviceQualityDetails',
            tabTitle: '服务质量明细',
            code: '0',
          },
        ],
      },
    ],
  },
  {
    name: '知识管理',
    path: 'knowledgeManagement',
    icon: 'read',
    code: '05000000',
    children: [
      {
        name: '知识库管理',
        path: 'knowledgeBase',
        code: '05010000',
      },
      {
        name: '未知问题学习',
        path: 'unknownQuestion',
        code: '05030000',
      },
      {
        name: '未解决问题学习',
        path: 'unresolvedQuestion',
        code: '05040000',
      },
      {
        name: '历史记录',
        path: 'history',
        code: '05020000',
      },
      {
        name: '工单管理',
        path: 'workforce',
        code: '05050000',
      },
    ],
  },
  {
    name: '人机协作',
    path: 'manMachine',
    icon: 'robot',
    code: '06000000',
    children: [
      {
        name: '留言记录',
        path: 'message',
        code: '06010000',
      },
      {
        name: '在线客服',
        path: 'customerService',
        code: '06020000',
      },
      {
        name: '快捷回复管理',
        path: 'quickReply',
        code: '06060000',
      },
      {
        name: '历史会话',
        path: 'conversation',
        code: '06030000',
      },
      {
        name: '工作报表',
        path: 'reportForm',
        code: '06040000',
      },
      {
        name: '考勤信息',
        path: 'attendance',
        code: '06050000',
      },
    ],
  },
  {
    name: '产品服务',
    path: 'productService',
    icon: 'appstore',
    code: '03000000',
    children: [
      {
        name: '产品账号管理',
        path: 'account',
        code: '03010000',
      },
    ],
  },
  // {
  //     name: '数据监控',
  //     path: 'monitor',
  //     icon:'monitor',
  //     code:'03000000',
  // },
  // {
  //     name: '数据分析',
  //     path: 'statistics',
  //     icon:'fund',
  //     code:'03000000',
  // }
  // {
  //     name: '小程序管理',
  //     path: 'applets',
  //     icon:'wechat',
  //     code:'03000000',
  //     children: [
  //         {
  //             name: 'banner管理',
  //             path: 'banner',
  //             code:'03010000'
  //         },
  //         {
  //             name: 'icon管理',
  //             path: 'icon',
  //             code:'03010000'
  //         }
  //     ]
  // }
];

const commonMenuData = [
  {
    name: '产品列表',
    path: 'product',
    icon: 'product',
    code: '0',
  },
  {
    name: '关联数据统计',
    path: 'linkedDatas',
    icon: 'linkedDatas',
    code: '0',
  },
  {
    name: '账号管理',
    path: 'account',
    icon: 'account',
    code: '02000000',
    isTab: true,
    children: [
      {
        name: '员工管理',
        path: 'staff',
        tabTitle: '员工管理',
        code: '02010000',
      },
      {
        name: '角色权限查看',
        path: 'rolePermissions',
        tabTitle: '角色权限查看',
        code: '02020000',
      },
    ],
  },
  {
    name: '后台数据管理',
    path: 'backgroundData',
    icon: 'backgroundData',
    code: '01000000',
    isTab: true,
    children: [
      {
        name: '角色管理',
        path: 'role',
        tabTitle: '角色管理',
        code: '01040000',
      },
      {
        name: '企业管理',
        path: 'enterprise',
        tabTitle: '企业管理',
        code: '01010000',
      },
      {
        name: '产品管理',
        path: 'product',
        tabTitle: '产品管理',
        code: '01030000',
      },
      {
        name: '类目管理',
        path: 'category',
        tabTitle: '类目管理',
        code: '01050000',
      },
      {
        name: '知识库项目管理',
        path: 'knowledgeProject',
        tabTitle: '知识库项目管理',
        code: '01020000',
      },
    ],
  },
  {
    name: '文章资源库',
    path: 'article',
    icon: 'backgroundData',
    code: '000',
    children: [
      {
        name: '文章管理',
        tabTitle: '文章管理',
        path: 'complete',
        code: '000',
      },
      {
        name: '官网文章管理',
        tabTitle: '官网文章管理',
        path: 'officialComplete',
        code: '000',
      },
      {
        name: '文章大类管理',
        tabTitle: '文章大类管理',
        path: 'superClass',
        code: '000',
      },
      {
        name: '文章小类管理',
        tabTitle: '文章小类管理',
        path: 'subclass',
        code: '000',
      },
      {
        name: '文章标签管理',
        tabTitle: '文章标签管理',
        path: 'label',
        code: '000',
      },
      {
        name: '文章操作日志',
        tabTitle: '文章操作日志',
        path: 'runlog',
        code: '000',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    path = parentPath + item.path;
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = (type = 'basic') => {
  if (type === 'basic') {
    return formatter(basicMenuData);
  } else if (type === 'common') {
    return formatter(commonMenuData);
  }
};
