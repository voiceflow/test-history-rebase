import { IconButtonVariant } from '@ui/components/IconButton/types';
import { HUE_MAX, HUE_MIN } from '@ui/utils/colors/hsl';
import React from 'react';

import { Range } from './Range';
import { RangeContainer, StyledIconButton } from './styles';

interface ColorRangeProps {
  hue: string;
  setHue: (hue: string) => void;
  saveHue: (hue: string) => void;
}

export const ColorRange: React.FC<ColorRangeProps> = ({ hue, setHue, saveHue }) => {
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

      <StyledIconButton onClick={() => saveHue(hue)} variant={IconButtonVariant.BASIC} icon="plus" />
    </RangeContainer>
  );
};
