import survey from './Survey';
const SurveyRouter =
  [
    {
      path: '/Survey/:taskId',
      componentName: survey,
      exact: true,
      meta: {
        title: "课程详情",
        keepalive: true
      }
    },
  ];
export default SurveyRouter;