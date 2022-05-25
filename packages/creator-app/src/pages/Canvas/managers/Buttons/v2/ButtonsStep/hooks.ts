import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import {
  ActiveDiagramTypeContext,
  CustomIntentMapContext,
  DiagramMapContext,
  EngineContext,
  GlobalIntentStepMapContext,
  IntentNodeDataLookupContext,
  SlotMapContext,
} from '@/pages/Canvas/contexts';
import { EntityPrompt } from '@/pages/Canvas/types';
import { transformSlotsIntoPrompts } from '@/pages/Canvas/utils';
import { prettifyIntentName } from '@/utils/intent';
import { transformVariablesToReadable } from '@/utils/slot';

import { ButtonItem } from '../types';

interface ButtonsStepProps {
  data: Realtime.NodeData<Realtime.NodeData.Buttons>;
  ports: Realtime.NodePorts<Realtime.NodeData.ButtonsBuiltInPorts>;
}

export const useButtons = ({ data, ports }: ButtonsStepProps) => {
  const engine = React.useContext(EngineContext);
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const intentNodeDataLookup = React.useContext(IntentNodeDataLookupContext)!;
  const slotMap = React.useContext(SlotMapContext)!;
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);
  const isComponentDiagram = activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  const onGoToLinkedIntent = (diagramID: string | null, stepID: string | null) => () => {
    if (!stepID) return;

    if (!diagramID || engine?.getDiagramID() === diagramID) {
      engine?.focusNode(stepID, { open: true });
    } else {
      goToDiagram(diagramID, stepID);
    }
  };

  const buttons = React.useMemo(
    () =>
      data.buttons.map((button, index) => {
        const isPathChecked = button.actions.includes(BaseNode.Buttons.ButtonAction.PATH);
        const isIntentChecked = button.actions.includes(BaseNode.Buttons.ButtonAction.INTENT);
        const isGoToIntent = isIntentChecked && !isPathChecked;
        const intentEntity = button.intent && intentsMap[button.intent] ? intentsMap[button.intent] ?? null : null;
        const diagramEntity = button.diagramID && diagramMap[button.diagramID] ? diagramMap[button.diagramID] ?? null : null;

        const topicGoToStepID = intentEntity && diagramEntity ? globalIntentStepMap[diagramEntity.id]?.[intentEntity.id]?.[0] ?? null : null;
        const componentGoToStepID = topicGoToStepID || (intentEntity ? intentNodeDataLookup[intentEntity.id]?.nodeID ?? null : null);
        const goToStepID = isComponentDiagram ? componentGoToStepID : topicGoToStepID;

        const prompts: EntityPrompt[] = intentEntity?.slots.byKey ? transformSlotsIntoPrompts(Object.values(intentEntity.slots.byKey), slotMap) : [];

        const withRequiredEntitiesAttachment = prompts ? prompts.length > 0 : false;
        const withLinkedLabelsAttachment = isGoToIntent && !!goToStepID;
        const label = transformVariablesToReadable(button.name);
        const portID = !isGoToIntent ? ports.out.dynamic[index] : null;

        const intentName = prettifyIntentName(intentEntity?.name);
        // eslint-disable-next-line no-nested-ternary
        const linkedLabel = isGoToIntent ? (withLinkedLabelsAttachment ? intentName : null) : intentName;

        const buttonItem: ButtonItem = {
          withRequiredEntitiesAttachment,
          withLinkedLabelsAttachment,
          linkedLabel,
          label,
          portID,
          prompts,
          ...button,
          onGoToLinkedIntent: onGoToLinkedIntent(diagramEntity?.id ?? null, goToStepID),
        };

        return buttonItem;
      }),
    [data.buttons, ports.out.dynamic, intentsMap, diagramMap, globalIntentStepMap, intentNodeDataLookup, activeDiagramType, slotMap]
  );

  return { buttons };
};
