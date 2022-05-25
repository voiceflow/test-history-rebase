import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import * as Router from '@/ducks/router';
import { useDispatch, useSyncedLookup } from '@/hooks';
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

import { ChoiceItem } from '../types';

interface ChoiceStepProps {
  data: Realtime.NodeData<Realtime.NodeData.Interaction>;
  platform: VoiceflowConstants.PlatformType;
  ports: Realtime.NodePorts<Realtime.NodeData.InteractionBuiltInPorts>;
}

export const useChoiceStep = ({ ports, platform, data }: ChoiceStepProps) => {
  const engine = React.useContext(EngineContext);
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const intentNodeDataLookup = React.useContext(IntentNodeDataLookupContext)!;
  const slotMap = React.useContext(SlotMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const choicesByPortID = useSyncedLookup(ports.out.dynamic, data.choices);

  const isComponentDiagram = activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  const onGoToLinkedIntent = (diagramID: string | null, stepID: string) => () => {
    if (!diagramID || engine?.getDiagramID() === diagramID) {
      engine?.focusNode(stepID, { open: true });
    } else {
      goToDiagram(diagramID, stepID);
    }
  };

  const choices = React.useMemo(() => {
    return ports.out.dynamic.reduce<ChoiceItem[]>((acc, portID) => {
      if (!choicesByPortID[portID]) return acc;

      const { id, goTo, intent, action } = choicesByPortID[portID];

      const intentEntity = intent ? intentsMap[intent] : null;
      const isPath = action === BaseNode.Interaction.ChoiceAction.PATH;
      const goToIntent = goTo?.intentID && intentsMap[goTo.intentID] ? intentsMap[goTo.intentID] ?? null : null;
      const prompts: EntityPrompt[] = intentEntity?.slots.byKey ? transformSlotsIntoPrompts(Object.values(intentEntity.slots.byKey), slotMap) : [];
      const withPreview = prompts && prompts.length > 0;

      const goToDiagram = goTo?.diagramID && diagramMap[goTo?.diagramID] ? diagramMap[goTo?.diagramID] ?? null : null;
      const topicGoToStepID = goToIntent && goToDiagram ? globalIntentStepMap[goToDiagram.id]?.[goToIntent.id]?.[0] ?? null : null;
      const componentGoToStepID = topicGoToStepID || (goToIntent ? intentNodeDataLookup[goToIntent.id]?.nodeID ?? null : null);
      const goToStepID = isComponentDiagram ? componentGoToStepID : topicGoToStepID;
      const withAttachment = !isPath && !!goToStepID;

      acc.push({
        key: id,
        label: intent && intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null,
        portID: isPath ? portID : null,
        withAttachment,
        withPreview,
        // eslint-disable-next-line no-nested-ternary
        linkedLabel: isPath ? null : !withPreview && withAttachment ? prettifyIntentName(goToIntent?.name) : null,
        prompts,
        onGoToLinkedIntent: !withPreview && withAttachment ? onGoToLinkedIntent(goToDiagram?.id ?? null, goToStepID) : undefined,
      });

      return acc;
    }, []);
  }, [platform, choicesByPortID, intentsMap, ports.out.dynamic, globalIntentStepMap, isComponentDiagram, intentNodeDataLookup]);

  return { choices };
};
