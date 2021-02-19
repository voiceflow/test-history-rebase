import { withStepContext } from '_storybook';
import React from 'react';

import Block from '@/pages/Canvas/components/Block';

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
  <Block name="Account Linking Block">
    <AccountLinkingStep {...getProps()} {...props} />
  </Block>
);

export const empty = withStepContext()(render({ isConfigured: false }));

export const configured = withStepContext()(render());

export const withoutPort = withStepContext({ withPorts: false })(render());

export const active = withStepContext({ isActive: true })(render());

export const connected = withStepContext({ isConnected: true })(render());
