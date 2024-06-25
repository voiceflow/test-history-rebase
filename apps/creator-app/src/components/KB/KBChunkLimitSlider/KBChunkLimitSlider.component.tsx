import { Slider } from '@voiceflow/ui-next';
import React from 'react';

import type { IKBChunkLimitSlider } from './KBChunkLimitSlider.interface';

export const KBChunkLimitSlider: React.FC<IKBChunkLimitSlider> = ({
  value,
  testID = 'kb-chunk-limit-slider',
  disabled,
  onValueSave,
  onValueChange,
}) => {
  return (
    <Slider
      min={1}
      max={10}
      value={value}
      marks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
      testID={testID}
      disabled={disabled}
      endLabel="10"
      startLabel="1"
      onAfterChange={(value) => onValueSave(Math.round(value))}
      onValueChange={onValueChange}
    />
  );
};
