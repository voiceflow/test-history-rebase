import { ProgressBar } from '@voiceflow/ui';
import React from 'react';

import { useGPTQuotas } from '../hooks/feature';

const getUsageColor = (percent: number) => {
  if (percent >= 0.66) {
    return '#bd425f';
  }
  if (percent >= 0.33 && percent <= 0.66) {
    return '#4e8bbd';
  }

  return '#50a82e';
};

interface AIUsageProgressProps {
  width?: number | string;
}

const AIUsageProgress: React.FC<AIUsageProgressProps> = ({ width }) => {
  const gptQuota = useGPTQuotas();

  const percent = gptQuota.consumed / gptQuota.quota;

  return <ProgressBar width={width} height={2} color={getUsageColor(percent)} progress={percent} />;
};

export default AIUsageProgress;
