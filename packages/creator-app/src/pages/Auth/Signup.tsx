import './Account.css';

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import client from '@/client';
import SeoHelmet from '@/components/SeoHelmet';
import { IS_PRIVATE_CLOUD } from '@/config';
import { RootRoute } from '@/config/routes';
import { SeoPage } from '@/constants/seo';
import { useAsyncMountUnmount, useFeature } from '@/hooks';
import * as Query from '@/utils/query';

import { SignupForm } from './components';

export type SignupProps = RouteComponentProps & {
  promo?: boolean;
};

const Signup: React.FC<SignupProps> = ({ location, ...props }) => {
  const query = Query.parse(location.search);

  const [isValid, setValid] = React.useState<boolean | null>(null);
  const identityWorkspaceInvite = useFeature(Realtime.FeatureFlag.IDENTITY_WORKSPACE_INVITE);

  useAsyncMountUnmount(async () => {
    if (!IS_PRIVATE_CLOUD) return;

    if (!query.invite) {
      setValid(false);
      return;
    }

    const checkInviteMethod = identityWorkspaceInvite.isEnabled ? client.identity.workspaceInvitation.checkInvite : client.workspace.validateInvite;

    const isInviteValid = await checkInviteMethod(query.invite).catch(() => false);

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
