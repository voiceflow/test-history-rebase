import { Nullable } from '@voiceflow/common';
import React from 'react';

import {
  ActiveDiagramTypeContext,
  CustomIntentMapContext,
  DiagramMapContext,
  GlobalIntentStepMapContext,
  IntentNodeDataLookupContext,
} from '@/pages/Canvas/contexts';
import { getGoToIntentMeta } from '@/utils/intent';

export const useGoToIntentMeta = (intentID: Nullable<string>, diagramID?: Nullable<string>) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const intentNodeDataLookup = React.useContext(IntentNodeDataLookupContext)!;

  return getGoToIntentMeta({
    intentID,
    diagramID,
    intentsMap,
    diagramMap,
    activeDiagramType,
    globalIntentStepMap,
    intentNodeDataLookup,
  });
};
