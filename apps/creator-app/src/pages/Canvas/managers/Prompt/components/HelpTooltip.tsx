import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      We can think of the prompt step as a stop and listen inside our assistant.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      The prompt step is listening to the user to trigger an intent inside your assistant. When an intent is matched,
      the conversation will jump to that intent step and continue from there. Prompt steps are an important tool in
      building non-linear conversations, an important Conversation Design best practice.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
