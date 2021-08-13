import React from 'react';
import { useSelector } from 'react-redux';

import { currentSelectedTranscriptSelector } from '@/ducks/transcript';
import * as Transcript from '@/ducks/transcript';
import { useDebouncedCallback, useDispatch } from '@/hooks';
import EditableComment from '@/pages/Canvas/components/ThreadEditor/components/EditableComment';

import { Container } from './components';

export const HEIGHT = 260;

const TranscriptNotes: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);

  const { notes } = currentTranscript;
  const saveNote = useDispatch(Transcript.updateNotes);

  const debouncedSave = useDebouncedCallback(
    500,
    (text: string) => {
      saveNote(currentTranscriptID!, text);
    },
    [currentTranscriptID]
  );

  return (
    <Container height={HEIGHT}>
      <EditableComment
        height={HEIGHT}
        placeholder="Leave notes or @mention"
        isEditing={true}
        onChange={debouncedSave}
        initialValues={{ text: notes || '', mentions: [] }}
        hasHeader={false}
      />
    </Container>
  );
};

export default TranscriptNotes;
