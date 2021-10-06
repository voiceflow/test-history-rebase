import { DiagramType } from '@voiceflow/api-sdk';
import React from 'react';

import client from '@/client';
import { BlockType } from '@/constants';
import * as Diagram from '@/ducks/diagram';
import * as Session from '@/ducks/session';
import * as Version from '@/ducks/version';
import { useDispatch, useSelector } from '@/hooks';

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
  const rootDiagramID = useSelector(Version.activeRootDiagramIDSelector)!;
  const activeVersionID = useSelector(Session.activeVersionIDSelector)!;

  // TODO: replace with the realtime
  const replaceIntentStepIDs = useDispatch(Diagram.replaceIntentStepIDs)!;

  const [value, setValue] = React.useState<TopicsContextValue>({ intentStepMapPerTopic: {} });

  const fetchTopics = React.useCallback(async () => {
    const { diagrams: dbDiagrams } = await client.api.version.export(activeVersionID);

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

  React.useEffect(() => {
    fetchTopics();
  }, [activeVersionID, rootDiagramID]);

  return <TopicsContext.Provider value={value}>{children}</TopicsContext.Provider>;
};
