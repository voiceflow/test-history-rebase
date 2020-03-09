import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export const RandomStep = ({ ports, isActive, onClick }) => (
  <Step isActive={isActive} onClick={onClick}>
    <Section>
      {ports.map((portID, index) => (
        <Item
          portID={portID}
          label={`Path ${index + 1}`}
          labelVariant="secondary"
          icon={index === 0 && 'randomLoop'}
          iconColor="#616c60"
          key={portID}
        />
      ))}
    </Section>
  </Step>
);

const ConnectedRandomStep = ({ node, stepProps }) => {
  return <RandomStep ports={node.ports.out} {...stepProps} />;
};

export default ConnectedRandomStep;
