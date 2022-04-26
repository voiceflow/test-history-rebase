import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const SlotsTooltip: React.FC = () => (
  <>
    <Tooltip.Section marginBottomUnits={2}>
      Entities are best described as variables within an utterance. They help us pick out important pieces of information from a sentence that we can
      use to fulfill the users intent.
    </Tooltip.Section>

    <Tooltip.Section marginBottomUnits={2}>
      Voiceflow already contains a set of pre-defined entity types including First Name, Country, Airport etc. You also have the ability to define our
      own custom entities types.
    </Tooltip.Section>

    <Tooltip.Title>Adding entities to utterances</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>Press “{'{'}“ to add and create entities inside an utterance.</Tooltip.Section>
  </>
);

export default SlotsTooltip;
