import React from 'react';
import { AutoSizer, List } from 'react-virtualized';

import * as Router from '@/ducks/router';
import { currentTranscriptIDSelector, mapTranscriptsSelector } from '@/ducks/transcript';
import { useDispatch, useSelector } from '@/hooks';
import { Transcript } from '@/models';

import { Container, TranscriptResultsItem } from './components';

interface TranscriptResultsList {
  transcriptList: Transcript[];
}

const TranscriptResultsList = ({ transcriptList }: TranscriptResultsList) => {
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
