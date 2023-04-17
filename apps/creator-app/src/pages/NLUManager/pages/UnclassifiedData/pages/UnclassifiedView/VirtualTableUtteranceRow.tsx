import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';
import { ListChildComponentProps } from 'react-window';

import { useNLUManager } from '@/pages/NLUManager/context';
import { TableUtteranceRow } from '@/pages/NLUManager/pages/UnclassifiedData/components';

const VirtualTableUtteranceRow: React.FC<ListChildComponentProps<Realtime.NLUUnclassifiedUtterances[]>> = ({ index, data, style }) => {
  const nluManager = useNLUManager();

  const item = data[index];

  return (
    <Box style={style}>
      <TableUtteranceRow
        item={item}
        onSelect={() => nluManager.toggleSelectedUnclassifiedUtteranceID(item.id)}
        isActive={nluManager.selectedUnclassifiedUtteranceIDs.has(item.id)}
        rowIndex={index}
        allItems={nluManager.filteredUtterances}
        similarity={nluManager.isFindingSimilar ? nluManager.similarityScores?.[item.id] ?? 0 : null}
      />
    </Box>
  );
};

export default VirtualTableUtteranceRow;
