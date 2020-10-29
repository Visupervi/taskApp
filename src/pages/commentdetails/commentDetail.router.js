import commentDetail from './CommentDetail';
const CommentDetailRouter =
  [
    {
      path: '/commentdetail/:articleId',
      componentName: commentDetail,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "评论详情",
        keepalive: true
      }
    },
  ];
export default CommentDetailRouter;
