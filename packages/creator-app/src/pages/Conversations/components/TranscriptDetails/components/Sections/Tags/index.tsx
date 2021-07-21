import React from 'react';
import { useSelector } from 'react-redux';

import ReportTagInput from '@/components/ReportTagInput';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';

import { Container, SectionTitle } from '../components';

const Tags: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { tags } = currentTranscript;

  return (
    <Container style={{ flex: 1 }} withBackground>
      <SectionTitle>TAGS</SectionTitle>
      <ReportTagInput selectedTags={tags} />
    </Container>
  );
};

export default Tags;
