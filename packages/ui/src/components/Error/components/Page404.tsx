import { error404Graphic } from '@ui/assets';
import React from 'react';

import Page404Wrapper from './Page404Wrapper';

const Page404: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Page404Wrapper>
    <div>
      <img src={error404Graphic} height={128} alt="404 Not Found" />
    </div>

    <h4>Alexa, where am I?</h4>

    <p>Sorry, the page you were looking for doesn't exist.</p>

    {children}
  </Page404Wrapper>
);

export default Page404;
