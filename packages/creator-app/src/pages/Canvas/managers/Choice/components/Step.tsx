import { BaseModels, BaseNode } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch, useSyncedLookup } from '@/hooks';
import Step, { Attachment, ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
import {
  ActiveDiagramTypeContext,
  CustomIntentMapContext,
  DiagramMapContext,
  EngineContext,
  GlobalIntentStepMapContext,
  IntentNodeDataLookupContext,
} from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

import { NODE_CONFIG } from '../constants';

interface ChoiceItem {
  key: string;
  label: Nullable<string>;
  portID: Nullable<string>;
  attachment?: boolean;
  linkedLabel?: Nullable<string>;
  onAttachmentClick?: VoidFunction;
}

export interface ChoiceStepProps {
  nodeID: string;
  choices: ChoiceItem[];
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  variant: BlockVariant;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const ChoiceStep: React.FC<ChoiceStepProps> = ({ nodeID, choices, noMatch, noReply, noMatchPortID, noReplyPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      {choices.length ? (
        choices.map(({ key, label, linkedLabel, portID, attachment, onAttachmentClick }, index) => (
          <Item
            key={key}
            icon={index === 0 ? NODE_CONFIG.icon : null}
            label={label}
            portID={portID}
            variant={variant}
            attachment={attachment ? <Attachment icon="clip" onClick={stopPropagation(onAttachmentClick)} /> : null}
            linkedLabel={linkedLabel}
            placeholder={attachment ? 'Create or select an intent' : `Path ${index + 1}`}
            multilineLabel
            labelLineClamp={5}
          />
        ))
      ) : (
        <Item placeholder="Add choices" icon={NODE_CONFIG.icon} variant={variant} />
      )}

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedChoiceStep: ConnectedStep<Realtime.NodeData.Interaction, Realtime.NodeData.InteractionBuiltInPorts> = ({
  data,
  ports,
  variant,
  platform,
}) => {
  const engine = React.useContext(EngineContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const intentNodeDataLookup = React.useContext(IntentNodeDataLookupContext)!;

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const choicesByPortID = useSyncedLookup(ports.out.dynamic, data.choices);

  const onGoToLinkedIntent = (diagramID: string | null, stepID: string) => () => {
    if (!diagramID || engine.getDiagramID() === diagramID) {
      engine.focusNode(stepID, { open: true });
    } else {
      goToDiagram(diagramID, stepID);
    }
  };

  const isComponentDiagram = activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  const choices = React.useMemo(() => {
    const items: ChoiceItem[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const portID of ports.out.dynamic) {
      if (!choicesByPortID[portID]) continue;

      const { id, goTo, intent, action } = choicesByPortID[portID];

      const isPath = action === BaseNode.Interaction.ChoiceAction.PATH;
      const goToIntent = goTo?.intentID && intentsMap[goTo.intentID] ? intentsMap[goTo.intentID] ?? null : null;
      const goToDiagram = goTo?.diagramID && diagramMap[goTo?.diagramID] ? diagramMap[goTo?.diagramID] ?? null : null;

      const topicGoToStepID = goToIntent && goToDiagram ? globalIntentStepMap[goToDiagram.id]?.[goToIntent.id]?.[0] ?? null : null;
      const componentGoToStepID = topicGoToStepID || (goToIntent ? intentNodeDataLookup[goToIntent.id]?.nodeID ?? null : null);

      const goToStepID = isComponentDiagram ? componentGoToStepID : topicGoToStepID;

      const withAttachment = !isPath && !!goToStepID;

      items.push({
        key: id,
        label: intent && intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null,
        portID: isPath ? portID : null,
        attachment: withAttachment,
        // eslint-disable-next-line no-nested-ternary
        linkedLabel: isPath ? null : withAttachment ? prettifyIntentName(goToIntent?.name) : null,
        onAttachmentClick: withAttachment ? onGoToLinkedIntent(goToDiagram?.id ?? null, goToStepID) : undefined,
      });
    }

    return items;
  }, [platform, choicesByPortID, intentsMap, ports.out.dynamic, globalIntentStepMap, isComponentDiagram, intentNodeDataLookup]);

  return (
    <ChoiceStep
      nodeID={data.nodeID}
      choices={choices}
      noMatch={data.noMatch}
      noReply={data.noReply}
      variant={variant}
      noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
      noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
    />
  );
};

export default ConnectedChoiceStep;
