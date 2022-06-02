import { COLOR_PICKER_CONSTANTS, ColorPickerRange, createShadesFromHue } from '@voiceflow/ui';
import React, { useState } from 'react';
import styled from 'styled-components';

import { createExample, createSection } from './utils';

const COLOR_GRADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;
const HUE_MIN = 0;
const HUE_MAX = 360;

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

const HueSlider = (): React.ReactElement => {
  const [hue, setHue] = useState<string>(String(HUE_MAX / 2));
  const hslShades = React.useMemo<COLOR_PICKER_CONSTANTS.HSLShades>(() => createShadesFromHue(hue), [hue]);
  return (
    <>
      <ColorPickerRange
        min={HUE_MIN}
        max={HUE_MAX}
        value={hue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          event.preventDefault();
          setHue(event.currentTarget.value);
        }}
      />

      <ColorPalette>
        {Object.keys(hslShades).map((value, i: number) => (
          <Color
            key={value}
            backgroundColor={hslShades[value as keyof COLOR_PICKER_CONSTANTS.HSLShades]}
            fontColor={i < 5 ? hslShades[COLOR_GRADES[9]] : hslShades[COLOR_GRADES[1]]}
          >
            {value}
          </Color>
        ))}
      </ColorPalette>
    </>
  );
};

const standard = createExample('Color Palette Visualizer', () => <HueSlider />);

export default createSection('HueSlider', 'src/components/HueSlider/index.tsx', [standard]);
