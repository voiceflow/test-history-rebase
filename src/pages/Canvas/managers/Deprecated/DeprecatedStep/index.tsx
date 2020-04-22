import React from 'react';

import Step, { Item, Section } from '@/pages/Canvas/components/Step';

const DeprecatedStep = () => (
  <Step>
    <Section>
      <Item icon="close" iconColor="#adadad" placeholder="Deprecated" />
    </Section>
  </Step>
);

export default DeprecatedStep;
