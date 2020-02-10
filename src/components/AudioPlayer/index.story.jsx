import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import React from 'react';

import { styled } from '@/hocs';

import AudioPlayer from '.';

// eslint-disable-next-line no-secrets/no-secrets
const DEMO_MP3_LINK = 'https://file-examples.com/wp-content/uploads/2017/11/file_example_MP3_700KB.mp3';

const Container = styled.div`
  margin-top: 100px;
  width: 400px;
`;

const getProps = () => ({
  showDuration: boolean('Show Duration', false),
  onClose: action('button-click'),
});

export default {
  title: 'Audio Player',
  component: AudioPlayer,
  includeStories: [],
};

export const normal = () => (
  <Container>
    <AudioPlayer {...getProps()} link={DEMO_MP3_LINK} />
  </Container>
);
