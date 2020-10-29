import taskTab from './TaskTabs';
const taskTabRouter =
  [
    {
      path: '/taskTabs',
      componentName: taskTab,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "历史任务",
        keepalive: true
      }
    },
  ];
export default taskTabRouter;

