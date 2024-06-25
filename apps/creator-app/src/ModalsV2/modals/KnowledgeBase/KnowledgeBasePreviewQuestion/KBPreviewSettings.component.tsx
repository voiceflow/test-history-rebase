import type { BaseModels, BaseUtils } from '@voiceflow/base-types';
import { tid } from '@voiceflow/style';
import type { BaseProps } from '@voiceflow/ui-next';
import { Box } from '@voiceflow/ui-next';
import React from 'react';

import { AIMaxTokensSliderSection } from '@/components/AI/AIMaxTokensSliderSection/AIMaxTokensSliderSection.component';
import { AIModelSelectSection } from '@/components/AI/AIModelSelectSection/AIModelSelectSection.component';
import { AITemperatureSliderSection } from '@/components/AI/AITemperatureSliderSection/AITemperatureSlider.component';
import { KBInstructionInputSection } from '@/components/KB/KBInstructionInputSection/KBInstructionInputSection.component';
import { KBSystemInputSection } from '@/components/KB/KBSystemInputSection/KBSystemInputSection.component';
import { PopperModalSettings } from '@/components/Popper/PopperModalSettings/PopperModalSettings.component';
import { PopperOverridesDivider } from '@/components/Popper/PopperOverridesDivider/PopperOverridesDivider.component';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';
import { CMS_KNOWLEDGE_BASE_LEARN_MORE } from '@/constants/link.constant';

import { SETTINGS_TEST_ID } from '../KnowledgeBase.constant';
import { DEFAULT_SETTINGS } from '../KnowledgeBaseSettings/KnowledgeBaseSettings.constant';

type SummarizationSettings = BaseModels.Project.KnowledgeBaseSettings['summarization'];

export interface IPreviewSettings extends BaseProps {
  settings: SummarizationSettings;
  initialSettings: SummarizationSettings;
  onSettingsChange: (value: SummarizationSettings) => void;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({
  testID,
  settings,
  initialSettings,
  onSettingsChange,
}) => {
  const onPatch = (value: Partial<SummarizationSettings>) => onSettingsChange({ ...settings, ...value });

  const model = settings.model ?? DEFAULT_SETTINGS.summarization.model;

  return (
    <PopperModalSettings testID={tid(testID, 'menu')}>
      <PopperOverridesDivider
        value={settings}
        initialValues={initialSettings}
        onReset={() => onSettingsChange(initialSettings)}
      />

      <Box direction="column" gap={12} pb={24}>
        <AIModelSelectSection
          value={model}
          testID={tid(SETTINGS_TEST_ID, 'model')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={(model) => onPatch({ model: model as BaseUtils.ai.GPT_MODEL })}
        />

        <AITemperatureSliderSection
          value={settings.temperature ?? DEFAULT_SETTINGS.summarization.temperature}
          testID={tid(SETTINGS_TEST_ID, 'temperature')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={(temperature) => onPatch({ temperature })}
        />

        <AIMaxTokensSliderSection
          model={model}
          value={settings.maxTokens ?? DEFAULT_SETTINGS.summarization.maxTokens}
          testID={tid(SETTINGS_TEST_ID, 'tokens')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={(maxTokens) => onPatch({ maxTokens })}
        />

        <KBInstructionInputSection
          value={settings.instruction ?? DEFAULT_SETTINGS.summarization.instruction}
          testID={tid(SETTINGS_TEST_ID, 'instructions')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={(instruction) => onPatch({ instruction })}
        />

        {AI_MODEL_CONFIG_MAP[model].hasSystemPrompt && (
          <KBSystemInputSection
            value={settings.system ?? DEFAULT_SETTINGS.summarization.system}
            testID={tid(SETTINGS_TEST_ID, 'system-prompt')}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={(system) => onPatch({ system })}
          />
        )}
      </Box>
    </PopperModalSettings>
  );
};
