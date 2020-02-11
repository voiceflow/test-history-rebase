import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const RandomStep = ({ paths, isActive }) => (
  <Step isActive={isActive}>
    <Section>
      {paths.map((path, index) => (
        <Item
          label={`Path ${index + 1}`}
          isConnected={path.isConnected}
          onClickPort={path.onClickPort}
          labelVariant="secondary"
          icon={index === 0 && 'randomLoop'}
          iconColor="#616c60"
          key={index}
        />
      ))}
    </Section>
  </Step>
);

export default RandomStep;
