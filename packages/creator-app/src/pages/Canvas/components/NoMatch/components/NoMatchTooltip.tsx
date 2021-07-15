import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';

const NoMatchTooltip = () => (
  <>
    <Title>Reprompts</Title>
    <TooltipSection marginBottomUnits={2}>
      <p>When selected, the Reprompt type allow you to define ‘No Match’ responses for when a user fails to match an intent.</p>
      <p>
        You can create multiple ‘No Match’ responses to further guide the user. ‘No Match 1’ is the response the assistant will deliver the first time
        the user fails to match an intent. ‘No Match 2’ is the response the assistant will deliver the second time the user fails to match an intent-
        and so on.
      </p>
    </TooltipSection>

    <Title>Path</Title>
    <TooltipSection marginBottomUnits={2}>
      When selected, an ‘Else’ port is added to the step which is visible on the canvas. This is the path the user will navigate down if no intent is
      matched.
    </TooltipSection>

    <Title>Reprompts + Path</Title>
    <TooltipSection marginBottomUnits={2}>
      Reprompts and paths can be used together. When both are selected, users will first be delivered ‘No Match’ responses, followed by navigating
      down the ‘Else’ path if the user has still failed to match an intent.
    </TooltipSection>
  </>
);

export default NoMatchTooltip;
