import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ReportTagInput from '@/components/ReportTagInput';
import { ClickableText } from '@/components/Text';
import { ModalType } from '@/constants';
import { currentSelectedTranscriptSelector, updateTags } from '@/ducks/transcript';
import { useModals } from '@/hooks';

import { Container, SectionTitle } from '../components';

const Tags: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const dispatch = useDispatch();

  const { open: openTagManager } = useModals(ModalType.TAG_MANAGER);
  const { tags } = currentTranscript;

  const setTags = (tags: string[]) => {
    dispatch(updateTags(currentTranscript.id, tags));
  };

  return (
    <Container withBackground>
      <SectionTitle>
        TAGS
        <ClickableText onClick={openTagManager}>Manager</ClickableText>
      </SectionTitle>
      <ReportTagInput selectedTags={tags} onChange={setTags} />
    </Container>
  );
};

export default Tags;
