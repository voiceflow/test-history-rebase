import React from 'react';
import { useSelector } from 'react-redux';

import { currentSelectedTranscriptSelector } from '@/ducks/transcript';

import { Actions, Container, Context, Notes, Tags } from './components';

const TranscriptDetails: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);

  return (
    <Container>
      {currentTranscript && (
        <>
          <Context />
          <Actions />
          <Tags />
          <Notes />
        </>
      )}
    </Container>
  );
};

export default TranscriptDetails;
