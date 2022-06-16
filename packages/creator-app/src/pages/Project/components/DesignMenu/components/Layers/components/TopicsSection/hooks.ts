import { Nullable } from '@voiceflow/common';
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
import { applyPlatformIntentAndSlotNameFormatting, prettifyIntentName } from '@/utils/intent';

import { OpenedIDsToggleApi, useOpenedIDsToggle } from '../../hooks';

export interface TopicIntentItem {
  id: string;
  intent: Nullable<Realtime.Intent>;
  intentID: Nullable<string>;
}
export interface TopicItem {
  id: string;
  name: string;
  intentItems: TopicIntentItem[];
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
  const intentSteps = useSelector(DiagramV2.intentStepsSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);
  const topicDiagrams = useSelector(DiagramV2.active.topicDiagramsSelector);
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
      topicDiagrams.map<TopicItem>((diagram) => {
        const topicIntentStepMap = intentSteps[diagram.id] ?? {};

        return {
          id: diagram.id,
          name: rootDiagramID === diagram.id && diagram.name === ROOT_DIAGRAM_NAME ? ROOT_DIAGRAM_LABEL : diagram.name,
          intentItems: diagram.intentStepIDs.map<TopicIntentItem>((stepID) => {
            const intentID = topicIntentStepMap[stepID]?.intentID ?? null;
            const intent = getIntentByID({ id: intentID });

            return {
              id: stepID,
              intent: intent
                ? {
                    ...intent,
                    name: applyPlatformIntentAndSlotNameFormatting(
                      prettifyIntentName(applySingleIntentNameFormatting(platform, intent).name),
                      platform
                    ),
                  }
                : null,
              intentID,
            };
          }),
        };
      }),
    [platform, getIntentByID, rootDiagramID, topicDiagrams, intentSteps]
  );

  const onCreateTopic = React.useCallback(async () => {
    setSearchValue('');

    const newDiagram = await createTopicDiagram(`Topic ${topicDiagrams.length + 1}`);

    setLastCreatedDiagramID(newDiagram.id);
    goToDiagram(newDiagram.id, newDiagram.intentStepIDs[0]);
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
      const intentItems = topic.intentItems.filter(({ intent }) => !!intent && intent.name.toLowerCase().includes(lowerCasedSearchValue));

      if (topic.name.toLowerCase().includes(lowerCasedSearchValue) && !intentItems.length) {
        items.push(topic);
      } else if (intentItems.length) {
        items.push({ ...topic, intentItems });
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
