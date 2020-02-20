import { action } from '@storybook/addon-actions';
import React from 'react';

import NewBlock from '@/pages/Canvas/components/Block/NewBlock';

import AccountLinkingStep from '.';

const getProps = () => {
  const onClickPort = action('click port');

  return {
    onClickPort,
    isConfigured: true,
  };
};

export default {
  title: 'Creator/Steps/Account Linking Step',
  component: AccountLinkingStep,
};

export const empty = () => {
  const { onClickPort } = getProps();

  return (
    <NewBlock name="Account Linking Block">
      <AccountLinkingStep onClickPort={onClickPort} />
    </NewBlock>
  );
};

export const configured = () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} />
  </NewBlock>
);

export const withoutPort = () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} withPort={false} />
  </NewBlock>
);

export const active = () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} isActive />
  </NewBlock>
);

export const connected = () => (
  <NewBlock name="Account Linking Block">
    <AccountLinkingStep {...getProps()} isConnected />
  </NewBlock>
);
