import { VideoPlayer } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const standard = createExample('primary', () => (
  <VideoPlayer src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4" />
));

export default createSection('VideoPlayer', 'src/components/VideoPlayer/index.tsx', [standard]);
