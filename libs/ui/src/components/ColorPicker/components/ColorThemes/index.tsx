import React from 'react';

import { IColor } from '../../constants';
import { getStandardShade } from '../../utils';
import { Color } from './Color';
import { ColorsList } from './styles';
import { ColorThemesProps } from './types';

export const ColorThemeUnit = Color;

export const ColorThemes: React.FC<ColorThemesProps> = ({ colors, selectedColor = '', onColorSelect, newColorIndex, ...props }) => {
  const lowercaseSelectedColor = selectedColor.toLowerCase();

  return (
    <ColorsList>
      {colors.map((color: IColor, index) => {
        const { palette, name, standardColor } = color;

        const standardGrade = standardColor.toLowerCase();

        return (
          <Color
            {...props}
            key={standardColor}
            name={name}
            isNew={newColorIndex === index}
            onClick={() => onColorSelect(getStandardShade(palette, standardGrade))}
            selected={standardGrade === lowercaseSelectedColor}
            colorData={color}
            background={standardGrade}
          />
        );
      })}
    </ColorsList>
  );
};
