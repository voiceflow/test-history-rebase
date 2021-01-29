import React from 'react';

import { Section as TooltipSection, Title } from '@/components/Tooltip';

const InfoTooltip = () => (
  <>
    <Title>Chips</Title>
    <TooltipSection marginBottomUnits={2}>
      On devices with screens, chips will suggest to users some of the common utterances they can say.
    </TooltipSection>
  </>
);

export default InfoTooltip;
