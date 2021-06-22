import React from 'react';
import { useSelector } from 'react-redux';

import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import EditableComment from '@/pages/Canvas/components/ThreadEditor/components/EditableComment';

import { Container } from './components';

export const HEIGHT = 150;

const TranscriptNotes: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { notes } = currentTranscript;

  return (
    <Container height={HEIGHT}>
      <EditableComment
        height={HEIGHT}
        placeholder="Leave notes or @mention"
        isEditing={true}
        initialValues={{ text: notes!, mentions: [] }}
        onSave={() => alert('saved!')}
        hasHeader={false}
      />
    </Container>
  );
};

export default TranscriptNotes;
