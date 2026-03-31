import React, { useEffect, useState } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  Alert,
  Spin,
  Typography,
  Button,
  Space,
} from "antd";
import {
  GiftOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  WalletOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useModel } from "umi";
import { get } from "@/utils/request";

const { Title, Paragraph } = Typography;

interface HealthStatus {
  timestamp: string;
  status: string;
}

const HomePage: React.FC = () => {
  const { userInfo, fetchUserInfo, logout } = useModel("user");
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取用户信息
    fetchUserInfo();
    // 调用健康检查接口
    const checkHealth = async () => {
      try {
        const data = await get<HealthStatus>("/health");
        setHealthStatus(data);
        setError(null);
      } catch (err) {
        setError("无法连接到后端服务");
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="p-6">
      <Typography className="mb-6">
        <Title level={2}>欢迎使用 Welfal 福利兑换平台</Title>
        <Paragraph className="text-gray-500">
          企业内部员工福利积分兑换系统，支持积分发放、商品管理、订单兑换等功能。
        </Paragraph>
      </Typography>

      {/* 用户信息 */}
      {userInfo && (
        <Card className="mb-6">
          <Space>
            <UserOutlined style={{ fontSize: 20 }} />
            <span>
              欢迎回来，<strong>{userInfo.username}</strong>！
            </span>
            <Button type="link" icon={<LogoutOutlined />} onClick={logout}>
              登出
            </Button>
          </Space>
        </Card>
      )}

      {/* 后端连接状态 */}
      <Card className="mb-6" title="系统状态">
        {loading ? (
          <Spin tip="检测后端服务连接中..." />
        ) : error ? (
          <Alert message={error} type="error" showIcon />
        ) : (
          <Alert
            message={`后端服务运行正常 - ${healthStatus?.timestamp}`}
            type="success"
            showIcon
          />
        )}
      </Card>

      {/* 统计卡片（占位） */}
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="我的积分"
              value={0}
              prefix={<WalletOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="可兑换商品"
              value={0}
              prefix={<GiftOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="我的订单"
              value={0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={0}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
