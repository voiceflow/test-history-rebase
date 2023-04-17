import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltipContent: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      If you’re selling products inside your assistant, you must also gracefully handle a cancel request.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={2}>A user might ask to cancel a subscription in one of the following ways:</Tooltip.Paragraph>

    <Tooltip.Section marginBottomUnits={2}>
      <ul>
        <li>Cancel my subscription for product name</li>
        <li>Cancel the subscription for product name</li>
      </ul>
    </Tooltip.Section>

    <Tooltip.Paragraph marginBottomUnits={3}>
      We’d recommend using an intent block to handle these responses from anywhere within your assistant.{' '}
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltipContent;
