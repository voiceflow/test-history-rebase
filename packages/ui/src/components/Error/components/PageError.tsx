import React from 'react';

import { error500Graphic } from '../../../assets';
import { styled } from '../../../styles';
import Page404Wrapper from './Page404Wrapper';

export const ErrorDescription = styled.p`
  max-width: 360px;
`;

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

    {message && <ErrorDescription className="mt-1 mb-2">{message}</ErrorDescription>}

    {children}
  </Page404Wrapper>
);

export default PageError;
