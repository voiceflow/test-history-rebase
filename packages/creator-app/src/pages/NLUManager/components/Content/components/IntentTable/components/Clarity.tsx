import { Box, StrengthGauge, StrengthGaugeTypes } from '@voiceflow/ui';
import React from 'react';

import { StrengthContainer, StrengthDescriptorContainer } from '../../Table/components/TableItem/components';

interface ConfidenceProps {
  flex: number;
  clarityStrength: StrengthGaugeTypes.Level;
}

const Clarity: React.FC<ConfidenceProps> = ({ flex, clarityStrength }) => {
  return (
    <StrengthContainer flex={flex}>
      <Box display="inline-block" mt={-6}>
        <StrengthGauge width={40} level={clarityStrength} />
      </Box>
      <StrengthDescriptorContainer>{StrengthGauge.TOOLTIP_LABEL_MAP[clarityStrength]}</StrengthDescriptorContainer>
    </StrengthContainer>
  );
};

export default Clarity;
