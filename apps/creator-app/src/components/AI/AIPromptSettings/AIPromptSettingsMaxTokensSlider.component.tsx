import type { AIModel } from '@voiceflow/dtos';
import { SectionV2, TippyTooltip } from '@voiceflow/ui';
import React, { useEffect } from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';
import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';

export interface IAIPromptSettingsMaxTokensSlider {
  model: AIModel;
  value: number;
  onValueChange: (value: number) => void;
}

export const AIPromptSettingsMaxTokensSlider: React.FC<IAIPromptSettingsMaxTokensSlider> = ({
  model,
  value,
  onValueChange,
}) => {
  const modelConfig = AI_MODEL_CONFIG_MAP[model];

  useEffect(() => {
    if (value <= modelConfig.maxTokens) return;

    onValueChange(modelConfig.maxTokens);
  }, [model]);

  return (
    <SectionV2.Content pb={0}>
      <TippyTooltip
        delay={250}
        content="The maximum number of tokens that can be used to generate your completion. 1 Token is approximately 4 characters in English completions."
        placement="top-start"
      >
        <SectionV2.Title secondary bold>
          Max Tokens
        </SectionV2.Title>
      </TippyTooltip>

      <SliderInputGroup
        value={value}
        onChange={onValueChange}
        inputProps={{ maxLength: 4 }}
        sliderProps={{ min: 1, max: modelConfig.maxTokens, step: 1 }}
      />
    </SectionV2.Content>
  );
};
