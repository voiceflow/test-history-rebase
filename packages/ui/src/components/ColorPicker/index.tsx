import { HUE_MAX, HUE_MIN } from '@ui/utils/colors/hsl';
import React, { useState } from 'react';

import { ColorPaletteDisplay, Range } from './components';

const ColorPicker = (): React.ReactElement => {
  const [hue, setHue] = useState<string>(String(HUE_MAX / 2));
  return (
    <>
      <Range
        min={HUE_MIN}
        max={HUE_MAX}
        value={hue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          event.preventDefault();
          setHue(event.currentTarget.value);
        }}
      />
      <ColorPaletteDisplay hue={hue} />
    </>
  );
};

export default ColorPicker;
