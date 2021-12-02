import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';

const NoReplyTooltip: React.FC = () => (
  <>
    <Title>Response</Title>
    <TooltipSection marginBottomUnits={2}>
      When selected, you can define ‘No Reply Responses’ for when a user takes no action. The delay time (seconds), determines how long the assistant
      will wait before sending the first no reply response. If you have multiple no reply responses, this will also be time between each no reply
      response- assuming the user continues to take no action.
    </TooltipSection>

    <Title>Path</Title>
    <TooltipSection>
      When selected, a port is added to the step which is visible on the canvas. This is the path the user will navigate down if all no reply
      responses are exhausted and the user has still taken no action.
    </TooltipSection>
  </>
);

export default NoReplyTooltip;
