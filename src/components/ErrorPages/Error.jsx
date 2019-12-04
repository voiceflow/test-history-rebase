import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { Page404Wrapper } from './styled';

const Error = ({ icon = <SvgIcon icon="error500" size={80} />, title = 'Alexa, what happened?', message, children }) => (
  <Page404Wrapper>
    <div>{icon}</div>

    <label className="mt-3 dark">{title}</label>

    <p className="mt-1 mb-2">{message}</p>

    {children}
  </Page404Wrapper>
);

export default Error;
