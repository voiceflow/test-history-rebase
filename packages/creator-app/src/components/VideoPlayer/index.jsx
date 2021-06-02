import React from 'react';

import Player from './components/Player';
import VideoContainer from './components/VideoContainer';

const VideoPlayer = ({ link, height, width }) => (
  <VideoContainer height={height} width={width}>
    <Player src={link} allowFullScreen />
  </VideoContainer>
);

export default VideoPlayer;
