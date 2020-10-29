import XXXXXX from './ExamList';
const LexamListRouter =
  [
    {
      path: '/XXXXXX/:courseId',
      componentName:XXXXXX ,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "考试列表",
        keepalive: true
      }
    },
  ];
export default LexamListRouter;

