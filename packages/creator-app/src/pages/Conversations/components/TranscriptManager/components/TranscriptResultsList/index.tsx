import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

import { TranscriptExportFormat } from '@/client/transcript';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import { useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsListProps {
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
  transcriptList: Transcript[];
}

const TranscriptResultsList: React.FC<TranscriptResultsListProps> = ({ transcriptList, onScroll }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  const currentTranscriptIndex = React.useMemo(() => transcriptList.findIndex(({ id }) => id === currentTranscriptID), [currentTranscriptID]);

  return (
    <Container onScroll={onScroll}>
      <AutoSizer>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            rowCount={transcriptList.length}
            rowHeight={90}
            scrollToIndex={currentTranscriptIndex}
            overscanRowCount={10}
            rowRenderer={({ key, index, style }) => {
              const data = transcriptList[index];
              const isLastItem = transcriptList.length === index + 1;

              return (
                <div key={key} style={style}>
                  <TranscriptResultsItem
                    data={data}
                    format={TranscriptExportFormat.CSV}
                    active={currentTranscriptID?.toString() === data.id.toString()}
                    isLastItem={isLastItem}
                  />
                </div>
              );
            }}
          />
        )}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
