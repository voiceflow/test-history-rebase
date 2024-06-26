import type { HSLShades } from '@ui/utils/colors/hsl';
import { createShadesFromHueWithDynamicSaturation } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { ALL_COLORS, BLOCK_STANDARD_COLOR } from './constants';
import { createShadesFromColor, normalizeColor } from './utils';

export const useColorPaletteWithDynamicSaturation = (color: string | undefined): HSLShades =>
  React.useMemo(() => {
    const normalizedColor = normalizeColor(color || BLOCK_STANDARD_COLOR);
    const isDefaultColor = ALL_COLORS.find(({ standardColor }) => standardColor === normalizedColor);

    return isDefaultColor?.palette || createShadesFromHueWithDynamicSaturation(String(hexToHsluv(normalizedColor)[0]));
  }, [color]);

export const useColorPalette = (color: string | undefined): HSLShades =>
  React.useMemo(() => createShadesFromColor(color || BLOCK_STANDARD_COLOR), [color]);

export const useNormalizedColor = (color: string) => React.useMemo(() => normalizeColor(color), [color]);
