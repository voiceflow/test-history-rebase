/* eslint-disable no-param-reassign */
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { createGroupedSelectID, useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';

import { Group, Option } from './types';

const createDiagramOptions = ({
  diagramID,
  optionsMap,
  getIntentByID,
  diagramSharedNodes,
  diagramGlobalStepMap,
}: {
  platform: Platform.Constants.PlatformType;
  diagramID: string;
  optionsMap: Record<string, Option | Group>;
  getIntentByID: ReturnType<typeof IntentV2.getPlatformIntentByIDSelector>;
  diagramSharedNodes: Realtime.diagram.sharedNodes.SharedNodeMap;
  diagramGlobalStepMap: Record<string, string[]>;
}) =>
  Object.values(diagramSharedNodes).reduce<Option[]>((acc, sharedNode) => {
    if (sharedNode?.type !== Realtime.BlockType.INTENT) return acc;

    const intent = getIntentByID({ id: sharedNode.intentID });

    if (!intent || !diagramGlobalStepMap[intent.id]?.length) return acc;

    const option = {
      id: createGroupedSelectID(diagramID, intent.id),
      label: intent.name,
      intentID: intent.id,
      diagramID,
    };

    acc.push(option);
    optionsMap[option.id] = option;

    return acc;
  }, []);

export const useDiagramsIntentsOptionsMap = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const sharedNodes = useSelector(DiagramV2.sharedNodesSelector);
  const activeDiagram = useSelector(DiagramV2.active.diagramSelector);
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const globalIntentStepMap = useSelector(DiagramV2.globalIntentStepMapSelector);

  return React.useMemo(() => {
    const optionsMap: Record<string, Option | Group> = {};

    return Object.entries(sharedNodes).reduce<Record<string, Option | Group>>((optionsMap, [diagramID, diagramSharedNodes]) => {
      const diagram = getDiagramByID({ id: diagramID });

      if (!diagram) return optionsMap;

      const diagramOptions = createDiagramOptions({
        platform,
        diagramID,
        optionsMap,
        getIntentByID,
        diagramSharedNodes,
        diagramGlobalStepMap: globalIntentStepMap[diagramID] ?? {},
      });

      optionsMap[diagramID] = { id: diagramID, label: getDiagramName(diagram.name), options: diagramOptions };

      return optionsMap;
    }, optionsMap);
  }, [platform, sharedNodes, getIntentByID, activeDiagram, getDiagramByID, globalIntentStepMap]);
};
