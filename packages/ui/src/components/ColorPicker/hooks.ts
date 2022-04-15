import { RGBAToHex } from '@ui/utils/colors';
import { isHexColor } from '@ui/utils/colors/hex';
import { createShadesFromHue, HSLShades, STANDARD_GRADE } from '@ui/utils/colors/hsl';
import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { DEFAULT_COLORS } from './constants';

const normalizeColor = (color: string) => (isHexColor(color) ? color : RGBAToHex(color));

export const useColorPalette = (hexOrRGBColor: string): HSLShades => {
  return React.useMemo(() => {
    const color = normalizeColor(hexOrRGBColor);
    const isDefaultColor = DEFAULT_COLORS.find(({ palette }) => palette[STANDARD_GRADE] === color);

    return isDefaultColor?.palette || createShadesFromHue(String(hexToHsluv(color)[0]));
  }, [hexOrRGBColor]);
};
