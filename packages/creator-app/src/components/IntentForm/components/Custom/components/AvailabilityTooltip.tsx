import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const AvailabilityTooltip: React.FC = () => (
  <>
    <Tooltip.Title capitalize={false}>Global and Local Intents</Tooltip.Title>

    <Tooltip.Section>
      When toggled on, the selected intent is global, meaning it can be triggered from anywhere in the project. When off, the selected intent is local
      to the topic, meaning it can only be accessed if the user is already in this topic.
    </Tooltip.Section>
  </>
);

export default AvailabilityTooltip;
