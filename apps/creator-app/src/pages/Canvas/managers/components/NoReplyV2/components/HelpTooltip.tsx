import { Tooltip } from '@voiceflow/ui';
import React from 'react';

const HelpTooltip: React.FC = () => (
  <>
    <Tooltip.Title>Response</Tooltip.Title>
    <Tooltip.Section marginBottomUnits={2}>
      When selected, you can define ‘No Reply Responses’ for when a user takes no action. The delay time (seconds),
      determines how long the agent will wait before sending the first no reply response. If you have multiple no reply
      responses, this will also be time between each no reply response- assuming the user continues to take no action.
    </Tooltip.Section>

    <Tooltip.Title>Path</Tooltip.Title>
    <Tooltip.Section>
      When selected, a port is added to the step which is visible on the canvas. This is the path the user will navigate
      down if all no reply responses are exhausted and the user has still taken no action.
    </Tooltip.Section>
  </>
);

export default HelpTooltip;
