import { Slider } from '@voiceflow/ui-next';
import React from 'react';

import { AI_MODEL_CONFIG_MAP } from '@/config/ai-model';

import { IAIMaxTokensSlider } from './AIMaxTokensSlider.interface';

export const AIMaxTokensSlider: React.FC<IAIMaxTokensSlider> = ({
  model,
  value,
  testID = 'ai-max-tokens-slider',
  disabled,
  onValueSave,
  onValueChange,
}) => {
  const { maxTokens } = AI_MODEL_CONFIG_MAP[model];

  return (
    <Slider
      min={10}
      max={maxTokens}
      step={1}
      marks={[10, maxTokens]}
      value={value}
      testID={testID}
      endLabel={String(maxTokens)}
      disabled={disabled}
      startLabel="10"
      onAfterChange={onValueSave}
      onValueChange={onValueChange}
    />
  );
};
