import { createShadesFromHue, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { ALL_COLORS } from './constants';
import { normalizeColor } from './utils';

export const useColorPalette = (hexOrRGBColor: string | undefined): HSLShades => {
  return React.useMemo(() => {
    const color = normalizeColor(hexOrRGBColor);
    const isDefaultColor = ALL_COLORS.find(({ palette }) => palette[STANDARD_GRADE] === color);

    return isDefaultColor?.palette || createShadesFromHue(String(hexToHsluv(color)[0]));
  }, [hexOrRGBColor]);
};
