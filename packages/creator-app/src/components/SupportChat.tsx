import * as Realtime from '@voiceflow/realtime-sdk';
import { useSetup } from '@voiceflow/ui';
import React from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import * as Account from '@/ducks/account';
import { useFeature, useSelector } from '@/hooks';
import * as Support from '@/vendors/support';

const NO_RENDER_PAGES = [Path.PUBLIC_PROTOTYPE, Path.PROJECT_DEMO, Path.PROJECT_PROTOTYPE];

const SupportChat: React.FC = () => {
  Support.useSupportChat();

  return null;
};

const SupportRouter: React.FC = () => {
  const assistantIntegration = useFeature(Realtime.FeatureFlag.ASSISTANT_INTEGRATION);
  const isLoggedIn = useSelector(Account.isLoggedInSelector);
  const shouldRender = !useRouteMatch(NO_RENDER_PAGES);

  // TODO: have the support board chat start out hidden to avoid needing this
  useSetup(() => Support.hideChat());

  if (!assistantIntegration.isEnabled) return null;
  if (!isLoggedIn) return null;
  if (!shouldRender) return null;

  return <SupportChat />;
};

export default React.memo(SupportRouter);
