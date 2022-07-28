import { IconButtonVariant } from '@ui/components/IconButton/types';
import { HUE_MAX, HUE_MIN } from '@ui/utils/colors/hsl';
import { preventDefault, withTargetValue } from '@ui/utils/dom';
import React from 'react';

import { Range } from './Range';
import { RangeContainer, StyledIconButton } from './styles';

interface ColorRangeProps {
  hue: string;
  setHue: (hue: string) => void;
  saveHue: (hue: string) => void;
}

export const ColorRange: React.FC<ColorRangeProps> = ({ hue, setHue, saveHue }) => (
  <RangeContainer>
    <Range min={HUE_MIN} max={HUE_MAX} value={hue} onChange={preventDefault(withTargetValue(setHue))} />

    <StyledIconButton onClick={() => saveHue(hue)} variant={IconButtonVariant.BASIC} icon="plus" />
  </RangeContainer>
);
