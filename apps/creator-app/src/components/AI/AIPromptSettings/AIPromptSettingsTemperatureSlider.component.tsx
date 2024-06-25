import { SectionV2, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import SliderInputGroup from '@/components/SliderInputGroupV2';

const paddedDecimalString = (value: number | string, padding = 2) => {
  const [start, end = ''] = String(value).split('.');

  return `${start}.${end.padEnd(padding, '0')}`;
};

export interface IAIPromptSettingsTemperatureSlider {
  value: number;
  onValueChange: (value: number) => void;
}

export const AIPromptSettingsTemperatureSlider: React.FC<IAIPromptSettingsTemperatureSlider> = ({
  value,
  onValueChange,
}) => (
  <SectionV2.Content pb={0}>
    <TippyTooltip
      delay={250}
      placement="top-start"
      content="Control the randomness of your completions, with higher temperatures being more random, and low temperature more deterministic."
    >
      <SectionV2.Title secondary bold>
        Temperature
      </SectionV2.Title>
    </TippyTooltip>

    <SliderInputGroup
      value={value}
      onChange={onValueChange}
      inputProps={{ maxLength: 4 }}
      sliderProps={{ min: 0, max: 1, step: 0.05 }}
      textModifier={paddedDecimalString}
    />
  </SectionV2.Content>
);
