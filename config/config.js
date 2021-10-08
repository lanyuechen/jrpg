import routes from './routes';

let publicPath = '/jrpg/';
if (process.env.NODE_ENV === 'production') {
  publicPath = 'https://cdn.jsdelivr.net/gh/lanyuechen/jrpg@gh-pages/';
}

// ref: https://umijs.org/config/
export default {
  title: 'JRPG',
  history: {
    type: 'hash'
  },
  hash: true,
  publicPath,  // jsdelivr cdn 加速
  routes,
  define: {
    PUBLIC_PATH: publicPath,
  },
  // dynamicImport: {
  //   loading: '@/components/loading',
  // },
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  targets: {
    chrome: 80,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
}
