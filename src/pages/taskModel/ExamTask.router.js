import examTask from './ExamTask';
const examTaskRouter =
  [
    {
      path: '/examTask/:taskId',
      componentName: examTask,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "考试",
        keepalive: true
      }
    },
  ];
export default examTaskRouter;

