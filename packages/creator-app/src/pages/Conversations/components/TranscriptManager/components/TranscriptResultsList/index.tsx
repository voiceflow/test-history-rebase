import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

import { TranscriptExportFormat } from '@/client/transcript';
import * as Router from '@/ducks/router';
import { currentTranscriptIDSelector, mapTranscriptsSelector } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsListProps {
  transcriptList: Transcript[];
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}

const TranscriptResultsList: React.FC<TranscriptResultsListProps> = ({ transcriptList, onScroll }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  const transcriptMap = useSelector(mapTranscriptsSelector);
  const goToTranscript = useDispatch(Router.goToTargetTranscript);

  React.useEffect(() => {
    const targetTranscriptDoesntExist = currentTranscriptID && !transcriptMap[currentTranscriptID];
    if (transcriptList.length && (targetTranscriptDoesntExist || !currentTranscriptID)) {
      goToTranscript(transcriptList[0].id);
    }
  }, [transcriptList, currentTranscriptID]);

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
              height={20}
            />
          );
        }}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
