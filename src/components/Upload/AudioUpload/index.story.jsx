import React from 'react';

import { styled } from '@/hocs';

import AudioUpload from '.';

const UPLOAD_ENDPOINT = 'raw_audio';

const Container = styled.div`
  width: 420px;
`;

const getProps = () => {
  const [audioLink, setAudioLink] = React.useState(null);

  return {
    audio: audioLink,
    update: setAudioLink,
  };
};

export default {
  title: 'Upload/Audio',
  component: AudioUpload,
  includeStories: [],
};

export const normal = () => (
  <Container>
    <AudioUpload {...getProps()} endpoint={UPLOAD_ENDPOINT} />
  </Container>
);
