import React from 'react';
import { useSelector } from 'react-redux';
import { AutoSizer, List } from 'react-virtualized';

import { currentTranscriptIDSelector } from '@/ducks/transcript';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsList {
  transcriptList: Transcript[];
}

const TranscriptResultsList = ({ transcriptList }: TranscriptResultsList) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  return (
    <Container>
      <AutoSizer disableHeight={true}>
        {({ width }) => {
          return (
            <List
              width={width}
              rowCount={transcriptList.length}
              rowHeight={88}
              autoHeight
              rowRenderer={({ key, index }) => {
                const data = transcriptList[index];
                return <TranscriptResultsItem key={key} data={data} active={currentTranscriptID === data.id} />;
              }}
              height={20}
            />
          );
        }}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
