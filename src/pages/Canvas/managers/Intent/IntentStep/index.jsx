import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const IntentStep = ({ label, isConnected, onClickPort, withPort = true, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      <Item
        label={label}
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        icon="user"
        iconColor="#5589eb"
        placeholder="Create or select an intent"
      />
    </Section>
  </Step>
);

export default IntentStep;
