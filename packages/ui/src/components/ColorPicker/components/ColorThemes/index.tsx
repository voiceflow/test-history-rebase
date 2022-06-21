import { hexToHsluv } from '@ui/utils/colors/hsluv';
import React from 'react';

import { IColor } from '../../constants';
import { getStandardShade } from '../../utils';
import { Color } from './Color';
import { ColorsList } from './styles';
import { ColorThemesProps } from './types';

export const ColorThemeUnit = Color;
export const ColorThemes: React.FC<ColorThemesProps> = ({ colors, small, selectedColor = '', onColorSelect, ...props }) => {
  return (
    <ColorsList>
      {colors.map((color: IColor) => {
        const { palette, name, standardColor } = color;
        const standardGrade = standardColor.toLowerCase();
        const selected = standardGrade === selectedColor.toLowerCase();
        const [hue] = hexToHsluv(standardGrade).map(String);
        return (
          <Color
            selected={selected}
            onClick={() => onColorSelect(getStandardShade(hue, palette))}
            background={standardGrade}
            colorData={color}
            key={`base-${hue}`}
            small={small}
            name={name}
            {...props}
          />
        );
      })}
    </ColorsList>
  );
};
