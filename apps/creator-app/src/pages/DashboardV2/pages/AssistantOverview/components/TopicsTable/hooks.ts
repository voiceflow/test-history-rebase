import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Designer, Diagram } from '@/ducks';
import * as Domain from '@/ducks/domain';
import { useSelector } from '@/hooks/redux';
import { getDiagramName } from '@/utils/diagram.utils';

import type { Topic } from './types';

/**
 * @deprecated remove when FeatureFlag.CMS_WORKFLOWS is released
 */
export const useTopics = () => {
  const rootDomain = useSelector(Domain.rootDomainSelector);
  const intentsMap = useSelector(Designer.Intent.selectors.mapWithFormattedBuiltInName);
  const diagramMap = useSelector(Diagram.diagramMapSelector);
  const sharedNodes = useSelector(Diagram.sharedNodesSelector);

  return React.useMemo(() => {
    if (!rootDomain?.id) return { topics: [], domainID: null };

    const getIntents = (id: string, menuItems: BaseModels.Diagram.MenuItem[]) => {
      const intents: Topic['intents'] = [];

      for (const { type, sourceID } of menuItems) {
        if (type === BaseModels.Diagram.MenuItemType.NODE) {
          const sharedNode = sharedNodes[id]?.[sourceID];

          if (
            sharedNode?.type !== Realtime.BlockType.INTENT ||
            !sharedNode.intentID ||
            !intentsMap[sharedNode.intentID]
          )
            continue;

          intents.push({ name: intentsMap[sharedNode.intentID].name, nodeID: sourceID, diagramID: id });
        } else {
          const subtopicDiagram = diagramMap[sourceID];

          if (!subtopicDiagram) continue;

          intents.push(...getIntents(sourceID, subtopicDiagram.menuItems));
        }
      }

      return intents;
    };

    const topics: Topic[] = [];

    for (const id of rootDomain.topicIDs) {
      const topicDiagram = diagramMap[id];

      if (!topicDiagram) continue;

      topics.push({
        id,
        name: getDiagramName(topicDiagram.name),
        intents: getIntents(id, topicDiagram.menuItems),
        domainID: rootDomain.id,
      });
    }

    return { topics, domainID: rootDomain.id };
  }, [rootDomain?.id, rootDomain?.topicIDs, intentsMap, diagramMap, sharedNodes]);
};
