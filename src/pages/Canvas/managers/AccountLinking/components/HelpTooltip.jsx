import React from 'react';

import { Paragraph, Title } from '@/components/Tooltip';

import { HELP_LINK } from '../constants';

function HelpTooltip() {
  return (
    <>
      <Paragraph marginBottomUnits={3}>
        Account linking enables your project to connect the user's identity with their identity in a different system. You can read more on how it
        works{' '}
        <a href={HELP_LINK} target="_blank" rel="noopener noreferrer">
          here
        </a>
        .
      </Paragraph>

      <Title>How do users link their accounts?</Title>

      <Paragraph marginBottomUnits={3}>Users can start account linking in one of two ways:</Paragraph>
      <Paragraph marginBottomUnits={3}>1. From the skill detail card in the Alexa app while enabling the skill.</Paragraph>
      <Paragraph marginBottomUnits={3}>2. From a link account card in the Alexa app after making a request that requires authentication.</Paragraph>

      <Paragraph marginBottomUnits={3}>
        This gives users flexibility – if the user skips the account linking step when enabling the skill, they can come back to it later, after
        making a request that requires the authentication.
      </Paragraph>
    </>
  );
}

export default HelpTooltip;
