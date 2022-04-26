import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>We can think of the exit block like a force quit function inside projects.</Tooltip.Paragraph>

    <Tooltip.Paragraph>
      For example, if we’re inside a flow and a block is unlinked the project wont end- instead it will waterfall back to the previous flow. If we’d
      like the project to end in its current state, we must use a Exit block to force quit.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
