import React from 'react';

import { Container, Player } from './components';

interface VideoPlayerProps {
  src: string;
  width?: number | string;
  height?: number | string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, height, width }) => (
  <Container height={height} width={width}>
    <Player src={src} allowFullScreen />
  </Container>
);

export default VideoPlayer;
