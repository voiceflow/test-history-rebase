import { BaseUtils } from '@voiceflow/base-types';
import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import { SettingsLabel } from './SettingLabel.component';

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');
  return `${start}.${end.padEnd(padding, '0')}`;
};

export interface ITemperatureSlider {
  temperature?: number;
  onChange: (data: Partial<BaseUtils.ai.AIModelParams>) => void;
}

export const TemperatureSlider: React.FC<ITemperatureSlider> = ({ temperature = 0.7, onChange }) => {
  return (
    <Box width="100%" direction="column" pb={12}>
      <SettingsLabel
        label="Temperature"
        value={paddedDecimalString(temperature).toString()}
        tooltipText="Control the randomness of the answer the LLM provides."
        tooltipLearnMore={Documentation.KB_USAGE}
      />
      <Slider
        value={temperature}
        startLabel="Deterministic"
        endLabel="Random"
        onValueChange={(temperature) => onChange({ temperature })}
        min={0}
        max={1}
        marks={[0, 1]}
      />
    </Box>
  );
};
