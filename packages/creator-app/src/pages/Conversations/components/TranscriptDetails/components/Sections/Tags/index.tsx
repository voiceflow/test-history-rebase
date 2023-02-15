import React from 'react';
import { useSelector } from 'react-redux';

import ReportTagInput from '@/components/ReportTagInput';
import { currentTranscriptSelector } from '@/ducks/transcript';

import { Container, SectionTitle } from '../components';

const Tags: React.FC = () => {
  const { reportTags = [] } = useSelector(currentTranscriptSelector) ?? {};

  return (
    <Container style={{ padding: '20px 32px' }} withBackground>
      <SectionTitle>TAGS</SectionTitle>
      <ReportTagInput selectedTags={reportTags} />
    </Container>
  );
};

export default Tags;
