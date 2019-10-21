import React from 'react';

import AudioDrop from '@/components/Uploads/AudioDrop';
import { styled } from '@/hocs';

const Container = styled.div`
  margin-top: 10px;
`;
function AudioReprompt({ data, onChange }) {
  const updateAudio = (url) => {
    onChange({ reprompt: { ...data.reprompt, audio: url } });
  };
  return (
    <Container>
      <AudioDrop audio={data.reprompt.audio} update={updateAudio} stream />
    </Container>
  );
}

export default AudioReprompt;
