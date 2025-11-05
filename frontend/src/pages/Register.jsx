import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import RegisterForm from '@/forms/RegisterForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    // Remove confirm_password before sending to backend
    const { confirm_password, ...registerData } = values;
    dispatch(register({ registerData }));
  };

  useEffect(() => {
    if (isSuccess) {
      // After successful registration, redirect to login page
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <div className="clockworq-login-container">
          <Form
            layout="vertical"
            name="register_form"
            className="clockworq-login-form"
            onFinish={onFinish}
            autoComplete="off"
          >
            <RegisterForm />
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="clockworq-login-button"
                loading={isLoading}
                size="large"
                block
              >
                {translate('sign_up')}
              </Button>
            </Form.Item>
            <Form.Item style={{ marginTop: 16, textAlign: 'center' }}>
              <span>
                {translate('already_have_account')}{' '}
                <Link to="/login">{translate('log_in')}</Link>
              </span>
            </Form.Item>
          </Form>
        </div>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Create your account" />;
};

export default RegisterPage;

