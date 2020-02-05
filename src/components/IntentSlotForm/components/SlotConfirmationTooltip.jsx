import React from 'react';

import { Section, Title } from '@/componentsV2/Tooltip';

export default function SlotConfirmationTooltip() {
  return (
    <>
      <Section>Slot confirmation is the yes/no question we will ask the user to ensure we have the right slot value.</Section>

      <Title>Example</Title>

      <Section>
        In this example let’s say we’re building a pizza ordering experience and have a required slot called <var>size</var>. We’ve prompted the user
        for the slot and filled the <var>size</var> slot with the value “Large”. In this case, the slot confirmation might then be, “I heard{' '}
        <var>size</var>, is this correct?”.
      </Section>
    </>
  );
}
