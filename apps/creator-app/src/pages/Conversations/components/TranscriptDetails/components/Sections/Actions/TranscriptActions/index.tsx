import React from 'react';
import { useSelector } from 'react-redux';

import * as Transcript from '@/ducks/transcript';
import { useDispatch } from '@/hooks';
import { useConfirmModal } from '@/hooks/modal.hook';
import { SystemTag } from '@/models';
import { Identifier } from '@/styles/constants';
import THEME from '@/styles/theme';

import { Container } from './components';
import ActionButton from './components/ActionButton';

const TranscriptActions: React.FC = () => {
  const { reportTags } = useSelector(Transcript.currentTranscriptSelector) ?? {};
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);

  const confirmModal = useConfirmModal();
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);

  const addTag = useDispatch(Transcript.addTag);
  const removeTag = useDispatch(Transcript.removeTag);

  const isSaved = React.useMemo(() => !!reportTags?.includes(SystemTag.SAVED), [reportTags]);
  const isReviewed = React.useMemo(() => !!reportTags?.includes(SystemTag.REVIEWED), [reportTags]);

  const handleReviewedClick = () => {
    if (!currentTranscriptID) return;

    if (isReviewed) {
      removeTag(currentTranscriptID, SystemTag.REVIEWED);
    } else {
      addTag(currentTranscriptID, SystemTag.REVIEWED);
    }
  };

  const handleSavedClick = () => {
    if (!currentTranscriptID) return;

    if (isSaved) {
      removeTag(currentTranscriptID, SystemTag.SAVED);
    } else {
      addTag(currentTranscriptID, SystemTag.SAVED);
    }
  };

  const handleDelete = () => {
    const targetID = currentTranscriptID;

    if (!targetID) return;

    confirmModal.openVoid({
      body: 'Are you sure you want to delete this conversation?',

      header: 'Delete Conversation',

      confirmButtonText: 'Delete',

      confirm: () => deleteTranscript(targetID),
    });
  };

  return (
    <Container>
      <ActionButton
        id={Identifier.MARK_AS_REVIEWED_TRANSCRIPT_BUTTON}
        icon={isReviewed ? 'checkmarkFilled' : 'checkmark2'}
        color={isReviewed ? '#449127' : THEME.colors.tertiary}
        label="Mark as Reviewed"
        onClick={handleReviewedClick}
        selected={isReviewed}
      />

      <ActionButton
        id={Identifier.SAVE_FOR_LATER_TRANSCRIPT_BUTTON}
        left={1}
        icon={isSaved ? 'bookmarkActive' : 'bookmark2'}
        label="Save for Later"
        color={isSaved ? '#bf395b' : THEME.colors.tertiary}
        onClick={handleSavedClick}
        selected={isSaved}
      />

      <ActionButton id={Identifier.DELETE_TRANSCRIPT_BUTTON} onClick={handleDelete} icon="trash" label="Delete" color={THEME.colors.tertiary} />
    </Container>
  );
};

export default TranscriptActions;
