import React from 'react';

import { Paragraph } from '@/componentsV2/Tooltip';

function HelpTooltip() {
  return (
    <Paragraph>
      The Permissions block allows your project to request information from the user, in order to deliver a more personalized experience. When a user
      hits the permission block, a card is sent to the users mobile device. From there, the user can approve, decline, and manage the permissions your
      project can access.
    </Paragraph>
  );
}

export default HelpTooltip;
