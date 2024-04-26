/* eslint-disable no-param-reassign */

import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Designer, Diagram } from '@/ducks';
import { useSelector } from '@/hooks/redux';
import { createGroupedSelectID } from '@/hooks/select';
import { getDiagramName, isComponentDiagram } from '@/utils/diagram.utils';

import type { Group, Multilevel, Option } from './types';

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
      nodeID: sharedNode.nodeID,
      diagramID,
    };

    acc.push(option);
    optionsMap[option.id] = option;

    return acc;
  }, []);

export const useDiagramsBlocksOptionsMap = () => {
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);
  const getDiagramByID = useSelector(Diagram.getDiagramByIDSelector);
  const flowMapByDiagramID = useSelector(Designer.Flow.selectors.mapByDiagramID);

  return React.useMemo(() => {
    return Object.entries(sharedNodes).reduce<Record<string, Option | Group>>(
      (optionsMap, [diagramID, diagramSharedNodes]) => {
        const diagram = getDiagramByID({ id: diagramID });

        if (!diagram) return optionsMap;
        const flow = isComponentDiagram(diagram.type) ? flowMapByDiagramID[diagram.id] : null;

        const diagramOptions = createDiagramOptions(diagramID, optionsMap, diagramSharedNodes);
        const diagramName = flow ? flow.name : getDiagramName(diagram.name);

        optionsMap[diagramID] = { id: diagramID, label: diagramName, options: diagramOptions };

        return optionsMap;
      },
      {}
    );
  }, [sharedNodes, getDiagramByID]);
};
