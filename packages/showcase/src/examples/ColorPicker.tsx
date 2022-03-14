import { ColorPicker } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', <ColorPicker />);

export default createSection('ColorPicker', 'src/components/ColorPicker/index.tsx', [standard]);
