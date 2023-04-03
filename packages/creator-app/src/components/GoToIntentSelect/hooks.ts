/* eslint-disable no-param-reassign */

import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { createGroupedSelectID, useSelector } from '@/hooks';
import { getDiagramName } from '@/utils/diagram';

import { Group, Multilevel, Option } from './types';

const createTopicOptions = <OptionsMap extends Record<string, Option | Group> | Record<string, Option | Multilevel>>({
  diagramID,
  optionsMap,
  getIntentByID,
  diagramSharedNodes,
  diagramGlobalStepMap,
}: {
  platform: Platform.Constants.PlatformType;
  diagramID: string;
  optionsMap: OptionsMap;
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
  const intentNodeDataLookup = useSelector(CreatorV2.intentNodeDataLookupSelector);

  const isComponentActive = !activeDiagram?.type || activeDiagram.type === BaseModels.Diagram.DiagramType.COMPONENT;

  return React.useMemo(() => {
    const optionsMap: Record<string, Option | Group> = {};

    if (isComponentActive && activeDiagram) {
      const activeComponentOptions = Object.values(intentNodeDataLookup).map<Option>(({ intent }) => {
        const option = {
          id: createGroupedSelectID(activeDiagram.id, intent.id),
          label: intent.name,
          intentID: intent.id,
          diagramID: activeDiagram.id,
        };

        optionsMap[option.id] = option;
        return option;
      });

      if (activeComponentOptions.length) {
        optionsMap[activeDiagram.id] = { id: activeDiagram.id, label: getDiagramName(activeDiagram.name), options: activeComponentOptions };
      }
    }

    return Object.entries(sharedNodes).reduce<Record<string, Option | Group>>((optionsMap, [diagramID, diagramSharedNodes]) => {
      const diagram = getDiagramByID({ id: diagramID });

      // creating options map only for topics or active component diagram
      if (diagram?.type !== BaseModels.Diagram.DiagramType.TOPIC) return optionsMap;

      const diagramOptions = createTopicOptions({
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
