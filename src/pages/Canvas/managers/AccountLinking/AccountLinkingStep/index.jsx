import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const AccountLinkingStep = ({ isConfigured, isConnected, onClickPort, withPort = true, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      <Item
        label={isConfigured && 'Sending Account Linking card'}
        labelVariant="secondary"
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        icon="accountLinking"
        iconColor="#645f5f"
        placeholder="Configure Account Linking"
      />
    </Section>
  </Step>
);

export default AccountLinkingStep;
