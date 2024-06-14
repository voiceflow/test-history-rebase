import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph>
      The reminder block can be used to send both scheduled reminders and timed reminder to the user. You can add variables to both the trigger time
      and content of the reminder message.
    </Tooltip.Paragraph>

    <Tooltip.Title>Important Consideration</Tooltip.Title>

    <Tooltip.Paragraph>
      To send a user a reminder, they must grant your agent permission to do so. In order to gain this permission. You must use a Permissions
      block, and request the ability to send the user reminders.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
