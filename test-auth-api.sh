#!/bin/bash

# 认证接口集成测试脚本
# 用法: ./test-auth-api.sh

echo "======================================"
echo "   Welfal 认证接口集成测试"
echo "======================================"
echo ""

BASE_URL="http://localhost:3000/api"

# 测试 1: 健康检查 (无需登录)
echo "1️⃣  测试健康检查接口 (无需认证)"
echo "GET $BASE_URL/health"
curl -s -X GET $BASE_URL/health | jq '.'
echo ""
echo "--------------------------------------"
echo ""

# 测试 2: 登录获取 Token
echo "2️⃣  测试登录接口"
echo "POST $BASE_URL/auth/login"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}')

echo "$LOGIN_RESPONSE" | jq '.'

# 提取 Token
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.refreshToken')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo "❌ 登录失败，无法获取 Token"
  exit 1
fi

echo ""
echo "✅ Access Token: ${ACCESS_TOKEN:0:50}..."
echo "✅ Refresh Token: ${REFRESH_TOKEN:0:50}..."
echo ""
echo "--------------------------------------"
echo ""

# 测试 3: 获取用户信息 (需要认证)
echo "3️⃣  测试获取用户信息接口 (需要认证)"
echo "GET $BASE_URL/auth/profile"
curl -s -X GET $BASE_URL/auth/profile \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo "--------------------------------------"
echo ""

# 测试 4: 测试权限控制
echo "4️⃣  测试权限控制接口 (需要 sys:user:view 权限)"
echo "GET $BASE_URL/auth/test/permission"
curl -s -X GET $BASE_URL/auth/test/permission \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.'
echo ""
echo "--------------------------------------"
echo ""

# 测试 5: 刷新 Token
echo "5️⃣  测试刷新 Token 接口"
echo "POST $BASE_URL/auth/refresh"
REFRESH_RESPONSE=$(curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")

echo "$REFRESH_RESPONSE" | jq '.'

NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.data.accessToken')
echo ""
echo "✅ New Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
echo ""
echo "--------------------------------------"
echo ""

# 测试 6: 登出
echo "6️⃣  测试登出接口"
echo "POST $BASE_URL/auth/logout"
curl -s -X POST $BASE_URL/auth/logout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | jq '.'
echo ""
echo "--------------------------------------"
echo ""

# 测试 7: 验证登出后 Token 失效
echo "7️⃣  验证登出后 Refresh Token 已失效"
echo "POST $BASE_URL/auth/refresh (应该失败)"
curl -s -X POST $BASE_URL/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}" | jq '.'
echo ""
echo "======================================"
echo "   测试完成！"
echo "======================================"
