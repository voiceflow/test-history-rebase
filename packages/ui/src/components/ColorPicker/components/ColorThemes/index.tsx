import { STANDARD_GRADE } from '@ui/utils/colors/hsl';
import React from 'react';

import { IColor } from '../../constants';
import { getStandardShade } from '../../utils';
import { Color } from './Color';
import { ColorsList } from './styles';
import { ColorThemesProps } from './types';

export const ColorThemes: React.FC<ColorThemesProps> = ({ colors, small, selectedColor = '', onColorSelect }) => {
  return (
    <ColorsList>
      {colors.map((color: IColor) => {
        const { palette, hue, name } = color;
        const selected = palette[STANDARD_GRADE].toLowerCase() === selectedColor.toLowerCase();

        return (
          <Color
            selected={selected}
            onClick={() => onColorSelect(getStandardShade(hue, palette))}
            background={palette[STANDARD_GRADE]}
            colorData={color}
            key={`base-${hue}`}
            small={small}
            name={name}
          />
        );
      })}
    </ColorsList>
  );
};
