import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <Tooltip.Paragraph>
    The Permissions block allows your agent to request information from the user, in order to deliver a more personalized experience. When a user
    hits the permission block, a card is sent to the users mobile device. From there, the user can approve, decline, and manage the permissions your
    agent can access.
  </Tooltip.Paragraph>
);

export default HelpTooltip;
