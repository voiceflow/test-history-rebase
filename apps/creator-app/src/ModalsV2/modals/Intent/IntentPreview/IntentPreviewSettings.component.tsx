import { IntentClassificationLLMSettings as IntentClassificationLLMSettingsType } from '@voiceflow/dtos';
import React, { useMemo } from 'react';

import { IntentClassificationLLMSettings } from '@/components/Intent/IntentClassificationLLMSettings/IntentClassificationLLMSettings.component';
import { PopperModalSettings } from '@/components/Popper/PopperModalSettings/PopperModalSettings.component';
import { PopperOverridesDivider } from '@/components/Popper/PopperOverridesDivider/PopperOverridesDivider.component';

interface IIntentPreviewSettings {
  testID?: string;
  settings: IntentClassificationLLMSettingsType;
  initialSettings: IntentClassificationLLMSettingsType;
  onSettingsChange: (value: IntentClassificationLLMSettingsType) => void;
}

export const IntentPreviewSettings: React.FC<IIntentPreviewSettings> = ({ testID, settings, initialSettings, onSettingsChange }) => {
  const combineSettings = ({ params, promptWrapper }: IntentClassificationLLMSettingsType) => ({ ...params, promptWrapper: promptWrapper?.content });

  const combinedSettings = useMemo(() => combineSettings(settings), [settings]);
  const combinedInitialSettings = useMemo(() => combineSettings(initialSettings), [initialSettings]);

  return (
    <PopperModalSettings testID={testID}>
      <PopperOverridesDivider value={combinedSettings} initialValues={combinedInitialSettings} onReset={() => onSettingsChange(initialSettings)} />

      <IntentClassificationLLMSettings settings={settings} onSettingsChange={(value) => onSettingsChange({ ...settings, ...value })} />
    </PopperModalSettings>
  );
};
