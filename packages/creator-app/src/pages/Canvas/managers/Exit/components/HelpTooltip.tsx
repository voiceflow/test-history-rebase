import React from 'react';

import { Paragraph } from '@/components/Tooltip';

const HelpTooltip: React.FC = () => (
  <>
    <Paragraph>We can think of the exit block like a force quit function inside projects.</Paragraph>
    <Paragraph>
      For example, if we’re inside a flow and a block is unlinked the project wont end- instead it will waterfall back to the previous flow. If we’d
      like the project to end in its current state, we must use a Exit block to force quit.
    </Paragraph>
  </>
);

export default HelpTooltip;
