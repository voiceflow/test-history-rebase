import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import * as Settings from '@/components/Settings';
import SliderInputGroup from '@/components/SliderInputGroupV2';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

const IntentConfidence: React.FC = () => {
  const patchSettings = useDispatch(Version.patchSettings);
  const intentConfidence = (useSelector(VersionV2.active.intentConfidenceSelector) ?? 0.6) * 100;

  const patchIntentConfidence = React.useCallback(
    (confidence: number) => patchSettings({ intentConfidence: Number((confidence / 100).toFixed(2)) }),
    []
  );

  return (
    <Settings.SubSection header="Intent Confidence" splitView>
      <SliderInputGroup
        sliderProps={{ min: 0, max: 100, step: 1 }}
        inputWidth={140}
        inputProps={{
          rightAction: (
            <Box color={ThemeColor.SECONDARY} fontWeight={600}>
              %
            </Box>
          ),
        }}
        value={intentConfidence}
        onChange={patchIntentConfidence}
      />
      <Settings.SubSection.Description>
        The threshold of confidence to classify an intent instead of <b>Fallback Intent</b>.
      </Settings.SubSection.Description>
    </Settings.SubSection>
  );
};

export default IntentConfidence;
