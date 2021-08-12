import React from 'react';
import { useSelector } from 'react-redux';

import ReportTagInput from '@/components/ReportTagInput';
import { currentSelectedTranscriptSelector } from '@/ducks/transcript';

import { Container, SectionTitle } from '../components';

const Tags: React.FC = () => {
  const currentTranscript = useSelector(currentSelectedTranscriptSelector);
  const { reportTags } = currentTranscript;

  return (
    <Container style={{ flex: 1, paddingBottom: '24px' }} withBackground>
      <SectionTitle>TAGS</SectionTitle>
      <ReportTagInput selectedTags={reportTags} />
    </Container>
  );
};

export default Tags;
