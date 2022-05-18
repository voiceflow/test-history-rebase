import { Box, StrengthGauge, StrengthGaugeTypes } from '@voiceflow/ui';
import React from 'react';

import { StrengthContainer, StrengthDescriptorContainer } from '../../Table/components/TableItem/components';

interface ConfidenceProps {
  flex: number;
  intentStrength: StrengthGaugeTypes.Level;
}

const Confidence: React.FC<ConfidenceProps> = ({ flex, intentStrength }) => {
  return (
    <StrengthContainer flex={flex}>
      <Box display="inline-block" mt={-6}>
        <StrengthGauge tooltipLabelMap={{ [StrengthGauge.Level.NOT_SET]: 'No utterances' }} width={40} level={intentStrength} />
      </Box>
      <StrengthDescriptorContainer>
        {intentStrength === StrengthGauge.Level.NOT_SET ? 'No utterances' : StrengthGauge.TOOLTIP_LABEL_MAP[intentStrength]}
      </StrengthDescriptorContainer>
    </StrengthContainer>
  );
};

export default Confidence;
