import { BaseModels } from '@voiceflow/base-types';
import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { usePersistFunction } from '@voiceflow/ui';
import React from 'react';
import { useDrop } from 'react-dnd';

import { DragPreviewComponentProps, ItemComponentProps } from '@/components/DraggableList';
import { DragItem, StepMenuType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as CreatorV2 from '@/ducks/creatorV2';
import * as DiagramDuck from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import { useDnDReorder } from '@/hooks/dnd';
import { useEventualEngine } from '@/hooks/engine';
import { useDispatch, useLocalDispatch } from '@/hooks/realtime';
import { useSelector } from '@/hooks/redux';
import { getDiagramName } from '@/utils/diagram';

import { OpenedIDsToggleApi, useOpenedIDsToggle } from '../hooks';

export interface TopicMenuBaseItem {
  type: BaseModels.Diagram.MenuItemType;
  name: string;
  sourceID: string;
}

export interface TopicMenuNodeItem extends TopicMenuBaseItem {
  type: BaseModels.Diagram.MenuItemType.NODE;
  nodeID: string;
  nodeType: Realtime.BlockType;
}

export interface TopicMenuSubtopicItem extends TopicMenuBaseItem, TopicItem {
  type: BaseModels.Diagram.MenuItemType.DIAGRAM;
}

export type TopicMenuItem = TopicMenuNodeItem | TopicMenuSubtopicItem;

export interface TopicItem {
  name: string;
  topicID: string;
  menuItems: TopicMenuItem[];
}

export interface TopicItemProps extends ItemComponentProps<TopicItem>, DragPreviewComponentProps {
  isSearch: boolean;
  isSubtopic?: boolean;
  rootTopicID?: string;
  onAddIntent: (topicID: string) => void;
  openedTopics: Record<string, boolean>;
  onToggleOpen: (topicID: string) => void;
  disableHover?: boolean;
  rootDiagramID: Nullable<string>;
  focusedNodeID: Nullable<string>;
  activeDiagramID: Nullable<string>;
  onCreateSubtopic: (rootTopicID: string) => void;
  searchMatchValue: string;
  onSubtopicDragEnd: VoidFunction;
  lastCreatedDiagramID: Nullable<string>;
  onSubtopicDragStart: (idsToClose: string[]) => void;
  onClearLastCreatedDiagramID: VoidFunction;
}

interface TopicsAPI {
  onDragEnd: (item: TopicItem) => void;
  onDragStart: (item: TopicItem) => void;
  searchValue: string;
  onAddIntent: (topicID: string) => void;
  topicsItems: TopicItem[];
  onCreateTopic: VoidFunction;
  focusedNodeID: Nullable<string>;
  rootDiagramID: Nullable<string>;
  setSearchValue: (value: string) => void;
  activeDiagramID: Nullable<string>;
  scrollToTopicID: Nullable<string>;
  onReorderTopics: (from: number, to: number) => void;
  searchMatchValue: string;
  onCreateSubtopic: (rootTopicID: string) => void;
  searchTopicsItems: TopicItem[];
  searchOpenedTopics: Record<string, true>;
  lastCreatedDiagramID: Nullable<string>;
  onClearLastCreatedDiagramID: VoidFunction;
}

export const useSubtopicDrop = (topicID: string, isSubtopic?: boolean) => {
  const diagramIDs = useSelector(DiagramV2.allDiagramIDsSelector);
  const moveSubtopic = useDispatch(DiagramDuck.moveSubtopicDiagram);
  const [dropPreview, setDropPreview] = React.useState(false);

  const dndAcceptedTypes = React.useMemo(() => diagramIDs.map((id) => `${DragItem.TOPIC_MENU_ITEMS}${id}`), [diagramIDs]);

  const [, ref] = useDrop<TopicItemProps & { diagramID: string }>({
    drop(item) {
      if (isSubtopic) return;

      const subtopicID = item.item.topicID;
      const { diagramID } = item;
      const newTopicID = topicID;

      if (diagramID === newTopicID) return;

      moveSubtopic(subtopicID, diagramID, newTopicID);
    },
    collect(monitor) {
      if (isSubtopic) return;

      if (monitor.isOver()) {
        setDropPreview(true);
      } else {
        setDropPreview(false);
      }
    },
    accept: dndAcceptedTypes,
  });

  return { ref, isSubtopicHovering: dropPreview };
};

export const useTopics = (): TopicsAPI & Omit<OpenedIDsToggleApi, 'onDragStart' | 'onDragEnd'> => {
  const getEngine = useEventualEngine();

  const platform = useSelector(ProjectV2.active.platformSelector);
  const sharedNodes = useSelector(DiagramV2.sharedNodesSelector);
  const creatorFocus = useSelector(Creator.creatorFocusSelector);
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);
  const rootDiagramID = useSelector(Domain.active.rootDiagramIDSelector);
  const topicDiagrams = useSelector(DiagramV2.active.topicDiagramsSelector);
  const getDiagramByID = useSelector(DiagramV2.getDiagramByIDSelector);
  const activeDiagramID = useSelector(CreatorV2.activeDiagramIDSelector);
  const lastCreatedDiagramID = useSelector(DiagramV2.lastCreatedIDSelector);
  const getRootTopicIDBySubtopicID = useSelector(DiagramV2.getRootTopicIDBySubtopicIDSelector);

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const reorderTopics = useDispatch(Domain.currentReorderTopic);
  const createTopicDiagram = useDispatch(DiagramDuck.createTopicDiagram);
  const createSubtopicDiagram = useDispatch(DiagramDuck.createSubtopicDiagram);
  const setLastCreatedDiagramID = useLocalDispatch(DiagramV2.setLastCreatedID);

  const [searchValue, setSearchValue] = React.useState('');
  const [scrollToTopicID, setScrollToTopicID] = React.useState<string | null>(null);

  const dndReorder = useDnDReorder({
    getID: (item: TopicItem) => item.topicID,
    onPersist: (topicID: string, toIndex: number) => reorderTopics({ topicID, toIndex }),
    onReorder: (topicID: string, toIndex: number) => reorderTopics({ topicID, toIndex, skipPersist: true }),
  });

  const openedIDsToggle = useOpenedIDsToggle('topics');

  const topicsItems = React.useMemo(() => {
    const getMenuItems = ({ id, menuItems }: Realtime.Diagram): TopicMenuItem[] =>
      menuItems
        .map<TopicMenuItem | null>(({ type, sourceID }) => {
          if (type === BaseModels.Diagram.MenuItemType.DIAGRAM) {
            const diagram = getDiagramByID({ id: sourceID });

            if (!diagram) return null;

            return {
              type,
              name: diagram.name,
              topicID: diagram.id,
              sourceID,
              menuItems: getMenuItems(diagram),
            };
          }

          if (type !== BaseModels.Diagram.MenuItemType.NODE) return null;

          const sharedNode = sharedNodes[id]?.[sourceID];

          if (sharedNode?.type === Realtime.BlockType.INTENT) {
            const intent = getIntentByID({ id: sharedNode.intentID });

            return {
              type,
              name: intent?.name ?? '',
              nodeID: sharedNode.nodeID,
              nodeType: sharedNode.type,
              sourceID,
            };
          }

          if (sharedNode?.type === Realtime.BlockType.START) {
            return {
              type,
              name: sharedNode.name || (rootDiagramID === id ? 'Assistant starts here' : 'Start'),
              nodeID: sharedNode.nodeID,
              nodeType: sharedNode.type,
              sourceID,
            };
          }

          return null;
        })
        .filter(Utils.array.isNotNullish);

    return topicDiagrams.map<TopicItem>((diagram) => ({
      name: getDiagramName(diagram.name),
      topicID: diagram.id,
      menuItems: getMenuItems(diagram),
    }));
  }, [platform, getDiagramByID, getIntentByID, rootDiagramID, topicDiagrams, sharedNodes]);

  const onCreateTopic = React.useCallback(async () => {
    setSearchValue('');

    const topicDiagram = await createTopicDiagram(`Topic ${topicDiagrams.length + 1}`);

    const firstNodeID = topicDiagram.menuItems.find((item) => item.type === BaseModels.Diagram.MenuItemType.NODE)?.sourceID;

    openedIDsToggle.onToggleOpenedID(topicDiagram.id, true);

    goToDiagram(topicDiagram.id, firstNodeID);
  }, [topicDiagrams]);

  const onCreateSubtopic = React.useCallback(
    async (rootTopicID: string) => {
      const rootTopicDiagram = getDiagramByID({ id: rootTopicID });

      if (!rootTopicDiagram) return;

      const subtopics = rootTopicDiagram.menuItems.filter(({ type }) => type === BaseModels.Diagram.MenuItemType.DIAGRAM);

      openedIDsToggle.onToggleOpenedID(rootTopicID, true);

      const subTopicDiagram = await createSubtopicDiagram(rootTopicID, `Sub Topic ${subtopics.length + 1}`);

      const firstNodeID = subTopicDiagram.menuItems.find((item) => item.type === BaseModels.Diagram.MenuItemType.NODE)?.sourceID;

      openedIDsToggle.onToggleOpenedID(subTopicDiagram.id, true);

      goToDiagram(subTopicDiagram.id, firstNodeID);
    },
    [getDiagramByID]
  );

  const onAddIntent = React.useCallback(async (topicID: string) => {
    const engine = getEngine();

    if (!engine) return;

    openedIDsToggle.onToggleOpenedID(topicID, true);

    await engine.diagram.addNode({
      type: Realtime.BlockType.INTENT,
      menuType: StepMenuType.TOPIC,
      diagramID: topicID,
    });
  }, []);

  const onClearLastCreatedDiagramID = React.useCallback(() => setLastCreatedDiagramID({ id: null }), []);

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
      const filterMenuItems = (menuItems: TopicMenuItem[]): TopicMenuItem[] =>
        menuItems.reduce<TopicMenuItem[]>((acc, item) => {
          const nameMatched = !!item.name && item.name.toLowerCase().includes(lowerCasedSearchValue);

          if (nameMatched) return [...acc, item];

          if (item.type === BaseModels.Diagram.MenuItemType.DIAGRAM) {
            const filteredItems = filterMenuItems(item.menuItems);
            openedTopics[item.sourceID] = true;

            if (filteredItems.length) {
              return [...acc, { ...item, menuItems: filteredItems }];
            }
          }

          return acc;
        }, []);

      const menuItems = filterMenuItems(topic.menuItems);

      if (topic.name.toLowerCase().includes(lowerCasedSearchValue) && !menuItems.length) {
        items.push(topic);
      } else if (menuItems.length) {
        items.push({ ...topic, menuItems });
        openedTopics[topic.topicID] = true;
      }
    });

    return [items, openedTopics];
  }, [topicsItems, lowerCasedSearchValue]);

  React.useEffect(() => {
    if (!lastCreatedDiagramID) return;

    const diagram = getDiagramByID({ id: lastCreatedDiagramID });

    if (diagram?.type !== BaseModels.Diagram.DiagramType.TOPIC) return;

    const result = getRootTopicIDBySubtopicID(lastCreatedDiagramID);

    if (!result) return;

    openedIDsToggle.onToggleOpenedID(result.rootTopicID, true);
    openedIDsToggle.onToggleOpenedID(lastCreatedDiagramID, true);

    setScrollToTopicID(lastCreatedDiagramID);
  }, [lastCreatedDiagramID]);

  const focusedNodeID = creatorFocus.isActive ? creatorFocus.target : null;

  return {
    onDragEnd,
    openedIDs: openedIDsToggle.openedIDs,
    onAddIntent,
    onDragStart,
    searchValue,
    topicsItems,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID,
    setSearchValue,
    scrollToTopicID,
    activeDiagramID,
    onNestedDragEnd: openedIDsToggle.onNestedDragEnd,
    onReorderTopics: dndReorder.onReorder,
    searchMatchValue: lowerCasedSearchValue,
    onToggleOpenedID: openedIDsToggle.onToggleOpenedID,
    onNestedDragStart: openedIDsToggle.onNestedDragStart,
    onCreateSubtopic,
    searchTopicsItems,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  };
};
