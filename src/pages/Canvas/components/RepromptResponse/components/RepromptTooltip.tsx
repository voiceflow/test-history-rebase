import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';

const RepromptTooltip = () => (
  <>
    <Title>Path</Title>
    <TooltipSection marginBottomUnits={2}>
      The Else Path option adds an out port to your choice step where the user will be directed if they do not match an intent in your choice.
    </TooltipSection>

    <Title>Reprompts</Title>
    <TooltipSection marginBottomUnits={2}>
      <p>
        The Else Reprompts option allows you to pre-define responses when a user does not match an intent in your choice step. When selected, this
        option removes the Else port from your choice step.
      </p>
      <p>
        We can use multiple reprompts to further guide the user. No Match One is what the user will hear the first time there’s a ‘no match’. No Match
        Two is what the user will hear the second time there is a ‘no match’, and so on. Each choice can have a max of three reprompts as mandated by
        both Alexa and Google.
      </p>
    </TooltipSection>
  </>
);

export default RepromptTooltip;
