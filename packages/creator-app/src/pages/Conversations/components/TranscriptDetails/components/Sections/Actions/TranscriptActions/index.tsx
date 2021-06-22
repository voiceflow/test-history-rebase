import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addTag, currentSelectedTranscriptSelector, currentTranscriptIDSelector, removeTag } from '@/ducks/transcript';
import { SystemTag } from '@/models';
import THEME from '@/styles/theme';

import { Container } from './components';
import ActionButton from './components/ActionButton';

const TranscriptActions: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const dispatch = useDispatch();

  const { tags } = currentTranscript || {};
  const isSaved = !!tags?.includes(SystemTag.SAVED);
  const isReviewed = !!tags?.includes(SystemTag.REVIEWED);

  const handleReviewedClick = () => {
    isReviewed ? dispatch(removeTag(currentTranscriptID!, SystemTag.REVIEWED)) : dispatch(addTag(currentTranscriptID!, SystemTag.REVIEWED));
  };

  const handleSavedClick = () => {
    isSaved ? dispatch(removeTag(currentTranscriptID!, SystemTag.SAVED)) : dispatch(addTag(currentTranscriptID!, SystemTag.SAVED));
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
      <ActionButton onClick={() => alert('Deleted')} icon="garbage" label="Delete" color={THEME.colors.tertiary} />
    </Container>
  );
};

export default TranscriptActions;
