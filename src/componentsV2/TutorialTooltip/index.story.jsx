import React from 'react';

import Collapsable from '@/componentsV2/Collapsable';
import { Section, Title } from '@/componentsV2/Tooltip';
import VideoPlayer from '@/componentsV2/VideoPlayer';

import TutorialTooltip from '.';

export default {
  title: 'Tutorial Tooltip',
  component: TutorialTooltip,
};

export const normal = () => (
  <TutorialTooltip anchorRenderer={() => <span>How it works</span>} title="Choice Block Tutorial">
    <>
      <Section>
        <VideoPlayer link="https://www.youtube.com/embed/mxe1iwDboHc" />
      </Section>
      <Title isSubtitle>Tutorial Recap</Title>

      <Collapsable title="Dummy text">
        <Section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Section>
        <Title isSubtitle>SubTitle</Title>
        <Section>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Section>
      </Collapsable>

      <Collapsable title="Another Dummy text">
        <Section>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </Section>
        <Title isSubtitle>SubTitle</Title>
        <VideoPlayer link="https://www.youtube.com/embed/3ggIHfwkIWM" />
      </Collapsable>
    </>
  </TutorialTooltip>
);
