import React from 'react';
import { useSelector } from 'react-redux';

import { currentTranscriptSelector } from '@/ducks/transcript';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useTrackingEvents } from '@/hooks';
import EditableComment, { EditableCommentRef } from '@/pages/Canvas/components/ThreadEditor/components/EditableComment';

import { Container } from './components';

const TranscriptNotes: React.FC = () => {
  const { notes } = useSelector(currentTranscriptSelector) ?? {};
  const editableRef = React.useRef<EditableCommentRef>(null);
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
    <Container onClick={() => editableRef.current?.focus()}>
      <EditableComment
        ref={editableRef}
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
