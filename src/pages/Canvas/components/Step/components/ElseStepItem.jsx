import React from 'react';

import Item from './StepItem';
import Section from './StepSection';

const ElseStepItem = (props) => (
  <Section>
    <Item icon="else" iconColor="#6e849a" label="Else" labelVariant="secondary" portColor="#8da2b5" {...props} />
  </Section>
);

export default ElseStepItem;
