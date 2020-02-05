import React from 'react';

import VideoPlayer from '.';

export default {
  title: 'Video Player',
  component: VideoPlayer,
};

export const internal = () => <VideoPlayer height="300px" width="500px" link="/SampleVideo.mp4" />;

export const external = () => <VideoPlayer height="300px" width="500px" link="https://www.youtube.com/embed/aqz-KE-bpKQ" />;
