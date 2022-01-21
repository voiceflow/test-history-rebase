import React from 'react';

import { Section, Title } from '@/components/Tooltip';

const EntityPromptTooltip: React.FC = () => {
  return (
    <>
      <Title>Entity Reprompts</Title>

      <Section>Entity reprompts are what the assistant will say when the user fails to provide the entity asked for.</Section>

      <Section>
        For example, if we ask the user to provide their favourite color, and they respond with “hello”, entity reprompts would be triggered to
        further guide the user to provide a valid response.
      </Section>
    </>
  );
};

export default EntityPromptTooltip;
