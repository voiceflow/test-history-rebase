import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>We can think of the end block like a force quit function inside assistants.</Tooltip.Paragraph>

    <Tooltip.Paragraph>
      For example, if we’re inside a component and a block is unlinked the assistant wont end- instead it will waterfall
      back to the previous component. If we’d like the assistant to end in its current state, we must use a End block to
      force quit.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
