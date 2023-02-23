import React from 'react';

import { bannerBg } from '@/assets';
import { openURLInANewTab } from '@/utils/window';

import * as S from '../styles';

const Banner: React.FC = () => (
  <S.StyledBanner
    mb={14}
    title="Learn Voiceflow with video tutorials"
    subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
    closeKey="dashboard-learn-banner"
    buttonText="Start Course"
    backgroundImage={bannerBg}
    onClick={() => openURLInANewTab('https://voiceflow.zendesk.com/hc/en-us ')}
  />
);

export default Banner;
