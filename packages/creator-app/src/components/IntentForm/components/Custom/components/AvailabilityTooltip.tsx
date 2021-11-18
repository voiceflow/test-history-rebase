import React from 'react';

import { Section, Title } from '@/components/Tooltip';

const AvailabilityTooltip: React.FC = () => (
  <>
    <Title capitalize={false}>Global and Local Intents</Title>

    <Section>
      When toggled on, the selected intent is global, meaning it can be triggered from anywhere in the project. When off, the selected intent is local
      to the topic, meaning it can only be accessed if the user is already in this topic.
    </Section>
  </>
);

export default AvailabilityTooltip;
