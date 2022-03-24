import { COLOR_PICKER_CONSTANTS, ColorPicker } from '@voiceflow/ui';
import React, { useState } from 'react';

import { createExample, createSection } from './utils';

const Example = () => {
  const [colors, setColors] = useState(COLOR_PICKER_CONSTANTS.DEFAULT_COLORS);
  const [selectedColor, setSelectedColor] = useState(COLOR_PICKER_CONSTANTS.DEFAULT_COLORS[0]);

  const saveColor = (color: COLOR_PICKER_CONSTANTS.IColor) => {
    if (!colors.find(({ hue }) => hue === color.hue)) {
      setColors([...colors, color]);
    }
  };

  return (
    <ColorPicker
      tagName="Label"
      colors={colors}
      selectedColor={selectedColor}
      onChange={(color) => setSelectedColor(color)}
      onSaveColor={(color) => saveColor(color)}
    />
  );
};

const standard = createExample('primary', <Example />);

export default createSection('ColorPicker', 'src/components/ColorPicker/index.tsx', [standard]);
