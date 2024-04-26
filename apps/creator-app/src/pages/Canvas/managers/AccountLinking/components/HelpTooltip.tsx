import { Link, Tooltip } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Paragraph marginBottomUnits={3}>
      Account linking enables your assistant to connect the user's identity with their identity in a different system.
      You can read more on how it works <Link href={Documentation.ACCOUNT_LINKING_STEP}>here</Link>.
    </Tooltip.Paragraph>

    <Tooltip.Title>How do users link their accounts?</Tooltip.Title>

    <Tooltip.Paragraph marginBottomUnits={3}>Users can start account linking in one of two ways:</Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      1. From the skill detail card in the Alexa app while enabling the skill.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      2. From a link account card in the Alexa app after making a request that requires authentication.
    </Tooltip.Paragraph>

    <Tooltip.Paragraph marginBottomUnits={3}>
      This gives users flexibility – if the user skips the account linking step when enabling the skill, they can come
      back to it later, after making a request that requires the authentication.
    </Tooltip.Paragraph>
  </>
);

export default HelpTooltip;
