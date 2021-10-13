const path = require('path');
const route = require('./src/common/routers');
const theme = require('./src/components/theme');
const routeData = route.routes;
// ref: https://umijs.org/config/
export default {
  base: '/',
  publicPath: "/IPlatform/",
  hash: true,  //开启打包文件的hash值后缀
  history:'hash',
  treeShaking: true, //去除那些引用的但却没有使用的代码
  routes: routeData,
  alias: {
  	'@components': path.resolve(__dirname, './src/components'),
    '@utils': path.resolve(__dirname, './src/utils'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@routes': path.resolve(__dirname, './src/pages'),
    '@common': path.resolve(__dirname, './src/common')
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    //["@babel/plugin-proposal-decorators", {"legacy": true}],
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'umi-dva',
      dll: false,

      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }]
  ],
  theme,
  targets: {
    ie: 9,
    chrome: 49,
    firefox: 45,
    safari: 10
  },
  proxy: {
    "/ws": {
    	"target": "http://172.16.2.103:8080",
    	"changeOrigin": true,
    	"ws": true,
    	"secure": false,
      "pathRewrite": { "^/ws" : "" }
    },
  	"/icservice": {
    	"target": "http://172.16.2.103:8080/icservice",
    	"changeOrigin": true,
    	"pathRewrite": { "^/icservice" : "" }
    },
    "/ArticleService": {
    	"target": "http://172.16.2.125:8081/ArticleService",
    	"changeOrigin": true,
    	"pathRewrite": { "^/ArticleService" : "" }
    }
  }
}
