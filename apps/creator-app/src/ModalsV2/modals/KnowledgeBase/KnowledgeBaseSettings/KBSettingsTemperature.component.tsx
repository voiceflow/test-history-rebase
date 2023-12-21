import { Box, Slider } from '@voiceflow/ui-next';
import React from 'react';

import * as Documentation from '@/config/documentation';

import { KBSettingLabel } from './KBSettingLabel.component';

export interface IKBSettingsTemperature {
  value: number;
  disabled?: boolean;
  onValueChange: (temperature: number) => void;
}

export const KBSettingsTemperature: React.FC<IKBSettingsTemperature> = ({ value, disabled, onValueChange }) => {
  const paddedDecimalString = (value: number | string, padding = 2) => {
    const [start, end = ''] = String(value).split('.');

    return `${start}.${end.padEnd(padding, '0')}`;
  };

  return (
    <Box width="100%" direction="column" pb={12}>
      <KBSettingLabel
        label="Temperature"
        value={paddedDecimalString(value)}
        tooltipText="Control the randomness of the answer the LLM provides."
        tooltipLearnMore={Documentation.KB_USAGE}
      />

      <Slider
        min={0}
        max={1}
        marks={[0, 1]}
        value={value}
        endLabel="Random"
        disabled={disabled}
        startLabel="Deterministic"
        onValueChange={onValueChange}
      />
    </Box>
  );
};
