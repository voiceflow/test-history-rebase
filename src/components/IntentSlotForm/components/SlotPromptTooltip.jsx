import React from 'react';

import { Section, Title } from '@/components/Tooltip';

export default function SlotPromptTooltip() {
  return (
    <>
      <Section marginBottomUnits={1.5}>Slot prompts are the question we will ask the user to obtain a specific required slot.</Section>

      <Title>Example</Title>

      <Section>
        Let’s imagine we’re creating a Pizza Ordering experience and we need to know the <var>size</var> of pizza the user wishes to order. The user
        may trigger this intent and give us the <var>type</var> of pizza they’d like, but not mention the <var>size</var>. The slot prompt is the
        question we will then ask them to fill this slot. In this case our slot prompt might be, “What size pizza would you like?”.
      </Section>
    </>
  );
}
