import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const EntityPromptTooltip: React.FC = () => {
  return (
    <>
      <Tooltip.Title>Entity Reprompts</Tooltip.Title>

      <Tooltip.Section>Entity reprompts are what the assistant will say when the user fails to provide the entity asked for.</Tooltip.Section>

      <Tooltip.Section>
        For example, if we ask the user to provide their favourite color, and they respond with “hello”, entity reprompts would be triggered to
        further guide the user to provide a valid response.
      </Tooltip.Section>
    </>
  );
};

export default EntityPromptTooltip;
