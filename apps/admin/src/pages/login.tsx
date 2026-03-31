import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { history } from "umi";
import { post } from "@/utils/request";
import { setToken, setRefreshToken } from "@/utils/auth";

const { Title, Paragraph } = Typography;

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const result = await post<LoginResponse>("/auth/login", values);

      // 存储 Token
      setToken(result.accessToken);
      setRefreshToken(result.refreshToken);

      message.success("登录成功");

      // 跳转到首页
      history.push("/home");
    } catch (error: any) {
      message.error(error.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-96 shadow-lg">
        <Typography className="text-center mb-8">
          <Title level={2} className="mb-2">
            Welfal
          </Title>
          <Paragraph className="text-gray-500 mb-0">
            企业内部员工福利兑换平台
          </Paragraph>
        </Typography>

        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-gray-400 text-sm mt-4">
          <p>默认账号：admin / 123456</p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
