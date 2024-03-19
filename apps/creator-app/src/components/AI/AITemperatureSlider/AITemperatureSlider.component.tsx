import { Slider } from '@voiceflow/ui-next';
import React from 'react';

import { IAITemperatureSlider } from './AITemperatureSlider.interface';

export const AITemperatureSlider: React.FC<IAITemperatureSlider> = ({
  value,
  testID = 'ai-temperature-slider',
  disabled,
  onValueSave,
  onValueChange,
}) => (
  <Slider
    min={0}
    max={1}
    marks={[0, 1]}
    value={value}
    testID={testID}
    endLabel="Random"
    disabled={disabled}
    startLabel="Deterministic"
    onAfterChange={onValueSave}
    onValueChange={onValueChange}
  />
);
