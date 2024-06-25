import { DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { AIModelSelectSection } from '@/components/AI/AIModelSelectSection/AIModelSelectSection.component';
import { AIPromptWrapperSection } from '@/components/AI/AIPromptWrapperSection/AIPromptWrapperSection.component';
import { AITemperatureSliderSection } from '@/components/AI/AITemperatureSliderSection/AITemperatureSlider.component';
import { LLM_INTENT_CLASSIFICATION_LEARN_MORE } from '@/constants/link.constant';

import type { IIntentClassificationLLMSettings } from './IntentClassificationLLMSettings.interface';

export const IntentClassificationLLMSettings: React.FC<IIntentClassificationLLMSettings> = ({
  settings,
  disabled,
  onSettingsChange,
  onCodeEditorToggle,
}) => {
  const TEST_ID = 'intent-classification-llm-settings';

  const { params } = settings;
  const promptWrapper = settings.promptWrapper ?? DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER;

  const onParamsChange = (value: Partial<IIntentClassificationLLMSettings['settings']['params']>) => {
    onSettingsChange({ ...settings, params: { ...params, ...value } });
  };

  const onPromptWrapperChange = (value: Partial<IIntentClassificationLLMSettings['settings']['promptWrapper']>) => {
    onSettingsChange({ ...settings, promptWrapper: { ...promptWrapper, ...value } });
  };

  const onPromptWrapperReset = () => {
    onSettingsChange({ ...settings, promptWrapper: null });
  };

  return (
    <Box gap={12} pb={24} direction="column">
      <AIModelSelectSection
        value={params.model}
        testID={tid(TEST_ID, 'model-select')}
        disabled={disabled}
        learnMoreURL={LLM_INTENT_CLASSIFICATION_LEARN_MORE}
        onValueChange={(model) => onParamsChange({ model })}
      />

      <AITemperatureSliderSection
        value={params.temperature}
        testID={tid(TEST_ID, 'temperature-slider')}
        disabled={disabled}
        learnMoreURL={LLM_INTENT_CLASSIFICATION_LEARN_MORE}
        onValueChange={(temperature) => onParamsChange({ temperature })}
      />

      <AIPromptWrapperSection
        value={promptWrapper.content}
        testID={tid(TEST_ID, 'prompt-wrapper')}
        disabled={disabled}
        learnMoreURL={LLM_INTENT_CLASSIFICATION_LEARN_MORE}
        defaultValue={DEFAULT_INTENT_CLASSIFICATION_LLM_PROMPT_WRAPPER.content}
        onValueChange={(content) => onPromptWrapperChange({ content })}
        onResetToDefault={onPromptWrapperReset}
        onCodeEditorToggle={onCodeEditorToggle}
      />
    </Box>
  );
};
