import React from 'react';

import { styled } from '@/hocs';

import ResultsMetaFooter from './components/ResultsMetaFooter';

const RawContainer = styled.pre`
  background: #142e55;
  color: #e1d40b;
  font-size: 13px;
  padding: 15px;
  max-height: inherit;
  overflow: auto;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const Container = styled.div`
  max-height: inherit;
`;

function RawResults({ requestResponse, responseMetaData }) {
  const content = JSON.stringify(requestResponse, null, 2);
  return (
    <Container>
      <RawContainer className="mb-0">{content}</RawContainer>
      <ResultsMetaFooter data={responseMetaData} />
    </Container>
  );
}

export default RawResults;
