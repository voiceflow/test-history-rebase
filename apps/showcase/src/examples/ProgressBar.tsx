import { ProgressBar } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const normalProgressBar = createExample('empty progress', () => <ProgressBar width={50} color="#531ea4" height={2} progress={0} />);

const halfProgressBar = createExample('half progress', () => <ProgressBar width={50} color="#531ea4" height={2} progress={0.5} />);

const fullProgressBar = createExample('full progress', () => <ProgressBar width={50} color="#531ea4" height={2} progress={1} />);

const ladingProgressBar = createExample('loading', () => <ProgressBar width={50} color="#463bbc" height={2} progress={0.3} loading />);

const customBackgroundProgressBar = createExample('custom background', () => (
  <ProgressBar width={100} color="#463bbc" height={5} progress={0.3} background="#877817" />
));

export default createSection('ProgressBar', 'src/components/ProgressBar/index.tsx', [
  normalProgressBar,
  halfProgressBar,
  fullProgressBar,
  ladingProgressBar,
  customBackgroundProgressBar,
]);
