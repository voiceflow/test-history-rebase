import React from 'react';
import { useSelector } from 'react-redux';

import { currentTranscriptSelector } from '@/ducks/transcript';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useTrackingEvents } from '@/hooks';
import EditableComment from '@/pages/Canvas/components/ThreadEditor/components/EditableComment';

import { Container } from './components';

export const HEIGHT = 180;

const TranscriptNotes: React.FC = () => {
  const { notes } = useSelector(currentTranscriptSelector) ?? {};
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);
  const [trackingEvents] = useTrackingEvents();

  const saveNote = useDispatch(Transcript.updateNotes);

  const saveText = ({ text }: { text: string }) => {
    if (!currentTranscriptID) {
      return;
    }

    saveNote(currentTranscriptID, text);
    trackingEvents.trackConversationNotesUpdated();
  };

  return (
    <Container height={HEIGHT}>
      <EditableComment
        height={HEIGHT}
        autoFocusInput={false}
        placeholder="Leave notes or @mention"
        isEditing
        initialValues={{ text: notes || '', mentions: [] }}
        hasHeader={false}
        onBlur={saveText}
      />
    </Container>
  );
};

export default TranscriptNotes;
