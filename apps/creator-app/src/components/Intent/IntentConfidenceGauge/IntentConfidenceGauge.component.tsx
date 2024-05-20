import { Box, Gauge } from '@voiceflow/ui-next';
import React from 'react';

import { getIntentConfidenceLevel, getIntentConfidenceProgress } from '@/utils/intent.util';

import { IIntentConfidenceGauge } from './IntentConfidenceGauge.interface';

export const IntentConfidenceGauge: React.FC<IIntentConfidenceGauge> = ({ width = 42, nonEmptyUtterancesCount }) => (
  <Box width={width}>
    <Gauge level={getIntentConfidenceLevel(nonEmptyUtterancesCount)} progress={getIntentConfidenceProgress(nonEmptyUtterancesCount)} />
  </Box>
);
