import { createShadesFromHue, createShadesFromHueWithDynamicSaturation, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { ALL_COLORS, BLOCK_STANDARD_COLOR } from './constants';
import { normalizeColor } from './utils';

export const useColorPaletteForBlocks = (color: string | undefined = BLOCK_STANDARD_COLOR): HSLShades => {
  return React.useMemo(() => {
    const normalizedColor = normalizeColor(color);
    const isDefaultColor = ALL_COLORS.find(({ palette }) => palette[STANDARD_GRADE] === normalizedColor);

    return isDefaultColor?.palette || createShadesFromHueWithDynamicSaturation(String(hexToHsluv(normalizedColor)[0]));
  }, [color]);
};

export const useColorPalette = (color: string | undefined = BLOCK_STANDARD_COLOR): HSLShades => {
  return React.useMemo(() => {
    const normalizedColor = normalizeColor(color);
    const isDefaultColor = ALL_COLORS.find(({ palette }) => palette[STANDARD_GRADE] === normalizedColor);

    return isDefaultColor?.palette || createShadesFromHue(String(hexToHsluv(normalizedColor)[0]));
  }, [color]);
};
