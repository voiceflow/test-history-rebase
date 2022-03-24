/* eslint-disable import/prefer-default-export */
import React from 'react';

import { IColor } from '../../constants';
import { Color } from './Color';
import { ColorsList } from './styles';
import { ColorThemesProps } from './types';

export const ColorThemes: React.FC<ColorThemesProps> = ({ colors, small, selectedColor, onColorSelect }) => {
  return (
    <ColorsList>
      {colors.map((color: IColor) => {
        const { palette, hue, name } = color;

        return (
          <Color
            selected={hue === selectedColor?.hue}
            onClick={() => onColorSelect(color)}
            background={palette[500]}
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
