import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

import { TranscriptExportFormat } from '@/client/transcript';
import { currentTranscriptIDSelector } from '@/ducks/transcript';
import { useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsListProps {
  transcriptList: Transcript[];
  onScroll: (e: React.UIEvent<HTMLElement>) => void;
}

const TranscriptResultsList: React.FC<TranscriptResultsListProps> = ({ transcriptList, onScroll }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);
  return (
    <Container onScroll={onScroll}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <List
              height={height}
              width={width}
              rowCount={transcriptList.length}
              rowHeight={90}
              overscanRowCount={10}
              rowRenderer={({ key, index, style }) => {
                const data = transcriptList[index];
                const isLastItem = transcriptList.length === index + 1;
                return (
                  <div key={key} style={style}>
                    <TranscriptResultsItem
                      format={TranscriptExportFormat.CSV}
                      data={data}
                      active={currentTranscriptID?.toString() === data.id.toString()}
                      isLastItem={isLastItem}
                    />
                  </div>
                );
              }}
            />
          );
        }}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
