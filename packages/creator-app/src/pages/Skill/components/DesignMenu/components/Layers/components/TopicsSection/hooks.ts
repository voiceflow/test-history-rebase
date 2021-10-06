import React from 'react';

import * as Creator from '@/ducks/creator';
import * as DiagramDuck from '@/ducks/diagram';
import * as IntentDuck from '@/ducks/intent';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useLocalStorageState, useRAF, useSelector } from '@/hooks';
import { Intent } from '@/models';
import { TopicsContext } from '@/pages/Skill/components/DesignMenu/TopicsContext';
import { Nullable } from '@/types';
import { reorder } from '@/utils/array';

export interface TopicIntentItem {
  id: string;
  intent: Nullable<Intent>;
  intentID: Nullable<string>;
}
export interface TopicItem {
  id: string;
  name: string;
  intentItems: TopicIntentItem[];
}

interface TopicsAPI {
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

export const useTopics = (): TopicsAPI => {
  const { intentStepMapPerTopic } = React.useContext(TopicsContext);

  const topics = useSelector(Version.activeTopicsSelector);
  const intentByID = useSelector(IntentDuck.intentByIDSelector);
  const rootDiagramID = useSelector(Version.activeRootDiagramIDSelector);
  const topicsDiagrams = useSelector(DiagramDuck.activeTopicsDiagramsSelector);
  const activeDiagramID = useSelector(Session.activeDiagramIDSelector);
  const { target: focusedNodeID, isActive: isFocusedNodeActive } = useSelector(Creator.creatorFocusSelector);

  const saveTopics = useDispatch(Version.saveTopics);
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const createTopicDiagram = useDispatch(DiagramDuck.createTopicDiagram);

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [lastCreatedDiagramID, setLastCreatedDiagramID] = React.useState<Nullable<string>>(null);

  const onReorderTopics = React.useCallback((from: number, to: number) => saveTopics(reorder(topics, from, to)), [topics]);

  const onCreateTopic = React.useCallback(async () => {
    setSearchValue('');

    const newDiagramID = await createTopicDiagram(`Topic ${topicsDiagrams.length + 1}`);

    setLastCreatedDiagramID(newDiagramID);
    goToDiagram(newDiagramID);
  }, [topicsDiagrams]);

  const onClearLastCreatedDiagramID = React.useCallback(() => {
    setLastCreatedDiagramID(null);
  }, []);

  const topicsItems = React.useMemo(
    () =>
      topicsDiagrams.map<TopicItem>((diagram) => {
        const topicIntentStepMap = intentStepMapPerTopic[diagram.id] ?? {};

        return {
          id: diagram.id,
          name: rootDiagramID === diagram.id ? 'Home' : diagram.name,
          intentItems: diagram.intentStepIDs.map<TopicIntentItem>((stepID) => {
            const intentID = topicIntentStepMap[stepID]?.intent ?? null;
            const intent = intentID ? intentByID(intentID) ?? null : null;

            return { id: stepID, intent, intentID };
          }),
        };
      }),
    [intentByID, rootDiagramID, topicsDiagrams, intentStepMapPerTopic]
  );

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
    searchValue,
    topicsItems,
    onCreateTopic,
    rootDiagramID,
    focusedNodeID: isFocusedNodeActive ? focusedNodeID : null,
    setSearchValue,
    activeDiagramID,
    onReorderTopics,
    searchMatchValue: lowerCasedSearchValue,
    searchTopicsItems,
    searchOpenedTopics,
    lastCreatedDiagramID,
    onClearLastCreatedDiagramID,
  };
};

interface TopicsToggleApi {
  onDragEnd: VoidFunction;
  isDragging: boolean;
  onDragStart: VoidFunction;
  openedTopics: Record<string, boolean>;
  onToggleTopicOpen: (topicID: string) => void;
}

export const useTopicsToggle = (): TopicsToggleApi => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector);

  const [isDragging, setIsDragging] = React.useState(false);
  const [openedTopics, setOpenedTopics] = useLocalStorageState<Record<string, boolean>>(`dm-opened-topics.${activeProjectID}`, {});

  const [scheduler, schedulerApi] = useRAF();
  const openedTopicsCache = React.useRef(openedTopics);

  const onDragEnd = React.useCallback(() => {
    schedulerApi.current.cancel();

    setIsDragging(false);
    setOpenedTopics({ ...openedTopicsCache.current });
  }, [openedTopics]);

  const onDragStart = React.useCallback(() => {
    openedTopicsCache.current = openedTopics;

    scheduler(() => {
      setIsDragging(true);
      setOpenedTopics({});
    });
  }, [openedTopics]);

  const onToggleTopicOpen = React.useCallback(
    (topicID: string) => {
      setOpenedTopics({ ...openedTopics, [topicID]: !openedTopics[topicID] });
    },
    [openedTopics]
  );

  return {
    onDragEnd,
    isDragging,
    onDragStart,
    openedTopics,
    onToggleTopicOpen,
  };
};
