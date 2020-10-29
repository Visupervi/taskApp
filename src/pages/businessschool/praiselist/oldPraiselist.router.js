import oldPraiselist from './oldPraiselist';
const OldPraiselistRouter =
  [
    {
      path: '/oldPraiselist/:praiseType',
      componentName: oldPraiselist,
      exact: true,
      meta: {
        title: "点赞列表",
        keepalive: true
      }
    },
  ];
export default OldPraiselistRouter;