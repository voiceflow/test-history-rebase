import { Toggle } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const normalToggle = createExample('normal', () => <Toggle onChange={() => {}} checked />);
const toggleWithLabel = createExample('with label', () => <Toggle onChange={() => {}} checked hasLabel />);

export default createSection('Toggle', 'src/components/Toggle/index.tsx', [normalToggle, toggleWithLabel]);
