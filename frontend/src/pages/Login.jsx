import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <div className="clockworq-login-container">
          <Form
            layout="vertical"
            name="normal_login"
            className="clockworq-login-form"
            initialValues={{
              remember: true,
              email:'admin@admin.com',
              password:'admin123',
            }}
            onFinish={onFinish}
          >
            <LoginForm />
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="clockworq-login-button"
                loading={isLoading}
                size="large"
                block
              >
                {translate('Log in')}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Welcome back" />;
};

export default LoginPage;
