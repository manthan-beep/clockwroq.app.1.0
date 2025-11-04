import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;
const { Link } = Typography;

const FooterContent = () => (
  <Footer 
    style={{ 
      textAlign: 'center',
      background: '#f0f2f5',
      padding: '16px 50px',
      borderTop: '1px solid #e8e8e8'
    }}
  >
    <Link 
      href="https://www.clockworq.ai" 
      target="_blank"
      style={{ 
        color: '#7dd3fc',
        fontSize: '14px',
        fontWeight: 500
      }}
    >
      www.clockworq.ai
    </Link>
  </Footer>
);

export default FooterContent;
