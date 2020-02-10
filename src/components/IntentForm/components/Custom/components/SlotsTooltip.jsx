import React from 'react';

import { Section, Title } from '@/components/Tooltip';

export default function SlotsTooltip() {
  return (
    <>
      <Section marginBottomUnits={2}>
        Slots are best described as variables within an utterance. They help us pick out important pieces of information from a sentence that we can
        use to fulfill the users intent.
      </Section>

      <Section marginBottomUnits={2}>
        Voiceflow already contains a set of pre-defined slot types including First Name, Country, Airport etc. You also have the ability to define our
        own custom slots types.
      </Section>

      <Title>Adding slots to utterances</Title>

      <Section marginBottomUnits={2}>Press “{'{'}“ to add and create slots inside an utterance.</Section>
    </>
  );
}
