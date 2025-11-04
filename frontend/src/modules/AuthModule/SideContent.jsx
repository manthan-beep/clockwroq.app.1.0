import { Layout, Typography } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function SideContent() {
  const translate = useLanguage();

  return (
    <Content className="clockworq-side-content">
      <div className="clockworq-side-wrapper">
        <div className="clockworq-logo-container">
          <Text className="clockworq-logo-text">clockworq.ai</Text>
        </div>

        <div className="clockworq-side-text">
          <Title level={1} className="clockworq-side-title">
            AI native CRM
          </Title>
        </div>

        <div className="clockworq-side-features">
          <div className="clockworq-feature-item">
            <div className="clockworq-feature-icon">✓</div>
            <Text className="clockworq-feature-text">Lead generation</Text>
          </div>
          <div className="clockworq-feature-item">
            <div className="clockworq-feature-icon">✓</div>
            <Text className="clockworq-feature-text">Enrichment and management</Text>
          </div>
        </div>
      </div>
    </Content>
  );
}
