import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type DeprecatedStepProps = {
  onClick: () => void;
};

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ onClick }) => (
  <Step onClick={onClick}>
    <Section>
      <Item icon="close" iconColor="#adadad" placeholder="Deprecated" />
    </Section>
  </Step>
);

export default DeprecatedStep;
