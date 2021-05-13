import './Account.css';

import _constant from 'lodash/constant';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import SeoHelmet from '@/components/SeoHelmet';
import { IS_PRIVATE_CLOUD } from '@/config';
import { RootRoute } from '@/config/routes';
import { SeoPage } from '@/constants/seo';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Query from '@/utils/query';

import { SignupForm } from './components';

export type SignupProps = RouteComponentProps & {
  promo?: boolean;
};

const Signup: React.FC<ConnectedSignupFormProps & SignupProps> = ({ validateInvite, location, ...props }) => {
  const query = Query.parse(location.search);

  const [isValid, setValid] = React.useState<boolean | null>(null);

  useAsyncMountUnmount(async () => {
    if (!IS_PRIVATE_CLOUD) return;

    if (!query.invite) {
      setValid(false);
      return;
    }

    const isInviteValid = await validateInvite(query.invite).catch(_constant(false));

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

const mapDispatchToProps = {
  validateInvite: Workspace.validateInvite,
};

type ConnectedSignupFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(Signup) as React.FC<SignupProps>;
