import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const NLUTooltip: React.FC = () => (
  <>
    <Tooltip.Title capitalize={false}>What is NLU?</Tooltip.Title>

    <Tooltip.Section>
      Natural Language Understanding (NLU) adds out of the box intelligence to your assistant.
      <br />
      <br />
      NLU systems work by analysing voice and text input, and using that to determine the meaning behind the user's request.
      <br />
      <br />
      If this is all new to you, and you don’t already use one of the NLU providers listed, we recommend selecting the Voiceflow option for the
      simplest user experience.
    </Tooltip.Section>
  </>
);

export default NLUTooltip;
