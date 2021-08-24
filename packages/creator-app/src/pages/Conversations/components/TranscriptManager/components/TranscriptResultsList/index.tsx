import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { AutoSizer, List } from 'react-virtualized';

import { TranscriptExportFormat } from '@/client/transcript';
import * as Router from '@/ducks/router';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsListProps {
  transcriptList: Transcript[];
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}

const TranscriptResultsList: React.FC<TranscriptResultsListProps> = ({ transcriptList, onScroll }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const goToTranscript = useDispatch(Router.goToTargetTranscript);
  const location = useLocation();
  const match = matchPath(location.pathname, { path: '/project/:versionID/transcripts' });
  const noUrlTranscriptTarget = match?.isExact;

  React.useEffect(() => {
    if (transcriptList.length && noUrlTranscriptTarget) {
      goToTranscript(transcriptList[0].id);
    }
  }, [transcriptList]);

  return (
    <Container onScroll={onScroll}>
      <AutoSizer disableHeight={true}>
        {({ width }) => {
          return (
            <List
              width={width}
              rowCount={transcriptList.length}
              rowHeight={89}
              autoHeight
              rowRenderer={({ key, index }) => {
                const data = transcriptList[index];
                const isLastItem = transcriptList.length === index + 1;
                return (
                  <TranscriptResultsItem
                    key={key}
                    format={TranscriptExportFormat.CSV}
                    data={data}
                    active={currentTranscriptID?.toString() === data.id.toString()}
                    isLastItem={isLastItem}
                  />
                );
              }}
              height={1000}
            />
          );
        }}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
