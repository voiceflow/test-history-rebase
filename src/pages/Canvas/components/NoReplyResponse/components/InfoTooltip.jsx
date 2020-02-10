import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';

const InfoTooltip = () => (
  <>
    <Title>No Reply Response</Title>
    <TooltipSection marginBottomUnits={2}>No Reply Responses are what the system will say when the user says nothing at all.</TooltipSection>

    <Title>Note</Title>
    <TooltipSection marginBottomUnits={2}>
      ’Else’ paths and ’No Reply Responses’ are different. The ’Else’ path is activated when the users says something that doesn't match an intent in
      the choice step. While ’No Reply Responses’ are activated when the user says nothing at all.
    </TooltipSection>
  </>
);

export default InfoTooltip;
