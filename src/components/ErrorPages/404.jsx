import React from 'react';
import { Link } from 'react-router-dom';

import SvgIcon from '@/components/SvgIcon';

import { Page404Wrapper } from './styled';

const Page404 = () => {
  return (
    <Page404Wrapper>
      <div>
        <SvgIcon icon="error404" size={128} />
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
