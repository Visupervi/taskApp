import businnessSchoolDetail from './BusinessSchoolDetail';
const BusinessSchoolDetailRouter =
  [
    {
      path: '/businessSchoolDetail/:bookId',
      componentName: businnessSchoolDetail,
      exact: true,
      meta: {
        title: "课程详情",
        keepalive: true
      }
    },
  ];
export default BusinessSchoolDetailRouter;
