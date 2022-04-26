import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Title>Follow Path</Tooltip.Title>

    <Tooltip.Paragraph>
      When selected, a button will have a ‘port’ attached to it on the canvas- allowing it to be linked to another block or step.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      When the button is selected by the user, they will be navigated down the corresponding path.
    </Tooltip.Paragraph>

    <Tooltip.Title capitalize={false}>Go to Intent</Tooltip.Title>

    <Tooltip.Paragraph>When selected, the corresponding button will have an intent attached to it.</Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>When the button is selected by the user, they will trigger the attached intent.</Tooltip.Paragraph>

    <Tooltip.Title>URL</Tooltip.Title>

    <Tooltip.Paragraph>When selected, the corresponding button will have a URL attached to it.</Tooltip.Paragraph>

    <Tooltip.Paragraph>When the button is selected by the user, they will open the corresponding URL in a new tab.</Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
