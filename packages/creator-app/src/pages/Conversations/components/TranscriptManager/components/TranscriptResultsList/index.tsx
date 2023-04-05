import { useContextApi } from '@voiceflow/ui';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';

import { currentTranscriptIDSelector } from '@/ducks/transcript';
import { useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';
import { ListData } from './types';

interface TranscriptResultsListProps {
  transcriptList: Transcript[];
}

const TranscriptResultsList: React.FC<TranscriptResultsListProps> = ({ transcriptList }) => {
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  const currentTranscriptIndex = React.useMemo(() => transcriptList.findIndex(({ id }) => id === currentTranscriptID), [currentTranscriptID]);

  const getItemKey = React.useCallback((index: number, { transcripts }: ListData) => transcripts[index].id, []);

  const listData = useContextApi<ListData>({
    transcripts: transcriptList,
    currentTranscriptID,
  });

  return (
    <Container>
      <AutoSizer>
        {({ width, height }) => (
          <FixedSizeList
            width={width}
            height={height}
            itemKey={getItemKey}
            itemData={listData}
            itemSize={90}
            itemCount={transcriptList.length}
            overscanCount={10}
            initialScrollOffset={currentTranscriptIndex * 90}
          >
            {TranscriptResultsItem}
          </FixedSizeList>
        )}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;
