import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type DeprecatedStepProps = {
  isActive: boolean;
  onClick: () => void;
};

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ isActive, onClick }) => (
  <Step isActive={isActive} onClick={onClick}>
    <Section>
      <Item icon="close" iconColor="#adadad" placeholder="Deprecated" />
    </Section>
  </Step>
);

export default DeprecatedStep;
