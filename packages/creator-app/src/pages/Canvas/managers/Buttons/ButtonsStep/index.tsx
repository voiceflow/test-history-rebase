import { Models, Node, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  nodeID: string;
  buttons: Node.Buttons.Button[];
  noMatch: Realtime.NodeData.NoMatch;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  dynamicPortIDs: string[];
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({ nodeID, buttons, noMatch, noReply, noMatchPortID, noReplyPortID, dynamicPortIDs }) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {buttons.length ? (
          buttons.map(({ id, name, actions, intent }, index) => {
            const isPathChecked = actions.includes(Node.Buttons.ButtonAction.PATH);
            const isIntentChecked = actions.includes(Node.Buttons.ButtonAction.INTENT);
            const isGoToIntent = isIntentChecked && !isPathChecked;
            const intentEntity = intent && intentsMap[intent] ? intentsMap[intent] ?? null : null;
            const intentName = prettifyIntentName(intentEntity?.name);

            return (
              <Item
                key={id}
                icon={index === 0 ? NODE_CONFIG.icon : null}
                label={name || intentName}
                portID={!isGoToIntent ? dynamicPortIDs[index] : null}
                iconColor={NODE_CONFIG.iconColor}
                // TODO: uncomment when the go to specific intent step id will be implemented
                // attachment={isGoToIntent && !!intentEntity ? <Attachment icon="clip" onClick={stopPropagation(() => intentEntity && goToInteractionModelEntity(InteractionModelTabType.INTENTS, intentEntity.id))} /> : null}
                placeholder="Add button text"
                linkedLabel={intentName}
                withNewLines
                labelVariant={StepLabelVariant.PRIMARY}
                multilineLabel
                labelLineClamp={100}
              />
            );
          })
        ) : (
          <Item placeholder="Add buttons" icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} />
        )}

        <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
        <NoReplyItem portID={noReplyPortID} noReply={noReply} />
      </Section>
    </Step>
  );
};

const ConnectedButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({ node, data }) => (
  <ButtonsStep
    nodeID={node.id}
    buttons={data.buttons}
    noMatch={data.else}
    noReply={data.noReply}
    noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
    dynamicPortIDs={node.ports.out.dynamic}
  />
);

export default ConnectedButtonsStep;
