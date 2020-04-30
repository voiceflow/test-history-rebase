import React from 'react';

import { Message, Page404Wrapper } from './styled';

const Error = ({ icon = <img src="/images/500.svg" height={80} alt="500 Error" />, title = 'Alexa, what happened?', message, children }) => (
  <Page404Wrapper>
    <div>{icon}</div>

    <label className="mt-3 dark">{title}</label>

    <Message className="mt-1 mb-2">{message}</Message>

    {children}
  </Page404Wrapper>
);

export default Error;
