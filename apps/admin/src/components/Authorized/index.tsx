import React from "react";
import { useModel } from "umi";

interface AuthorizedProps {
  permission?: string | string[];
  children: React.ReactNode;
  noMatch?: React.ReactNode;
}

/**
 * 权限控制组件
 * 根据用户权限决定是否渲染子组件
 */
const Authorized: React.FC<AuthorizedProps> = ({
  permission,
  children,
  noMatch = null,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    useModel("user");

  if (!permission) {
    return <>{children}</>;
  }

  let hasAccess = false;

  if (Array.isArray(permission)) {
    // 如果是数组，检查是否拥有任一权限
    hasAccess = hasAnyPermission(permission);
  } else {
    // 如果是字符串，检查是否拥有该权限
    hasAccess = hasPermission(permission);
  }

  return hasAccess ? <>{children}</> : <>{noMatch}</>;
};

export default Authorized;
