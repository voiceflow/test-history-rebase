import './Account.css';

import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import SeoHelmet from '@/components/SeoHelmet';
import { IS_PRIVATE_CLOUD } from '@/config';
import { RootRoute } from '@/config/routes';
import { SeoPage } from '@/constants/seo';
import { useAsyncMountUnmount } from '@/hooks';
import * as Query from '@/utils/query';

import { SignupForm } from './components';

export type SignupProps = RouteComponentProps & {
  promo?: boolean;
};

const Signup: React.FC<SignupProps> = ({ location, ...props }) => {
  const query = Query.parse(location.search);

  const [isValid, setValid] = React.useState<boolean | null>(null);

  useAsyncMountUnmount(async () => {
    if (!IS_PRIVATE_CLOUD) return;

    if (!query.invite) {
      setValid(false);
      return;
    }

    const isInviteValid = await client.identity.workspaceInvitation.checkInvite(query.invite).catch(() => false);

    setValid(!!isInviteValid);
  });

  if (IS_PRIVATE_CLOUD) {
    if (isValid === null) return null;

    if (!isValid) return <Redirect to={RootRoute.LOGIN} />;
  }

  return (
    <>
      <SeoHelmet page={SeoPage.SIGNUP} />
      <SignupForm query={query} {...props} />
    </>
  );
};

export default Signup;
