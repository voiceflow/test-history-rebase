import React from 'react';

import { Paragraph, Section } from '@/components/Tooltip';

export default function HelpTooltipContent() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>If you’re selling products inside your project, you must also gracefully handle a cancel request.</Paragraph>
      <Paragraph marginBottomUnits={2}>A user might ask to cancel a subscription in one of the following ways:</Paragraph>
      <Section marginBottomUnits={2}>
        <ul>
          <li>Cancel my subscription for product name</li>
          <li>Cancel the subscription for product name</li>
        </ul>
      </Section>
      <Paragraph marginBottomUnits={3}>We’d recommend using an intent block to handle these responses from anywhere within your project. </Paragraph>
    </>
  );
}
