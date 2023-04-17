import { COLOR_PICKER_CONSTANTS, ColorPicker } from '@voiceflow/ui';
import React, { useState } from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', () => {
  const [selectedColor, setSelectedColor] = useState<string>(
    COLOR_PICKER_CONSTANTS.DEFAULT_SCHEME_COLORS[COLOR_PICKER_CONSTANTS.ColorScheme.DARK].palette[500]
  );

  return <ColorPicker tagName="Label" onChange={(color) => setSelectedColor(color)} selectedColor={selectedColor} />;
});

export default createSection('ColorPicker', 'src/components/ColorPicker/index.tsx', [standard]);
