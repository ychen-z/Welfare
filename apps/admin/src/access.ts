import { isAuthenticated } from "./utils/auth";

export default (initialState: any) => {
  // 在这里可以根据用户权限返回不同的权限对象
  return {
    // 路由访问权限
    canAccessRoute: () => {
      return isAuthenticated();
    },
  };
};
