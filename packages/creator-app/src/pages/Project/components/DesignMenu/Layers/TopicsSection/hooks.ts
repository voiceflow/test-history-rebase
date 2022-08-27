import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';

import { ROOT_DIAGRAM_LABEL, ROOT_DIAGRAM_NAME } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramDuck from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useDnDReorder, useSelector } from '@/hooks';
import { applyPlatformIntentNameFormatting, prettifyIntentName } from '@/utils/intent';

import { OpenedIDsToggleApi, useOpenedIDsToggle } from '../hooks';

export interface TopicMenuItem {
  name: string;
  type: Realtime.BlockType;
  nodeID: string;
}

export interface TopicItem {
  id: string;
  name: string;
  menuItems: TopicMenuItem[];
}

interface TopicsAPI {
  onDragEnd: (item: TopicItem) => void;
  onDragStart: (item: TopicItem) => void;
  searchValue: string;
  topicsItems: TopicItem[];
  onCreateTopic: VoidFunction;
  focusedNodeID: Nullable<string>;
  rootDiagramID: Nullable<string>;
  setSearchValue: (value: string) => void;
  activeDiagramID: Nullable<string>;
  onReorderTopics: (from: number, to: number) => void;
  searchMatchValue: string;
  searchTopicsItems: TopicItem[];
  searchOpenedTopics: Record<string, true>;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

export const useTopics = (): TopicsAPI & Omit<OpenedIDsToggleApi, 'onDragStart' | 'onDragEnd'> => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const sharedNodes = useSelector(DiagramV2.sharedNodesSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);
  const topicDiagrams = useSelector(DiagramV2.active.topicDiagramsSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const { target: focusedNodeID, isActive: isFocusedNodeActive } = useSelector(Creator.creatorFocusSelector);

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const reorderTopics = useDispatch(Version.reorderTopics);
  const createTopicDiagram = useDispatch(DiagramDuck.createTopicDiagram);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [lastCreatedDiagramID, setLastCreatedDiagramID] = React.useState<Nullable<string>>(null);

  const dndReorder = useDnDReorder({
    getID: (item: TopicItem) => item.id,
    onPersist: (fromID: string, toIndex: number) => reorderTopics({ fromID, toIndex }),
    onReorder: (fromID: string, toIndex: number) => reorderTopics({ fromID, toIndex, skipPersist: true }),
  });

  const openedIDsToggle = useOpenedIDsToggle('topics');

  const topicsItems = React.useMemo(
    () =>
      topicDiagrams.map<TopicItem>((diagram) => ({
        id: diagram.id,
        name: rootDiagramID === diagram.id && diagram.name === ROOT_DIAGRAM_NAME ? ROOT_DIAGRAM_LABEL : diagram.name,
        menuItems: diagram.menuNodeIDs
          .map<TopicMenuItem | null>((menuNodeID) => {
            const sharedNode = sharedNodes[diagram.id]?.[menuNodeID];

            if (sharedNode?.type === Realtime.BlockType.INTENT) {
              const intent = getIntentByID({ id: sharedNode.intentID });
              const name = intent
                ? applyPlatformIntentNameFormatting(prettifyIntentName(applySingleIntentNameFormatting(platform, intent).name), platform)
                : '';

              return { name, type: sharedNode.type, nodeID: sharedNode.nodeID };
            }

            if (sharedNode?.type === Realtime.BlockType.START) {
              return {
                name: sharedNode.name || (rootDiagramID === diagram.id ? 'Project starts here' : 'Start'),
                type: sharedNode.type,
                nodeID: sharedNode.nodeID,
              };
            }

            if (sharedNode?.type === Realtime.BlockType.COMPONENT) {
              const diagram = getDiagramByID({ id: sharedNode.componentID });

              return { name: diagram?.name ?? '', type: sharedNode.type, nodeID: sharedNode.nodeID };
            }

            return null;
          })
          .filter(Utils.array.isNotNullish),
      })),
    [platform, getDiagramByID, getIntentByID, rootDiagramID, topicDiagrams, sharedNodes]
  );

  const onCreateTopic = React.useCallback(async () => {
    setSearchValue('');

    const newDiagram = await createTopicDiagram(`Topic ${topicDiagrams.length + 1}`);

    setLastCreatedDiagramID(newDiagram.id);
    goToDiagram(newDiagram.id, newDiagram.menuNodeIDs[0]);
  }, [topicDiagrams]);

  const onClearLastCreatedDiagramID = React.useCallback(() => {
    setLastCreatedDiagramID(null);
  }, []);

  const onDragStart = usePersistFunction((item: TopicItem) => {
    dndReorder.onStart(item);
    openedIDsToggle.onDragStart();
  });

  const onDragEnd = usePersistFunction(() => {
    dndReorder.onEnd();
    openedIDsToggle.onDragEnd();
  });

  const lowerCasedSearchValue = searchValue.trim().toLowerCase();

  const [searchTopicsItems, searchOpenedTopics] = React.useMemo(() => {
    const items: TopicItem[] = [];
    const openedTopics: Record<string, true> = {};

    if (!lowerCasedSearchValue) {
      return [items, openedTopics];
    }

    topicsItems.forEach((topic) => {
      const menuItems = topic.menuItems.filter(({ name }) => !!name && name.toLowerCase().includes(lowerCasedSearchValue));

      if (topic.name.toLowerCase().includes(lowerCasedSearchValue) && !menuItems.length) {
        items.push(topic);
      } else if (menuItems.length) {
        items.push({ ...topic, menuItems });
        openedTopics[topic.id] = true;
      }
    });

    return [items, openedTopics];
  }, [topicsItems, lowerCasedSearchValue]);

  return {
    onDragEnd,
    openedIDs: openedIDsToggle.openedIDs,
    onDragStart,
    searchValue,
    topicsItems,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID: isFocusedNodeActive ? focusedNodeID : null,
    setSearchValue,
    activeDiagramID,
    onReorderTopics: dndReorder.onReorder,
    searchMatchValue: lowerCasedSearchValue,
    onToggleOpenedID: openedIDsToggle.onToggleOpenedID,
    searchTopicsItems,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  };
};
