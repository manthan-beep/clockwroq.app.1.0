import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function LoginForm() {
  const translate = useLanguage();
  return (
    <div className="clockworq-form-fields">
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your email',
          },
          {
            type: 'email',
            message: 'Please enter a valid email',
          },
        ]}
        style={{ marginBottom: 24 }}
      >
        <Input
          prefix={<UserOutlined className="clockworq-input-icon" />}
          placeholder="Enter your email"
          type="email"
          size="large"
          className="clockworq-input"
        />
      </Form.Item>
      
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password',
          },
        ]}
        style={{ marginBottom: 16 }}
      >
        <Input.Password
          prefix={<LockOutlined className="clockworq-input-icon" />}
          placeholder="Enter your password"
          size="large"
          className="clockworq-input"
        />
      </Form.Item>

      <Form.Item style={{ marginBottom: 24 }}>
        <div className="clockworq-form-options">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="clockworq-checkbox">{translate('Remember me')}</Checkbox>
          </Form.Item>
          <a className="clockworq-forgot-link" href="/forgetpassword">
            {translate('Forgot password')}
          </a>
        </div>
      </Form.Item>
    </div>
  );
}
