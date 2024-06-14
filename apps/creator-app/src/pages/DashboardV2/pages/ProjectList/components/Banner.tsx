import React from 'react';

import { bannerBg } from '@/assets';
import { YOUTUBE_CHANNEL_LINK } from '@/constants/link.constant';
import { useTrackingEvents } from '@/hooks';
import { openURLInANewTab } from '@/utils/window';

import * as S from '../styles';


const Banner: React.FC = () => {

  const [trackingEvents] = useTrackingEvents();

  const openYoutubeChannel = () => {
    trackingEvents.trackStartCourse();
    openURLInANewTab(YOUTUBE_CHANNEL_LINK);
  };

  return <S.StyledBanner
    mb={14}
    title="Learn Voiceflow with video tutorials"
    subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
    closeKey="dashboard-learn-banner"
    buttonText="Start Course"
    backgroundImage={bannerBg}
    onClick={openYoutubeChannel}
  />;
};

export default Banner;
