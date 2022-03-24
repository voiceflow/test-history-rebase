/* eslint-disable import/prefer-default-export */
import { createHEXShadesFromHSL, HUE_MAX, HUE_MIN } from '@ui/utils/colors/hsl';
import React from 'react';

import { IColor } from '../../constants';
import { Range } from './Range';
import { RangeContainer } from './styles';

interface ColorRangeProps {
  selectedColor: IColor;
  onSaveColor: (color: IColor) => void;
  onSlide: (color: IColor) => void;
}

export const ColorRange: React.FC<ColorRangeProps> = ({ onSlide, selectedColor }) => (
  <RangeContainer>
    <Range
      min={HUE_MIN}
      max={HUE_MAX}
      value={selectedColor?.hue || String(HUE_MAX / 2)}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
        const hue = event.currentTarget.value;

        event.preventDefault();

        onSlide({ hue, palette: createHEXShadesFromHSL(hue) } as IColor);
      }}
    />
  </RangeContainer>
);
