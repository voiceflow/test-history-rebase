import React from 'react';

import * as Creator from '@/ducks/creator';
import * as DiagramDuck from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as IntentV2 from '@/ducks/intentV2';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import * as Models from '@/models';
import { Nullable } from '@/types';
import { reorder } from '@/utils/array';

export interface TopicIntentItem {
  id: string;
  intent: Nullable<Models.Intent>;
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
  const intentSteps = useSelector(DiagramV2.intentStepsSelector);
  const topics = useSelector(VersionV2.active.topicsSelector);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const rootDiagramID = useSelector(VersionV2.active.rootDiagramIDSelector);
  const topicDiagrams = useSelector(DiagramV2.active.topicDiagramsSelector);
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

    const newDiagramID = await createTopicDiagram(`Topic ${topicDiagrams.length + 1}`);

    setLastCreatedDiagramID(newDiagramID);
    goToDiagram(newDiagramID);
  }, [topicDiagrams]);

  const onClearLastCreatedDiagramID = React.useCallback(() => {
    setLastCreatedDiagramID(null);
  }, []);

  const topicsItems = React.useMemo(
    () =>
      topicDiagrams.map<TopicItem>((diagram) => {
        const topicIntentStepMap = intentSteps[diagram.id] ?? {};

        return {
          id: diagram.id,
          name: rootDiagramID === diagram.id ? 'Home' : diagram.name,
          intentItems: diagram.intentStepIDs.map<TopicIntentItem>((stepID) => {
            const intentID = topicIntentStepMap[stepID] ?? null;
            const intent = intentID ? getIntentByID(intentID) ?? null : null;

            return { id: stepID, intent, intentID };
          }),
        };
      }),
    [getIntentByID, rootDiagramID, topicDiagrams, intentSteps]
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
