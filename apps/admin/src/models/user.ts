import { useState, useCallback } from "react";
import { history } from "umi";
import { getCurrentUser, clearAuth } from "@/utils/auth";

interface UserInfo {
  userId: number;
  username: string;
  roles: string[];
  permissions: string[];
}

export default () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  // 获取用户信息
  const fetchUserInfo = useCallback(() => {
    const user = getCurrentUser();
    setUserInfo(user);
    return user;
  }, []);

  // 登出
  const logout = useCallback(() => {
    clearAuth();
    setUserInfo(null);
    history.push("/login");
  }, []);

  // 检查是否有权限
  const hasPermission = useCallback(
    (permission: string) => {
      if (!userInfo) return false;
      return userInfo.permissions.includes(permission);
    },
    [userInfo],
  );

  // 检查是否有任一权限
  const hasAnyPermission = useCallback(
    (permissions: string[]) => {
      if (!userInfo) return false;
      return permissions.some((p) => userInfo.permissions.includes(p));
    },
    [userInfo],
  );

  // 检查是否有所有权限
  const hasAllPermissions = useCallback(
    (permissions: string[]) => {
      if (!userInfo) return false;
      return permissions.every((p) => userInfo.permissions.includes(p));
    },
    [userInfo],
  );

  return {
    userInfo,
    fetchUserInfo,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};
