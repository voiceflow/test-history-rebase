import React from 'react';

import { Paragraph, Title } from '@/componentsV2/Tooltip';

const HelpTooltip = () => (
  <>
    <Paragraph>
      The reminder block can be used to send both scheduled remidners and timed reminder to the user. You can add variables to both the trigger time
      and content of the reminder message.
    </Paragraph>
    <Title>Important Consideration</Title>
    <Paragraph>
      To send a user a reminder, they must grant your project permission to do so. In order to gain this permission. You must use a Permissions block,
      and request the ability to send the user reminders.
    </Paragraph>
  </>
);

export default HelpTooltip;
