import examRank from './ExamRank';
const examRankRouter =
  [
    {
      path: '/examRank/:examData',
      componentName: examRank,
      exact: true,
      // component: () => import(/* webpackChunkName: "medal" */ './login.jsx'),
      meta: {
        title: "考试排名",
        keepalive: true
      }
    },
  ];
export default examRankRouter;

