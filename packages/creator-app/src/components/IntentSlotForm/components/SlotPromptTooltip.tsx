import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const SlotPromptTooltip: React.FC = () => (
  <>
    <Tooltip.Section marginBottomUnits={1.5}>
      Entity reprompts are the question we will ask the user to obtain a specific required entity.
    </Tooltip.Section>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Section>
      Let’s imagine we’re creating a Pizza Ordering experience and we need to know the <var>size</var> of pizza the user wishes to order. The user may
      trigger this intent and give us the <var>type</var> of pizza they’d like, but not mention the <var>size</var>. The entity reprompt is the
      question we will then ask them to fill this entity. In this case our entity reprompt might be, “What size pizza would you like?”.
    </Tooltip.Section>
  </>
);

export default SlotPromptTooltip;
