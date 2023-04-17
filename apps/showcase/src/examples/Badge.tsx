import { Badge } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const normalBadge = createExample('normal', () => <Badge>foo</Badge>);

const colorfulBadge = createExample('colorful', () => <Badge color="red">foo</Badge>);

export default createSection('Badge', 'src/components/Badge/index.tsx', [normalBadge, colorfulBadge]);
