import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const FlowStep = ({ label, isConnected, onClickPort, withPort = true, onClick, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      <Item
        label={label}
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        onClick={label && onClick}
        labelVariant="secondary"
        icon="flow"
        iconColor="#3c6997"
        placeholder="Connect a flow to this step"
      />
    </Section>
  </Step>
);

export default FlowStep;
