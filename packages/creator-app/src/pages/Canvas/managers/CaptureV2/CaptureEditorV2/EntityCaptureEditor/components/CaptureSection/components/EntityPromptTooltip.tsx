import React from 'react';

import { Section, Title } from '@/components/Tooltip';

const EntityPromptTooltip: React.FC = () => {
  return (
    <>
      <Title>Entity Prompts</Title>

      <Section>Entity prompts are what the assistant will say when the user fails to provide the entity asked for.</Section>

      <Section>
        For example, if we ask the user to provide their favourite color, and they respond with “hello”, entity prompts would be triggered to further
        guide the user to provide a valid response.
      </Section>
    </>
  );
};

export default EntityPromptTooltip;
