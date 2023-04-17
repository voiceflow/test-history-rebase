import React from 'react';

import MentionEditor from '@/components/MentionEditor';
import { currentTranscriptSelector } from '@/ducks/transcript';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useLinkedState, useSelector, useTrackingEvents } from '@/hooks';

import { Container } from './components';

const TranscriptNotes: React.FC = () => {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const { notes } = useSelector(currentTranscriptSelector) ?? {};
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);

  const updateNotes = useDispatch(Transcript.updateNotes);

  const [trackingEvents] = useTrackingEvents();
  const [localNotes, setLocalNotes] = useLinkedState(notes ?? '');

  const onBlur = () => {
    if (!currentTranscriptID) return;

    updateNotes(currentTranscriptID, localNotes);
    trackingEvents.trackConversationNotesUpdated();
  };

  return (
    <Container onClick={() => inputRef.current?.focus()}>
      <MentionEditor value={localNotes} onBlur={onBlur} onChange={setLocalNotes} inputProps={{ inputRef }} placeholder="Leave notes or @mention" />
    </Container>
  );
};

export default TranscriptNotes;
