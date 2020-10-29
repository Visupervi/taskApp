import praiseList from './PraiseList';
const PraiseListRouter =
  [
    {
      path: '/praiseList/:praisemeg',
      componentName: praiseList,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        //title: "文章详情",
        keepalive: true
      }
    },
  ];
export default PraiseListRouter;
