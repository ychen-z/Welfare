import { defineConfig } from "@umijs/max";

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: "Welfal",
  },
  // 代理配置
  proxy: {
    "/api": {
      target: "http://localhost:3000",
      changeOrigin: true,
    },
  },
  // 路由配置
  routes: [
    {
      path: "/",
      redirect: "/home",
    },
    {
      name: "首页",
      path: "/home",
      component: "./index",
      access: "canAccessRoute",
    },
    {
      name: "登录",
      path: "/login",
      component: "./login",
      layout: false,
    },
  ],
  npmClient: "pnpm",
  tailwindcss: {},
  theme: {
    "primary-color": "#1890ff",
  },
});
