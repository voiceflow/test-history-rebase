import React from 'react';

import * as System from '@/system';
import { HUE_MAX, HUE_MIN } from '@/utils/colors/hsl';
import { preventDefault, withTargetValue } from '@/utils/dom';

import { Range } from './Range';
import { RangeContainer } from './styles';

interface ColorRangeProps {
  hue: string;
  setHue: (hue: string) => void;
  saveHue: (hue: string) => void;
}

export const ColorRange: React.FC<ColorRangeProps> = ({ hue, setHue, saveHue }) => (
  <RangeContainer>
    <Range min={HUE_MIN} max={HUE_MAX} value={hue} onChange={preventDefault(withTargetValue(setHue))} />

    <System.IconButtonsGroup.Base mx={-5}>
      <System.IconButton.Base onClick={() => saveHue(hue)} icon="plus" />
    </System.IconButtonsGroup.Base>
  </RangeContainer>
);
