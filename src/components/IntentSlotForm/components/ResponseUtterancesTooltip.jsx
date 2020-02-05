import React from 'react';

import { Section, Title } from '@/componentsV2/Tooltip';

export default function ResponseUtterancesTooltip() {
  return (
    <>
      <Section marginBottomUnits={2}>Response utterances are the different way a user could respond to the slot prompt we defined above.</Section>

      <Title>Example</Title>

      <Section marginBottomUnits={2}>
        In this example let’s say we’re building a pizza ordering experience and have a required slot called <var>size</var>. Plus, our slot prompt
        for <var>size</var> is, “what size of pizza would you like?”. Here’s what our response utterances might look like:
      </Section>

      <Section marginBottomUnits={2}>
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
      </Section>

      <Section>The more utterances we define for a given intent, the easier it will be for users to trigger the Intent.</Section>
    </>
  );
}
