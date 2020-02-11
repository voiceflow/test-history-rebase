import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const CardStep = ({ label, isConnected, onClickPort, withPort = true, isActive, image }) => (
  <Step isActive={isActive} image={image}>
    <Section>
      <Item
        label={label}
        isConnected={isConnected}
        onClickPort={onClickPort}
        withPort={withPort}
        labelVariant="secondary"
        icon="logs"
        iconColor="#616c60"
        placeholder="This card has no content"
      />
    </Section>
  </Step>
);

export default CardStep;
