import React from 'react';
import { Link } from 'react-router-dom';

import { error404Graphic } from '@/assets';

import { Page404Wrapper } from './styled';

const Page404 = () => (
  <Page404Wrapper>
    <div>
      <img src={error404Graphic} height={128} alt="404 Not Found" />
    </div>

    <h4>Alexa, where am I?</h4>

    <p>Sorry, the page you were looking for doesn't exist.</p>

    <Link to="/" className="btn btn-primary mt-3">
      Go to Dashboard
    </Link>
  </Page404Wrapper>
);

export default Page404;
