import { action } from '@storybook/addon-actions';
import React from 'react';

import { withStepDispatcher } from '@/../.storybook';
import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import { AccountLinkingStep, AccountLinkingStepProps } from '.';

const getProps = () => {
  const onClick = action('click');

  return {
    withPorts: true,
    isConfigured: true,
    onClick,
    isActive: false,
    portID: 'igu14g',
  };
};

export default {
  title: 'Creator/Steps/Account Linking Step',
  component: AccountLinkingStep,
};

const render = (props?: Partial<AccountLinkingStepProps>) => () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} {...props} />
  </NewBlock>
);

export const empty = withStepDispatcher()(render({ isConfigured: false }));

export const configured = withStepDispatcher()(render());

export const withoutPort = withStepDispatcher()(render({ withPorts: false }));

export const active = withStepDispatcher()(render({ isActive: true }));

export const connected = withStepDispatcher({ hasActiveLinks: true })(render());
