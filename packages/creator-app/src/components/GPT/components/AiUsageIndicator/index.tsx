import { ProgressBar, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { useGPTQuotas, useGPTSettingsToggles } from '../../hooks/feature';
import * as S from './styles';

const getUsageColor = (percent: number) => {
  if (percent >= 0.66) {
    return '#bd425f';
  }
  if (percent >= 0.33 && percent <= 0.66) {
    return '#4e8bbd';
  }

  return `#50a82e`;
};

const AiUsageIndicator: React.FC = () => {
  const gptQuota = useGPTQuotas();
  const gptSettings = useGPTSettingsToggles();

  const someAIFeaturesEnabled = React.useMemo(
    () => Object.keys(gptSettings.project).some((featureKey) => gptSettings.project[featureKey]),
    [gptSettings.project]
  );

  const isOn = someAIFeaturesEnabled && gptSettings.workspace;
  const usage = gptQuota.consumed / gptQuota.quota;

  return (
    <S.Container>
      <S.StatusText>{isOn ? 'On' : 'Off'}</S.StatusText>

      <SvgIcon color="rgba(111, 133, 155, 0.85)" icon="ai" />

      {isOn && (
        <S.UsageBarContainer>
          <ProgressBar width={36} height={2} color={getUsageColor(usage)} progress={usage} />
        </S.UsageBarContainer>
      )}
    </S.Container>
  );
};

export default AiUsageIndicator;
