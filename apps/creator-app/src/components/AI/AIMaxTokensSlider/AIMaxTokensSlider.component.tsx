import { Slider } from '@voiceflow/ui-next';
import React from 'react';

import type { IAIMaxTokensWithLimitSlider } from './AIMaxTokensSlider.interface';

export const AIMaxTokensSlider: React.FC<IAIMaxTokensWithLimitSlider> = ({
  limit,
  value,
  testID = 'ai-max-tokens-slider',
  disabled,
  onValueSave,
  onValueChange,
}) => {
  return (
    <Slider
      min={10}
      max={limit}
      step={1}
      marks={[10, limit]}
      value={value}
      testID={testID}
      endLabel={String(limit)}
      disabled={disabled}
      startLabel="10"
      onAfterChange={onValueSave}
      onValueChange={onValueChange}
    />
  );
};
