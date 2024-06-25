import { Slider } from '@voiceflow/ui-next';
import React from 'react';

import type { INLUConfidenceSlider } from './NLUConfidenceSlider.interface';

export const NLUConfidenceSlider: React.FC<INLUConfidenceSlider> = ({
  value,
  testID = 'nlu-confidence-slider',
  disabled,
  onValueSave,
  onValueChange,
}) => {
  return (
    <Slider
      min={0}
      max={1}
      marks={[0, 1]}
      value={value}
      testID={testID}
      disabled={disabled}
      endLabel="100%"
      startLabel="0%"
      onAfterChange={onValueSave}
      onValueChange={onValueChange}
    />
  );
};
