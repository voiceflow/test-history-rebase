import { Nullable } from '@voiceflow/common';
import React from 'react';

import { StartingBlocksContext } from '@/pages/Canvas/contexts';

export const useGoToNode = (nodeID: Nullable<string>, diagramID?: Nullable<string>) => {
  const startingBlocks = React.useContext(StartingBlocksContext)!;

  return diagramID && nodeID ? startingBlocks[diagramID]?.[nodeID] ?? null : null;
};
