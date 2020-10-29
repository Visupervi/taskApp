import examExplain from './ExamExplain';
const examExplainRouter =
  [
    {
      path: '/examexplain/:examId',
      componentName: examExplain,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "在线考试",
        keepalive: true
      }
    },
  ];
export default examExplainRouter;

