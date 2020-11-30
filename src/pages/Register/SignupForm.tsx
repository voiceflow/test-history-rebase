import './Account.css';

import _constant from 'lodash/constant';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { IS_PRIVATE_CLOUD } from '@/config';
import { RootRoute } from '@/config/routes';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useAsyncMountUnmount } from '@/hooks';
import { ConnectedProps } from '@/types';
import * as Query from '@/utils/query';

import PublicSignupForm from './PublicSignupForm';

export type SignupFormProps = RouteComponentProps & {
  promo?: boolean;
};

export const SignupForm: React.FC<ConnectedSignupFormProps & SignupFormProps> = ({ validateInvite, ...props }) => {
  const query = Query.parse(props.location.search);

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

  return <PublicSignupForm {...props} />;
};

const mapDispatchToProps = {
  validateInvite: Workspace.validateInvite,
};

type ConnectedSignupFormProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SignupForm) as React.FC<SignupFormProps>;
