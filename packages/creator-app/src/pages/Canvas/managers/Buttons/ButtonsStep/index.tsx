import { BaseModels, BaseNode, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
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
import { transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  nodeID: string;
  buttons: BaseNode.Buttons.Button[];
  noMatch: Realtime.NodeData.NoMatch;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  dynamicPortIDs: string[];
  variant: BlockVariant;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({
  nodeID,
  buttons,
  noMatch,
  noReply,
  noMatchPortID,
  noReplyPortID,
  dynamicPortIDs,
  variant,
}) => {
  const engine = React.useContext(EngineContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const diagramMap = React.useContext(DiagramMapContext)!;
  const activeDiagramType = React.useContext(ActiveDiagramTypeContext)!;
  const globalIntentStepMap = React.useContext(GlobalIntentStepMapContext)!;
  const intentNodeDataLookup = React.useContext(IntentNodeDataLookupContext)!;

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  const onGoToLinkedIntent = (diagramID: string | null, stepID: string) => () => {
    if (!diagramID || engine.getDiagramID() === diagramID) {
      engine.focusNode(stepID, { open: true });
    } else {
      goToDiagram(diagramID, stepID);
    }
  };

  const isComponentDiagram = activeDiagramType === BaseModels.Diagram.DiagramType.COMPONENT;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {buttons.length ? (
          buttons.map(({ id, name, actions, intent, diagramID }, index) => {
            const isPathChecked = actions.includes(BaseNode.Buttons.ButtonAction.PATH);
            const isIntentChecked = actions.includes(BaseNode.Buttons.ButtonAction.INTENT);
            const isGoToIntent = isIntentChecked && !isPathChecked;
            const intentEntity = intent && intentsMap[intent] ? intentsMap[intent] ?? null : null;
            const diagramEntity = diagramID && diagramMap[diagramID] ? diagramMap[diagramID] ?? null : null;

            const topicGoToStepID = intentEntity && diagramEntity ? globalIntentStepMap[diagramEntity.id]?.[intentEntity.id]?.[0] ?? null : null;
            const componentGoToStepID = topicGoToStepID || (intentEntity ? intentNodeDataLookup[intentEntity.id]?.nodeID ?? null : null);

            const intentName = prettifyIntentName(intentEntity?.name);

            const goToStepID = isComponentDiagram ? componentGoToStepID : topicGoToStepID;
            const withAttachment = isGoToIntent && !!goToStepID;

            return (
              <Item
                key={id}
                icon={index === 0 ? NODE_CONFIG.icon : null}
                label={name ? transformVariablesToReadable(name) : intentName}
                portID={!isGoToIntent ? dynamicPortIDs[index] : null}
                variant={variant}
                attachment={
                  withAttachment ? (
                    <Attachment icon="clip" onClick={stopPropagation(onGoToLinkedIntent(diagramEntity?.id ?? null, goToStepID))} />
                  ) : null
                }
                placeholder="Add button text"
                // eslint-disable-next-line no-nested-ternary
                linkedLabel={isGoToIntent ? (withAttachment ? intentName : null) : intentName}
                withNewLines
                labelVariant={StepLabelVariant.PRIMARY}
                multilineLabel
                labelLineClamp={100}
              />
            );
          })
        ) : (
          <Item placeholder="Add buttons" icon={NODE_CONFIG.icon} variant={variant} />
        )}

        <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
        <NoReplyItem portID={noReplyPortID} noReply={noReply} />
      </Section>
    </Step>
  );
};

const ConnectedButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({ ports, data, variant }) => (
  <ButtonsStep
    nodeID={data.nodeID}
    buttons={data.buttons}
    noMatch={data.else}
    noReply={data.noReply}
    noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
    noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
    dynamicPortIDs={ports.out.dynamic}
    variant={variant}
  />
);

export default ConnectedButtonsStep;
