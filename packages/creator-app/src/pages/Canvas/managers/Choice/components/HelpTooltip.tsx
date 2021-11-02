import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

const HelpTooltip: React.FC = () => (
  <>
    <Title>Path</Title>

    <Paragraph>
      When selected, the choice path will have a ‘port’ attached to it on the canvas- allowing it to be linked to another block or step.
    </Paragraph>
    <Paragraph marginBottomUnits={3}>When the intent is triggered by the user, they will be navigated down the corresponding path.</Paragraph>

    <Title>Go to Intent</Title>

    <Paragraph>
      When selected, the user is able to trigger an intent that then triggers a different intent. For example the user could trigger the ‘Yes’ intent
      in the choice step, which then navigates them to the ‘Confirm Purchase’ intent.
    </Paragraph>
    <Paragraph>Go to Intents are helpful for navigating users to different places in a topic, or to different topics.</Paragraph>
  </>
);

export default HelpTooltip;
