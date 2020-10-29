import onLineExam from './OnLineExam';
const onLineExamRouter =
  [
    {
      path: '/onLineExam',
      componentName: onLineExam,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "在线考试",
        keepalive: true
      }
    },
  ];
export default onLineExamRouter;

