import { tid } from '@voiceflow/style';
import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { NLUConfidenceSliderSection } from '@/components/NLU/NLUConfidenceSliderSection/NLUConfidenceSliderSection.component';
import { NLU_INTENT_CLASSIFICATION_LEARN_MORE } from '@/constants/link.constant';

import { IIntentClassificationNLUSettings } from './IntentClassificationNLUSettings.interface';

export const IntentClassificationNLUSettings: React.FC<IIntentClassificationNLUSettings> = ({ settings, disabled, onSettingsChange }) => {
  const TEST_ID = 'intent-classification-nlu-settings';

  const onParamsChange = (value: Partial<IIntentClassificationNLUSettings['settings']['params']>) => {
    onSettingsChange({ ...settings, params: { ...settings.params, ...value } });
  };

  return (
    <Box pb={20} direction="column">
      <NLUConfidenceSliderSection
        value={settings.params.confidence}
        testID={tid(TEST_ID, 'confidence-slider')}
        disabled={disabled}
        learnMoreURL={NLU_INTENT_CLASSIFICATION_LEARN_MORE}
        onValueChange={(confidence) => onParamsChange({ confidence })}
      />
    </Box>
  );
};
