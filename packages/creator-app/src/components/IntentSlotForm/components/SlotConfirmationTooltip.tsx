import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const SlotConfirmationTooltip: React.FC = () => (
  <>
    <Tooltip.Section>Entity confirmation is the yes/no question we will ask the user to ensure we have the right entity value.</Tooltip.Section>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Section>
      In this example let’s say we’re building a pizza ordering experience and have a required entity called <var>size</var>. We’ve prompted the user
      for the entity and filled the <var>size</var> entity with the value “Large”. In this case, the entity confirmation might then be, “I heard{' '}
      <var>size</var>, is this correct?”.
    </Tooltip.Section>
  </>
);

export default SlotConfirmationTooltip;
