import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>The IF block allows you to provide your system with a condition, that is resolved as either true, or false.</Tooltip.Paragraph>

    <Tooltip.Title>Example</Tooltip.Title>

    <Tooltip.Paragraph>
      Let’s imagine an experience where we want to differentiate our welcome message based on if the user is new, or returning. We can use the IF
      block to pose our system with a condition that will allow us to determine this. Our IF statement would likely look something like this:
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>
      <code>IF {'{sessions}'} = 1</code>
    </Tooltip.Paragraph>

    <Tooltip.Paragraph>
      If this statement is resolved as true, we know the user is new, as it’s their first session. If the statement is resolved as false, we know that
      the user has had more than one session, and thus is a returning user. We’ll then respond to the user differently based on their situation.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
