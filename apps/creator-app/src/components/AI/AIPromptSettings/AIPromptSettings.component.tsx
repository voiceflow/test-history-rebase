import type { BaseUtils } from '@voiceflow/base-types';
import { AIModel } from '@voiceflow/dtos';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { AIPromptSettingsMaxTokensSlider } from './AIPromptSettingsMaxTokensSlider.component';
import { AIPromptSettingsModelSelect } from './AIPromptSettingsModelSelect.component';
import { AIPromptSettingsSystemInput } from './AIPromptSettingsSystemInput.component';
import { AIPromptSettingsTemperatureSlider } from './AIPromptSettingsTemperatureSlider.component';

export interface IAIPromptSettings {
  value: BaseUtils.ai.AIModelParams;
  onValueChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
  containerProps?: React.ComponentProps<typeof Box.FlexColumn>;
}

export const AIPromptSettings: React.FC<IAIPromptSettings> = ({
  value: { model = AIModel.GPT_3_5_TURBO as AIModel, system = '', maxTokens = 128, temperature = 0.7 },
  onValueChange,
  containerProps,
}) => (
  <Box.FlexColumn alignItems="stretch" gap={12} {...containerProps}>
    <AIPromptSettingsModelSelect
      value={model}
      onValueChange={(model) => onValueChange({ model: model as unknown as BaseUtils.ai.GPT_MODEL })}
    />

    <AIPromptSettingsTemperatureSlider
      value={temperature}
      onValueChange={(temperature) => onValueChange({ temperature })}
    />

    <AIPromptSettingsMaxTokensSlider
      model={model}
      value={maxTokens}
      onValueChange={(maxTokens) => onValueChange({ maxTokens })}
    />

    <AIPromptSettingsSystemInput model={model} value={system} onValueChange={(system) => onValueChange({ system })} />
  </Box.FlexColumn>
);
