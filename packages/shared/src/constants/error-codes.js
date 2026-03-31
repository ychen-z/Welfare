"use strict";
/**
 * 错误码定义
 *
 * 错误码规范：
 * - 0: 成功
 * - 1xxx: 通用错误
 * - 2xxx: 认证授权错误
 * - 3xxx: 积分相关错误
 * - 4xxx: 商品相关错误
 * - 5xxx: 订单相关错误
 */
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.ErrorCodes = void 0;
exports.ErrorCodes = {
    // 成功
    SUCCESS: 0,
    // 通用错误 1xxx
    UNKNOWN_ERROR: 1000,
    PARAM_INVALID: 1001,
    RESOURCE_NOT_FOUND: 1002,
    OPERATION_FAILED: 1003,
    DUPLICATE_ENTRY: 1004,
    // 认证授权错误 2xxx
    UNAUTHORIZED: 2000,
    TOKEN_EXPIRED: 2001,
    TOKEN_INVALID: 2002,
    PERMISSION_DENIED: 2003,
    ACCOUNT_DISABLED: 2004,
    PASSWORD_WRONG: 2005,
    // 积分相关错误 3xxx
    POINTS_INSUFFICIENT: 3001,
    POINTS_EXPIRED: 3002,
    POINTS_ALREADY_GRANTED: 3003,
    // 商品相关错误 4xxx
    PRODUCT_NOT_FOUND: 4001,
    PRODUCT_OFF_SHELF: 4002,
    STOCK_INSUFFICIENT: 4003,
    EXCHANGE_LIMIT_EXCEEDED: 4004,
    // 订单相关错误 5xxx
    ORDER_NOT_FOUND: 5001,
    ORDER_STATUS_INVALID: 5002,
    ORDER_CANCEL_FAILED: 5003,
};
/**
 * 错误码对应的默认消息
 */
exports.ErrorMessages = (_a = {},
    _a[exports.ErrorCodes.SUCCESS] = "操作成功",
    // 通用错误
    _a[exports.ErrorCodes.UNKNOWN_ERROR] = "系统错误，请稍后重试",
    _a[exports.ErrorCodes.PARAM_INVALID] = "参数错误",
    _a[exports.ErrorCodes.RESOURCE_NOT_FOUND] = "资源不存在",
    _a[exports.ErrorCodes.OPERATION_FAILED] = "操作失败",
    _a[exports.ErrorCodes.DUPLICATE_ENTRY] = "数据已存在",
    // 认证授权错误
    _a[exports.ErrorCodes.UNAUTHORIZED] = "请先登录",
    _a[exports.ErrorCodes.TOKEN_EXPIRED] = "登录已过期，请重新登录",
    _a[exports.ErrorCodes.TOKEN_INVALID] = "无效的令牌",
    _a[exports.ErrorCodes.PERMISSION_DENIED] = "没有操作权限",
    _a[exports.ErrorCodes.ACCOUNT_DISABLED] = "账号已被禁用",
    _a[exports.ErrorCodes.PASSWORD_WRONG] = "密码错误",
    // 积分相关错误
    _a[exports.ErrorCodes.POINTS_INSUFFICIENT] = "积分不足",
    _a[exports.ErrorCodes.POINTS_EXPIRED] = "积分已过期",
    _a[exports.ErrorCodes.POINTS_ALREADY_GRANTED] = "积分已发放",
    // 商品相关错误
    _a[exports.ErrorCodes.PRODUCT_NOT_FOUND] = "商品不存在",
    _a[exports.ErrorCodes.PRODUCT_OFF_SHELF] = "商品已下架",
    _a[exports.ErrorCodes.STOCK_INSUFFICIENT] = "库存不足",
    _a[exports.ErrorCodes.EXCHANGE_LIMIT_EXCEEDED] = "超出兑换限制",
    // 订单相关错误
    _a[exports.ErrorCodes.ORDER_NOT_FOUND] = "订单不存在",
    _a[exports.ErrorCodes.ORDER_STATUS_INVALID] = "订单状态无效",
    _a[exports.ErrorCodes.ORDER_CANCEL_FAILED] = "订单取消失败",
    _a);
