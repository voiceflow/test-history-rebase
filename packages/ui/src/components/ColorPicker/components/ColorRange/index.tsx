/* eslint-disable import/prefer-default-export */
import { HUE_MAX, HUE_MIN } from '@ui/utils/colors/hsl';
import React from 'react';

import { Range } from './Range';
import { RangeContainer } from './styles';

interface ColorRangeProps {
  hue: string;
  setHue: (hue: string) => void;
}

export const ColorRange: React.FC<ColorRangeProps> = ({ hue, setHue }) => {
  return (
    <RangeContainer>
      <Range
        min={HUE_MIN}
        max={HUE_MAX}
        value={hue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const hue = event.currentTarget.value;
          event.preventDefault();
          setHue(hue);
        }}
      />
    </RangeContainer>
  );
};
