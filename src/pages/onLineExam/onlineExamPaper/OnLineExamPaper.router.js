import onlineExamPaper from './onlineExamPaper';
const onlineExamPaperRouter =
  [
    {
      path: '/onlineExamPaper/:taskId',
      componentName: onlineExamPaper,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "在线考试",
        keepalive: true
      }
    },
  ];
export default onlineExamPaperRouter;

