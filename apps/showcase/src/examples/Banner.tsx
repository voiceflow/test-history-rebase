import { Banner } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const normalBanner = createExample('normal', () => (
  <Banner
    title="Learn Voiceflow with video tutorials"
    subtitle="In this course you'll find everything you need to get started with Voiceflow from the ground up."
    buttonText="Start Course"
    onClick={() => {}}
  ></Banner>
));

export default createSection('Banner', 'src/components/Banner/index.tsx', [normalBanner]);
