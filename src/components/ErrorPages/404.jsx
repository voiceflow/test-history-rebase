import React from 'react';
import { Link } from 'react-router-dom';

import { Page404Wrapper } from './styled';

const Page404 = () => {
  return (
    <Page404Wrapper>
      <div>
        <img src="/images/404.svg" height={128} alt="404 Not Found" />
      </div>

      <h4>Alexa, where am I?</h4>

      <p>Sorry, the page you were looking for doesn't exist.</p>

      <Link to="/" className="btn btn-primary mt-3">
        Go to Dashboard
      </Link>
    </Page404Wrapper>
  );
};

export default Page404;
