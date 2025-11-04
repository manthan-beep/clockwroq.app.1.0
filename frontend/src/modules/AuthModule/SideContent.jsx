import { Layout, Typography } from 'antd';
import logo from '@/style/images/idurar-crm-erp.svg';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content className="clockworq-side-content">
      <div className="clockworq-side-wrapper">
        <div className="clockworq-logo-container">
          <img
            src={logo}
            alt="IDURAR ERP CRM"
            className="clockworq-logo"
            height={56}
            width={200}
          />
        </div>

        <div className="clockworq-side-text">
          <Title level={1} className="clockworq-side-title">
            Free Open Source ERP / CRM
          </Title>
          <Text className="clockworq-side-description">
            Accounting / Invoicing / Quote App based on Node.js React.js Ant Design
          </Text>
        </div>

        <div className="clockworq-side-features">
          <div className="clockworq-feature-item">
            <div className="clockworq-feature-icon">✓</div>
            <Text className="clockworq-feature-text">Invoice Management</Text>
          </div>
          <div className="clockworq-feature-item">
            <div className="clockworq-feature-icon">✓</div>
            <Text className="clockworq-feature-text">Payment Tracking</Text>
          </div>
          <div className="clockworq-feature-item">
            <div className="clockworq-feature-icon">✓</div>
            <Text className="clockworq-feature-text">Customer Management</Text>
          </div>
        </div>
      </div>
    </Content>
  );
}
