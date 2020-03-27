import React from 'react';

import { withStepContext } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { AccountLinkingStep, AccountLinkingStepProps } from '.';

const getProps = () => ({
  isConfigured: true,
  portID: 'igu14g',
});

export default {
  title: 'Creator/Steps/Account Linking Step',
  component: AccountLinkingStep,
};

const render = (props?: Partial<AccountLinkingStepProps>) => () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepContext()(render({ isConfigured: false }));

export const configured = withStepContext()(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
