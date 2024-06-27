import type { KnowledgeBaseSettings } from '@voiceflow/dtos';
import { KB_SETTINGS_DEFAULT } from '@voiceflow/realtime-sdk';
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

type SummarizationSettings = KnowledgeBaseSettings['summarization'];

export interface IPreviewSettings extends BaseProps {
  instruction: string;
  summarization: SummarizationSettings;
  onInstructionChange: (value: string) => void;
  initialSummarization: SummarizationSettings;
  onSummarizationChange: (value: SummarizationSettings) => void;
}

export const KBPreviewSettings: React.FC<IPreviewSettings> = ({
  testID,
  instruction,
  summarization,
  onInstructionChange,
  initialSummarization,
  onSummarizationChange,
}) => {
  const SETTINGS_TEST_ID = tid('knowledge-base', 'settings');

  const onSummarizationPatch =
    <Key extends keyof SummarizationSettings>(key: Key) =>
    (value: SummarizationSettings[Key]) =>
      onSummarizationChange({ ...summarization, [key]: value });

  return (
    <PopperModalSettings testID={tid(testID, 'menu')}>
      <PopperOverridesDivider
        value={summarization}
        onReset={() => onSummarizationChange(initialSummarization)}
        initialValues={initialSummarization}
      />

      <Box direction="column" gap={12} pb={24}>
        <AIModelSelectSection
          value={summarization.model}
          testID={tid(SETTINGS_TEST_ID, 'model')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={onSummarizationPatch('model')}
        />

        <AITemperatureSliderSection
          value={summarization.temperature}
          testID={tid(SETTINGS_TEST_ID, 'temperature')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={onSummarizationPatch('temperature')}
        />

        <AIMaxTokensSliderSection
          model={summarization.model}
          value={summarization.maxTokens ?? KB_SETTINGS_DEFAULT.summarization.maxTokens}
          testID={tid(SETTINGS_TEST_ID, 'tokens')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={onSummarizationPatch('maxTokens')}
        />

        <KBInstructionInputSection
          value={instruction}
          testID={tid(SETTINGS_TEST_ID, 'instructions')}
          learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
          onValueChange={onInstructionChange}
        />

        {AI_MODEL_CONFIG_MAP[summarization.model].hasSystemPrompt && (
          <KBSystemInputSection
            value={summarization.system}
            testID={tid(SETTINGS_TEST_ID, 'system-prompt')}
            learnMoreURL={CMS_KNOWLEDGE_BASE_LEARN_MORE}
            onValueChange={onSummarizationPatch('system')}
          />
        )}
      </Box>
    </PopperModalSettings>
  );
};
