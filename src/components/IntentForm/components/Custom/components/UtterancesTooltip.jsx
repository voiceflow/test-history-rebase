import React from 'react';

import { Section, Title } from '@/componentsV2/Tooltip';

export default function UtterancesTooltip() {
  return (
    <>
      <Section marginBottomUnits={2}>Utterances are different ways a user can say the same thing.</Section>

      <Title>Example</Title>

      <Section marginBottomUnits={2}>
        <ul>
          <li>
            <b>Show me how</b> to play the piano
          </li>
          <li>
            <b>Teach me</b> how to play the piano
          </li>
          <li>
            <b>Tell me</b> how to play the piano
          </li>
          <li>
            <b>Can you teach me</b> how to play the piano
          </li>
          <li>
            <b>How do I play</b> <em>{'{song_name}'}</em> on the piano
          </li>
        </ul>
      </Section>

      <Section>The more utterances we define for a given intent, the easier it will be for users to trigger the Intent.</Section>
    </>
  );
}
