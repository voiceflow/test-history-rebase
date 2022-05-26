import { COLOR_GRADES, createShadesFromHue, HSLShades } from '@ui/utils/colors/hsl';
import React from 'react';
import styled from 'styled-components';

interface ColorProps {
  backgroundColor: string;
  fontColor: string;
}

const Color = styled.span.attrs((props: ColorProps) => ({
  style: {
    backgroundColor: props.backgroundColor,
    color: props.fontColor,
  },
}))<ColorProps>`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 100;
`;

const ColorPalette = styled.section`
  display: flex;
  margin-top: 20px;
`;

export interface ColorPaletteDisplayProps {
  hue: string;
}

export const ColorPaletteDisplay = ({ hue }: ColorPaletteDisplayProps): React.ReactElement => {
  const hslShades = React.useMemo<HSLShades>(() => createShadesFromHue(hue), [hue]);

  return (
    <ColorPalette>
      {Object.keys(hslShades).map((value, i: number) => (
        <Color
          key={value}
          backgroundColor={hslShades[value as keyof HSLShades]}
          fontColor={i < 5 ? hslShades[COLOR_GRADES[9]] : hslShades[COLOR_GRADES[1]]}
        >
          {value}
        </Color>
      ))}
    </ColorPalette>
  );
};
