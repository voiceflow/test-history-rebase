import { error500Graphic } from '@ui/assets';
import { colors, styled, ThemeColor } from '@ui/styles';
import React from 'react';

import Page404Wrapper from './Page404Wrapper';

const TitleLabel = styled.div`
  color: ${colors(ThemeColor.PRIMARY)};
  display: block;
  margin-top: 16px;
  font-weight: 600;
  font-size: 15px;
`;

export const ErrorDescription = styled.p`
  max-width: 252px;
  color: ${colors(ThemeColor.SECONDARY)};
  margin-bottom: 24px;
  text-align: center;
`;
interface ErrorProps extends React.PropsWithChildren {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  message?: React.ReactNode;
}

const PageError: React.FC<ErrorProps> = ({
  icon = <img src={error500Graphic} height={80} alt="500 Error" />,
  title = 'Sorry, something went wrong',
  message,
  children,
}) => (
  <Page404Wrapper>
    <div>{icon}</div>

    {title && <TitleLabel>{title}</TitleLabel>}

    {message && <ErrorDescription>{message}</ErrorDescription>}

    {children}
  </Page404Wrapper>
);

export default PageError;
