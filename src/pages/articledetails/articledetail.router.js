import articleDetail from './ArticleDetail';
const ArticleDetailRouter =
  [
    {
      path: '/articleDetail/:articleId',
      componentName: articleDetail,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "文章详情",
        keepalive: true
      }
    },
  ];
export default ArticleDetailRouter;
