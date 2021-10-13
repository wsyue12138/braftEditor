exports.routes = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { exact: true, path: '/user', redirect: '/user/login' },
      { path: '/user/login', title: '登录', component: '../pages/Login/Login' },
      { path: '/user/reset', title: '重置密码', component: '../pages/Reset/Reset' },
    ],
  },
  {
    path: '/common',
    Routes: ['./src/components/Authorized'],
    component: '../layouts/CommonLayout',
    routes: [
      { exact: true, path: '/common', redirect: '/common/product' },
      {
        path: '/common/product',
        title: '产品选择',
        component: '../pages/ProductSelection/ProductSelection',
      },
      {
        path: '/common/linkedDatas',
        title: '关联数据统计',
        component: '../pages/LinkedDatas/LinkedDatas',
      },
      {
        path: '/common/account',
        component: '../pages/AccountManagement/Layout',
        routes: [
          { exact: true, path: '/common/account', component: '../pages/AccountManagement' },
          {
            path: '/common/account/staff',
            title: '账号管理-员工管理',
            name: '员工管理',
            code: '02010000',
            component: '../pages/AccountManagement/Staff/Staff',
          },
          {
            path: '/common/account/rolePermissions',
            title: '账号管理-角色权限查看',
            name: '角色权限查看',
            code: '02020000',
            component: '../pages/AccountManagement/RolePermissions/RolePermissions',
          },
        ],
      },
      {
        path: '/common/backgroundData',
        component: '../pages/BackgroundData/Layout',
        routes: [
          { exact: true, path: '/common/backgroundData', component: '../pages/BackgroundData' },
          {
            path: '/common/backgroundData/role',
            title: '后台数据管理-角色管理',
            name: '角色管理',
            code: '01040000',
            component: '../pages/BackgroundData/roleManagement/roleManagement',
          },
          {
            path: '/common/backgroundData/enterprise',
            title: '后台数据管理-企业管理',
            name: '企业管理',
            code: '01010000',
            component: '../pages/BackgroundData/enterpriseManagement/enterpriseManagement',
          },
          {
            path: '/common/backgroundData/product',
            title: '后台数据管理-产品管理',
            name: '产品管理',
            code: '01030000',
            component: '../pages/BackgroundData/productManagement/productManagement',
          },
          {
            path: '/common/backgroundData/category',
            title: '后台数据管理-类目管理',
            name: '类目管理',
            code: '01050000',
            component: '../pages/BackgroundData/category/category',
          },
          {
            path: '/common/backgroundData/knowledgeProject',
            title: '后台数据管理-知识库项目管理',
            name: '知识库项目管理',
            code: '01020000',
            component:
              '../pages/BackgroundData/KnowledgeProjectManagement/KnowledgeProjectManagement',
          },
        ],
      },
      {
        path: '/common/article',
        component: '../pages/Article/Layout',
        routes: [
          { exact: true, path: '/common/article', component: '../pages/Article' },
          {
            title: '文章资源库-文章管理',
            name:'文章管理',
            path: '/common/article/complete',
            component: '../pages/Article/Complete/Complete',
          },
          {
            title: '文章资源库-官网文章管理',
            name:'官网文章管理',
            path: '/common/article/officialComplete',
            component: '../pages/Article/OfficialComplete/OfficialComplete',
          },
          {
            title: '文章资源库-文章大类管理',
            name:'文章大类管理',
            path: '/common/article/superClass',
            component: '../pages/Article/SuperClass/SuperClass',
          },
          {
            title: '文章资源库-文章小类管理',
            name:'文章小类管理',
            path: '/common/article/subclass',
            component: '../pages/Article/Subclass/Subclass',
          },
          {
            title: '文章资源库-文章标签管理',
            name:'文章标签管理',
            path: '/common/article/label',
            component: '../pages/Article/Label/Label',
          },
          {
            title: '文章资源库-文章操作日志',
            name:'文章操作日志',
            path: '/common/article/runlog',
            component: '../pages/Article/Runlog/Runlog',
          },
        ],
      },
    ],
  },
  {
    path: '/',
    Routes: ['./src/components/Authorized'],
    component: '../layouts/BasicLayout',
    routes: [
      { exact: true, path: '/', redirect: '/welcome' },
      { title: '产品首页', path: '/welcome', component: '../pages/Welcome/Welcome' },
      {
        path: '/dataAnalysis',
        component: '../pages/DataAnalysis',
        routes: [
          { exact: true, path: '/dataAnalysis', redirect: '/dataAnalysis/dataStatistics' },
          {
            title: '数据分析-知识库数据分析',
            path: '/dataAnalysis/dataStatistics',
            component: '../pages/DataAnalysis/dataStatistics/dataStatistics',
          },
          {
            path: '/dataAnalysis/detailed',
            component: '../pages/DataAnalysis/Detailed/Layout',
            routes: [
              {
                exact: true,
                path: '/dataAnalysis/detailed',
                component: '../pages/DataAnalysis/Detailed',
              },
              {
                title: '知识库明细查询-问题明细',
                name: '问题明细',
                code: '04000000',
                path: '/dataAnalysis/detailed/problemDetails',
                component: '../pages/DataAnalysis/Detailed/ProblemDetails/ProblemDetails',
              },
              {
                title: '知识库明细查询-服务功能明细',
                name: '服务功能明细',
                code: '04000000',
                path: '/dataAnalysis/detailed/serviceDetails',
                component: '../pages/DataAnalysis/Detailed/ServiceDetails/ServiceDetails',
              },
              {
                title: '知识库明细查询-服务质量明细',
                name: '服务质量明细',
                code: '04000000',
                path: '/dataAnalysis/detailed/serviceQualityDetails',
                component:
                  '../pages/DataAnalysis/Detailed/ServiceQualityDetails/ServiceQualityDetails',
              },
            ],
          },
        ],
      },
      {
        path: '/knowledgeManagement',
        component: '../pages/KnowledgeManagement',
        routes: [
          {
            exact: true,
            path: '/knowledgeManagement',
            redirect: '/knowledgeManagement/knowledgeBase',
          },
          {
            path: '/knowledgeManagement/knowledgeBase',
            component: '../pages/KnowledgeManagement/KnowledgeBase/Layout',
            routes: [
              {
                exact: true,
                path: '/knowledgeManagement/knowledgeBase',
                component: '../pages/KnowledgeManagement/KnowledgeBase',
              },
              {
                title: '知识库管理-单轮',
                name: '单轮',
                path: '/knowledgeManagement/knowledgeBase/single',
                component: '../pages/KnowledgeManagement/KnowledgeBase/Single/Single',
              },
              {
                title: '知识库管理-多轮',
                name: '多轮',
                path: '/knowledgeManagement/knowledgeBase/multiple',
                component: '../pages/KnowledgeManagement/KnowledgeBase/Multiple/Multiple',
              },
            ],
          },
          {
            title: '知识管理-未知问题学习',
            path: '/knowledgeManagement/unknownQuestion',
            component: '../pages/KnowledgeManagement/UnknownQuestion/UnknownQuestion',
          },
          {
            title: '知识管理-未解决问题学习',
            path: '/knowledgeManagement/unresolvedQuestion',
            component: '../pages/KnowledgeManagement/UnresolvedQuestion/UnresolvedQuestion',
          },
          {
            title: '知识管理-历史记录',
            path: '/knowledgeManagement/history',
            component: '../pages/KnowledgeManagement/history/history',
          },
          {
            title: '知识管理-工单管理',
            path: '/knowledgeManagement/workforce',
            component: '../pages/KnowledgeManagement/Workforce/Workforce',
          },
        ],
      },
      {
        path: '/manMachine',
        component: '../pages/ManMachine',
        routes: [
          { exact: true, path: '/manMachine', redirect: '/manMachine/message' },
          {
            title: '人机协作-留言记录',
            path: '/manMachine/message',
            component: '../pages/ManMachine/Message/Message',
          },
          {
            title: '人机协作-在线客服',
            path: '/manMachine/customerService',
            component: '../pages/ManMachine/CustomerService/CustomerService',
          },
          {
            title: '人机协作-快捷回复管理',
            path: '/manMachine/quickReply',
            component: '../pages/ManMachine/QuickReply/QuickReply',
          },
          {
            title: '人机协作-历史会话',
            path: '/manMachine/conversation',
            component: '../pages/ManMachine/Conversation/Conversation',
          },
          {
            title: '人机协作-工作报表',
            path: '/manMachine/reportForm',
            component: '../pages/ManMachine/ReportForm/ReportForm',
          },
          {
            title: '人机协作-考勤信息',
            path: '/manMachine/attendance',
            component: '../pages/ManMachine/Attendance/Attendance',
          },
        ],
      },
      {
        path: '/productService',
        component: '../pages/ProductService',
        routes: [
          { exact: true, path: '/productService', redirect: '/productService/account' },
          {
            title: '产品服务-产品账号管理',
            path: '/productService/account',
            component: '../pages/ProductService/Account/Account',
          },
        ],
      },
      { path: '/monitor', title: '数据监控', component: '../pages/Monitor/Monitor' },
      { path: '/statistics', title: '数据分析', component: '../pages/Statistics/Statistics' },
      // {
      //     path: '/applets',
      //     component: '../pages/Applets',
      //     routes:[
      //         { exact:true, path:'/applets', redirect:'/applets/banner'},
      //         {
      //             title: '小程序管理-banner管理',
      //             path: '/applets/banner',
      //             component: '../pages/Applets/Banner/Banner'
      //         },
      //         {
      //             title: '小程序管理-icon管理',
      //             path: '/applets/icon',
      //             component: '../pages/Applets/Icon/Icon'
      //         }
      //     ]
      // }
    ],
  },
];
