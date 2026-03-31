import { history } from "umi";
import { isAuthenticated } from "./utils/auth";

export function onRouteChange({ location }: any) {
  // 路由切换时检查登录状态
  const isLoginPage = location.pathname === "/login";
  const isLoggedIn = isAuthenticated();

  if (!isLoginPage && !isLoggedIn) {
    // 未登录且不在登录页，跳转到登录页
    history.push("/login");
  } else if (isLoginPage && isLoggedIn) {
    // 已登录但在登录页，跳转到首页
    history.push("/home");
  }
}

export async function getInitialState() {
  return {
    name: "Welfal",
  };
}
