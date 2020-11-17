import React from 'react';

import { Container, VideoControl } from './components';

export type VideoProps = {
  link: string;
};

const Video: React.FC<VideoProps> = ({ link }) => (
  <Container>
    <VideoControl controls>
      <source src={link} type="video/mp4" />
    </VideoControl>
  </Container>
);

export default Video;
