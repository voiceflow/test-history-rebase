import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Title>Path</Tooltip.Title>

    <Tooltip.Paragraph>
      When selected, the choice path will have a ‘port’ attached to it on the canvas- allowing it to be linked to another block or step.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      When the intent is triggered by the user, they will be navigated down the corresponding path.
    </Tooltip.Paragraph>

    <Tooltip.Title>Go to Intent</Tooltip.Title>

    <Tooltip.Paragraph>
      When selected, the user is able to trigger an intent that then triggers a different intent. For example the user could trigger the ‘Yes’ intent
      in the choice step, which then navigates them to the ‘Confirm Purchase’ intent.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>Go to Intents are helpful for navigating users to different places in a topic, or to different topics.</Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
