import oldCommentdetail from './oldCommentdetail';
const OldCommentdetailRouter =
  [
    {
      path: '/oldCommentdetail/:commentId',
      componentName: oldCommentdetail,
      exact: true,
      meta: {
        title: "回复详情",
        keepalive: true
      }
    },
  ];
export default OldCommentdetailRouter;