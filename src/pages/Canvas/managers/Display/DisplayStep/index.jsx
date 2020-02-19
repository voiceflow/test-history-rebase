import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const DisplayStep = ({ label, isConnected, onClickPort, withPort = true, isActive, image }) => (
  <Step isActive={isActive} image={image}>
    <Section>
      <Item
        label={label}
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        labelVariant="secondary"
        icon="blocks"
        iconColor="#3c6997"
        placeholder="Add a multimodal display"
      />
    </Section>
  </Step>
);

export default DisplayStep;
