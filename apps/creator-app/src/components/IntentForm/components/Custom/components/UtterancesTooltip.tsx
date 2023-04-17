import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const UtterancesTooltip: React.FC = () => (
  <>
    <Tooltip.Section marginBottomUnits={2}>Utterances are different ways a user can say the same thing.</Tooltip.Section>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
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
    </Tooltip.Section>

    <Tooltip.Section>The more utterances we define for a given intent, the easier it will be for users to trigger the Intent.</Tooltip.Section>
  </>
);

export default UtterancesTooltip;
