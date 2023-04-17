/* eslint-disable no-param-reassign */

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID } from '@/hooks/select';
import { getDiagramName } from '@/utils/diagram';

import { Group, Multilevel, Option } from './types';

const createDiagramOptions = <OptionsMap extends Record<string, Option | Group> | Record<string, Option | Multilevel>>(
  diagramID: string,
  optionsMap: OptionsMap,
  diagramSharedNodes: Realtime.diagram.sharedNodes.SharedNodeMap
) =>
  Object.values(diagramSharedNodes).reduce<Option[]>((acc, sharedNode) => {
    if (sharedNode?.type !== Realtime.BlockType.COMBINED && sharedNode?.type !== Realtime.BlockType.START) return acc;
    if (sharedNode.type !== Realtime.BlockType.START && !sharedNode.name) return acc;

    const option = {
      id: createGroupedSelectID(diagramID, sharedNode.nodeID),
      label: sharedNode.type === Realtime.BlockType.START ? sharedNode.name || 'Start' : sharedNode.name,
      stepID: sharedNode.nodeID,
      diagramID,
    };

    acc.push(option);
    optionsMap[option.id] = option;

    return acc;
  }, []);

export const useDiagramsBlocksOptionsMap = () => {
  const sharedNodes = useSelector(DiagramV2.sharedNodesSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);

  return React.useMemo(() => {
    return Object.entries(sharedNodes).reduce<Record<string, Option | Group>>((optionsMap, [diagramID, diagramSharedNodes]) => {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram) return optionsMap;

      const diagramOptions = createDiagramOptions(diagramID, optionsMap, diagramSharedNodes);

      optionsMap[diagramID] = { id: diagramID, label: getDiagramName(diagram.name), options: diagramOptions };

      return optionsMap;
    }, {});
  }, [sharedNodes, getDiagramByID]);
};
