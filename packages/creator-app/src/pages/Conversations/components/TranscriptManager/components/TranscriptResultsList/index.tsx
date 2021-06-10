import React from 'react';
import { useLocation } from 'react-router-dom';
import { AutoSizer, List } from 'react-virtualized';

import { ProjectRoute } from '@/config/routes';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsList {
  transcriptList: Transcript[];
}

const TranscriptResultsList = ({ transcriptList }: TranscriptResultsList) => {
  const { pathname } = useLocation();
  const activeTranscriptID = pathname.split(`${ProjectRoute.CONVERSATIONS}`)[1]?.replace('/', '').split('?')[0] || null;

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
                return <TranscriptResultsItem key={key} data={transcriptList[index]} active={activeTranscriptID === data.id} />;
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
