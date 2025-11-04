import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'clockworq.ai'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.clockworq.ai">www.clockworq.ai</a>{' '}
          </p>
        </>
      }
    />
  );
};

export default About;
