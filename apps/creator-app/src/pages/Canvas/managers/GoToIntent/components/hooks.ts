import type { Nullable } from '@voiceflow/common';
import { FeatureFlag } from '@voiceflow/realtime-sdk';
import React from 'react';

import { useFeature } from '@/hooks/feature.hook';
import {
  ActiveDiagramTypeContext,
  DiagramMapContext,
  GlobalIntentStepMapContext,
  GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapContext,
  IntentIDNodeIDMapContext,
  IntentMapContext,
} from '@/pages/Canvas/contexts';
import { isComponentDiagram } from '@/utils/diagram.utils';

export const useGoToIntentMeta = (intentID: Nullable<string>, diagramID?: Nullable<string>) => {
  const referenceSystem = useFeature(FeatureFlag.REFERENCE_SYSTEM);

  const intentsMap = React.useContext(IntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const intentIDNodeIDMap = React.useContext(IntentIDNodeIDMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const globalTriggerNodeIDsByIntentIDMapByDiagramIDMap = React.useContext(
    GlobalTriggerNodeIDsByIntentIDMapByDiagramIDMapContext
  )!;

  const goToIntent = intentID ? intentsMap[intentID] ?? null : null;
  const goToDiagram = diagramID ? diagramMap[diagramID] ?? null : null;

  const map = referenceSystem ? globalTriggerNodeIDsByIntentIDMapByDiagramIDMap : globalIntentStepMap;
  const topicGoToNodeID = goToIntent && goToDiagram ? map[goToDiagram.diagramID]?.[goToIntent.id]?.[0] ?? null : null;
  const componentGoToNodeID = topicGoToNodeID || (goToIntent ? intentIDNodeIDMap[goToIntent.id] ?? null : null);

  const goToNodeID = isComponentDiagram(activeDiagramType) ? componentGoToNodeID : topicGoToNodeID;

  return {
    goToNodeID,
    goToIntent,
    goToDiagram,
    goToIntentName: goToIntent?.name ?? '',
  };
};
