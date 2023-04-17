import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip = () => (
  <>
    <Tooltip.Title>Reprompts</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
      <p>When selected, the Reprompt type allow you to define ‘No Match’ responses for when a user fails to match an intent.</p>
      <p>
        You can create multiple ‘No Match’ responses to further guide the user. ‘No Match 1’ is the response the assistant will deliver the first time
        the user fails to match an intent. ‘No Match 2’ is the response the assistant will deliver the second time the user fails to match an intent-
        and so on.
      </p>
    </Tooltip.Section>

    <Tooltip.Title>Path</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
      When selected, an ‘Else’ port is added to the step which is visible on the canvas. This is the path the user will navigate down if no intent is
      matched.
    </Tooltip.Section>

    <Tooltip.Title>Reprompts + Path</Tooltip.Title>

    <Tooltip.Section marginBottomUnits={2}>
      Reprompts and paths can be used together. When both are selected, users will first be delivered ‘No Match’ responses, followed by navigating
      down the ‘Else’ path if the user has still failed to match an intent.
    </Tooltip.Section>
  </>
);

export default HelpTooltip;
