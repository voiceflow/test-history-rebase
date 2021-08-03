import React from 'react';
import { useSelector } from 'react-redux';

import * as Modal from '@/ducks/modal';
import * as Transcript from '@/ducks/transcript';
import { useDispatch } from '@/hooks';
import { SystemTag } from '@/models';
import THEME from '@/styles/theme';

import { Container } from './components';
import ActionButton from './components/ActionButton';

const TranscriptActions: React.FC = () => {
  const currentTranscript = useSelector(Transcript.currentSelectedTranscriptSelector);
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);
  const deleteTranscript = useDispatch(Transcript.deleteTranscript);
  const confirmDelete = useDispatch(Modal.setConfirm);

  const { reportTags } = currentTranscript || {};
  const isSaved = !!reportTags?.includes(SystemTag.SAVED);
  const isReviewed = !!reportTags?.includes(SystemTag.REVIEWED);
  const removeTag = useDispatch(Transcript.removeTag);
  const addTag = useDispatch(Transcript.addTag);

  const handleReviewedClick = () => {
    isReviewed ? removeTag(currentTranscriptID!, SystemTag.REVIEWED) : addTag(currentTranscriptID!, SystemTag.REVIEWED);
  };

  const handleSavedClick = () => {
    isSaved ? removeTag(currentTranscriptID!, SystemTag.SAVED) : addTag(currentTranscriptID!, SystemTag.SAVED);
  };

  const handleDelete = () => {
    confirmDelete({
      warning: false,
      text: 'Are you sure you want to delete this conversation?',
      confirm: () => deleteTranscript(currentTranscript.id),
    });
  };

  return (
    <Container>
      <ActionButton
        onClick={handleReviewedClick}
        icon={isReviewed ? 'checkmarkFilled' : 'check2'}
        color={isReviewed ? '#3e9e3e' : THEME.colors.tertiary}
        label="Mark as Reviewed"
        selected={isReviewed}
      />
      <ActionButton
        left={1}
        selected={isSaved}
        onClick={handleSavedClick}
        icon="bookmark"
        label="Save for Later"
        color={isSaved ? THEME.colors.red : THEME.colors.tertiary}
      />
      <ActionButton onClick={handleDelete} icon="garbage" label="Delete" color={THEME.colors.tertiary} />
    </Container>
  );
};

export default TranscriptActions;
