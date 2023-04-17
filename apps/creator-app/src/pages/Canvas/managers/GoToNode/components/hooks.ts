import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { SharedNodesContext } from '@/pages/Canvas/contexts';

export const useGoToNode = (nodeID: Nullable<string>, diagramID?: Nullable<string>) => {
  const sharedNodes = React.useContext(SharedNodesContext)!;
  const sharedNode = diagramID && nodeID ? sharedNodes[diagramID]?.[nodeID] ?? null : null;

  if (sharedNode?.type === Realtime.BlockType.START) return { ...sharedNode, name: sharedNode.name || 'Start' };
  if (sharedNode?.type === Realtime.BlockType.COMBINED) return sharedNode;

  return null;
};
