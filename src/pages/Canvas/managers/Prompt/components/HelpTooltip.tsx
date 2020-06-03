import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const HelpTooltip: React.FC = () => (
  <>
    <Paragraph marginBottomUnits={3}>We think of the prompt step as a stop and listen inside our project.</Paragraph>

    <Paragraph marginBottomUnits={3}>
      The prompt step is listening to the user to trigger an intent inside your project. When an intent is matched, the conversation will jump to that
      intent step and continue from there. Prompt steps are an important tool in building non-linear conversations, an important Conversation Design
      best practice.
    </Paragraph>
  </>
);

export default HelpTooltip;
