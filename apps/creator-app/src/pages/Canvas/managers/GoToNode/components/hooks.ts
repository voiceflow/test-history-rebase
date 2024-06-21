import { Nullable } from '@voiceflow/common';
import { NodeType } from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks/feature.hook';
import { BlockNodeResourceByNodeIDMapByDiagramIDMapContext, SharedNodesContext } from '@/pages/Canvas/contexts';

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useGoToNode = (nodeID: Nullable<string>, diagramID?: Nullable<string>) => {
  const referenceSystem = useFeature(Realtime.FeatureFlag.REFERENCE_SYSTEM);

  const sharedNodes = React.useContext(SharedNodesContext)!;
  const blockNodeResourceByNodeIDMapByDiagramIDMap = React.useContext(
    BlockNodeResourceByNodeIDMapByDiagramIDMapContext
  )!;

  if (referenceSystem) {
    const blockReference =
      diagramID && nodeID ? blockNodeResourceByNodeIDMapByDiagramIDMap[diagramID]?.[nodeID] ?? null : null;

    return blockReference
      ? {
          name:
            blockReference.metadata.nodeType === NodeType.START
              ? blockReference.metadata.name || 'Start'
              : blockReference.metadata.name,
          nodeID: blockReference.resourceID,
        }
      : null;
  }

  const sharedNode = diagramID && nodeID ? sharedNodes[diagramID]?.[nodeID] ?? null : null;

  if (sharedNode?.type === Realtime.BlockType.START) return { ...sharedNode, name: sharedNode.name || 'Start' };
  if (sharedNode?.type === Realtime.BlockType.COMBINED) return sharedNode;

  return null;
};
