import { DiagramType } from '@voiceflow/api-sdk';
import React from 'react';

import client from '@/client';
import { BlockType } from '@/constants';
import * as Creator from '@/ducks/creator';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';
import { delay } from '@/utils/promise';

export interface TopicIntentStep {
  id: string;
  intent: string;
}

export type TopicIntentStepMap = Record<string, TopicIntentStep>;
export type IntentStepMapPerTopic = Record<string, TopicIntentStepMap>;

export interface TopicsContextValue {
  intentStepMapPerTopic: IntentStepMapPerTopic;
}

export const TopicsContext = React.createContext<TopicsContextValue>({ intentStepMapPerTopic: {} });

export const TopicsProvider: React.FC = ({ children }) => {
  const rootDiagramID = useSelector(Version.activeRootDiagramIDSelector);
  const activeVersionID = useSelector(Session.activeVersionIDSelector);
  const intentsStepData = useSelector(Creator.intentStepsDataSelector);
  const allDiagramIDs = useSelector(Diagram.allDiagramIDsSelector);

  const refetchRevision = React.useRef(0);

  // TODO: replace with the realtime
  const replaceIntentStepIDs = useDispatch(Diagram.replaceIntentStepIDs)!;

  const [value, setValue] = React.useState<TopicsContextValue>({ intentStepMapPerTopic: {} });

  const fetchTopics = React.useCallback(async () => {
    if (!activeVersionID) {
      return;
    }

    const revision = refetchRevision.current;

    await delay(150);

    if (revision !== refetchRevision.current) {
      return;
    }

    const { diagrams: dbDiagrams } = await client.api.version.export(activeVersionID);

    if (revision !== refetchRevision.current) {
      return;
    }

    const stepMapPerTopic: IntentStepMapPerTopic = {};

    Object.keys(dbDiagrams).forEach((diagramID) => {
      const dbDiagram = dbDiagrams[diagramID];
      const isRootDiagram = rootDiagramID === diagramID;
      const type = dbDiagram.type ?? isRootDiagram ? DiagramType.TOPIC : DiagramType.COMPONENT;

      if (type !== DiagramType.TOPIC) {
        return;
      }

      const stepIDs: string[] = [];
      let intentStepMap = stepMapPerTopic[diagramID];

      if (!intentStepMap) {
        intentStepMap = {};
        stepMapPerTopic[diagramID] = intentStepMap;
      }

      Object.values(dbDiagram.nodes).forEach((node) => {
        if (node.type !== BlockType.INTENT) {
          return;
        }

        stepIDs.push(node.nodeID);
        intentStepMap[node.nodeID] = { id: node.nodeID, intent: node.data.intent };
      }, []);

      replaceIntentStepIDs(diagramID, stepIDs);
    });

    setValue({ intentStepMapPerTopic: stepMapPerTopic });
  }, [activeVersionID, rootDiagramID]);

  // fetching topics on every intentsStepData and size of allDiagramIDs change
  React.useEffect(() => {
    refetchRevision.current = Math.random();
    fetchTopics();
  }, [activeVersionID, rootDiagramID, intentsStepData, allDiagramIDs.length]);

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
};
