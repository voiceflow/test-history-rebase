import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const ResponseUtterancesTooltip: React.FC = () => (
  <>
    <Tooltip.Section marginBottomUnits={2}>
      Response utterances are the different way a user could respond to the entity reprompt we defined above.
    </Tooltip.Section>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
      In this example let’s say we’re building a pizza ordering experience and have a required entity called <var>size</var>. Plus, our entity prompt
      for <var>size</var> is, “what size of pizza would you like?”. Here’s what our response utterances might look like:
    </Tooltip.Section>

    <Tooltip.Section marginBottomUnits={2}>
      <ul>
        <li>
          <var>size</var>
        </li>
        <li>
          <var>size</var> pizza
        </li>
        <li>
          I want a <var>size</var> pizza
        </li>
        <li>
          Make it a <var>size</var>
        </li>
        <li>
          Make it a <var>size</var>
        </li>
      </ul>
    </Tooltip.Section>

    <Tooltip.Section>The more utterances we define for a given intent, the easier it will be for users to trigger the Intent.</Tooltip.Section>
  </>
);

export default ResponseUtterancesTooltip;
