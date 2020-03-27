import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

export type DeprecatedStepProps = {
  isActive: boolean;
  onClick: () => void;
};

const DeprecatedStep: React.FC<DeprecatedStepProps> = () => (
  <Step>
    <Section>
      <Item icon="close" iconColor="#adadad" placeholder="Deprecated" />
    </Section>
  </Step>
);

export default DeprecatedStep;
