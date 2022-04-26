import { HueSlider } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', () => <HueSlider />);

export default createSection('HueSlider', 'src/components/HueSlider/index.tsx', [standard]);
