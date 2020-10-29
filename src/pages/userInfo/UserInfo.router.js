import UserInfo from './UserInfo';
const UserInfoRouter =
  [
    {
      path: '/UserInfo/:userId',
      componentName: UserInfo,
      exact: true,
      meta: {
        title: "用户信息",
        keepalive: true
      }
    },
  ];
export default UserInfoRouter;