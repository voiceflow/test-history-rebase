import { Nullable } from '@voiceflow/common';
import React from 'react';

import {
  ActiveDiagramTypeContext,
  DiagramMapContext,
  GlobalIntentStepMapContext,
  IntentIDNodeIDMapContext,
  IntentMapContext,
} from '@/pages/Canvas/contexts';
import { getGoToIntentMeta } from '@/utils/intent';

export const useGoToIntentMeta = (intentID: Nullable<string>, diagramID?: Nullable<string>) => {
  const intentsMap = React.useContext(IntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const intentIDNodeIDMap = React.useContext(IntentIDNodeIDMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;

  return getGoToIntentMeta({
    intentID,
    diagramID,
    intentsMap,
    diagramMap,
    intentIDNodeIDMap,
    activeDiagramType,
    globalIntentStepMap,
  });
};
