import useLanguage from '@/locale/useLanguage';

import { Layout, Col, Typography } from 'antd';

import AuthLayout from '@/layout/AuthLayout';
import SideContent from './SideContent';

import logo from '@/style/images/idurar-crm-erp.svg';

const { Content } = Layout;
const { Title, Text } = Typography;

const AuthModule = ({ authContent, AUTH_TITLE, isForRegistre = false }) => {
  const translate = useLanguage();
  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content className="clockworq-auth-content">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <div className="clockworq-mobile-logo">
            <img
              src={logo}
              alt="Logo"
              height={48}
              width={160}
            />
          </div>
        </Col>
        
        <div className="clockworq-auth-header">
          <Title level={1} className="clockworq-auth-title">
            {translate(AUTH_TITLE)}
          </Title>
          <Text className="clockworq-auth-subtitle">
            Sign in to your account to continue
          </Text>
        </div>

        <div className="clockworq-auth-form-wrapper">
          {authContent}
        </div>
      </Content>
    </AuthLayout>
  );
};

export default AuthModule;
