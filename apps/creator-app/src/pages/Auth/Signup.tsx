import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SeoHelmet from '@/components/SeoHelmet';
import { IS_PRIVATE_CLOUD } from '@/config';
import { RootRoute } from '@/config/routes';
import { SeoPage } from '@/constants/seo';
import * as Query from '@/utils/query';

import { SignupForm } from './components';

const Signup: React.FC<RouteComponentProps> = ({ location, ...props }) => {
  const query = Query.parse(location.search);

  if (IS_PRIVATE_CLOUD && !query.invite) return <Redirect to={RootRoute.LOGIN} />;

  return (
    <>
      <SeoHelmet page={SeoPage.SIGNUP} />
      <SignupForm query={query} {...props} />
    </>
  );
};

export default Signup;
