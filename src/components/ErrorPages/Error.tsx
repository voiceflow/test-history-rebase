import React from 'react';

import { error500Graphic } from '@/assets';

import { Message, Page404Wrapper } from './styled';

interface ErrorProps {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  message?: React.ReactNode;
}

const PageError: React.FC<ErrorProps> = ({
  icon = <img src={error500Graphic} height={80} alt="500 Error" />,
  title = 'Alexa, what happened?',
  message,
  children,
}) => (
  <Page404Wrapper>
    <div>{icon}</div>

    {title && <label className="mt-3 dark">{title}</label>}

    {message && <Message className="mt-1 mb-2">{message}</Message>}

    {children}
  </Page404Wrapper>
);

export default PageError;
