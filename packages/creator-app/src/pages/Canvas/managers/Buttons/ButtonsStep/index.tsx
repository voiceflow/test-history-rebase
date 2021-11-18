import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { ConnectedStep, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  nodeID: string;
  buttons: Node.Buttons.Button[];
  noMatchPortID: string;
  dynamicPortIDs: string[];
  withNoMatchPath: boolean;
  noMatchPathName: string;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({ nodeID, buttons, noMatchPortID, dynamicPortIDs, noMatchPathName, withNoMatchPath }) => {
  const intentsMap = React.useContext(CustomIntentMapContext)!;
  const goToInteractionModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

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
                // attachment={isGoToIntent && !!intentEntity}
                placeholder="Add button text"
                linkedLabel={intentName}
                withNewLines
                labelVariant={StepLabelVariant.PRIMARY}
                multilineLabel
                labelLineClamp={100}
                onAttachmentClick={() => intentEntity && goToInteractionModelEntity(InteractionModelTabType.INTENTS, intentEntity.id)}
              />
            );
          })
        ) : (
          <Item placeholder="Add buttons" icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} />
        )}
      </Section>

      {withNoMatchPath && <ElseItem label={noMatchPathName} portID={noMatchPortID} />}
    </Step>
  );
};

const ConnectedButtonsStep: ConnectedStep<Realtime.NodeData.Buttons, Realtime.NodeData.ButtonsBuiltInPorts> = ({ node, data }) => (
  <ButtonsStep
    nodeID={node.id}
    buttons={data.buttons}
    noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    dynamicPortIDs={node.ports.out.dynamic}
    withNoMatchPath={!!data.else.type && data.else.type !== Node.Utils.NoMatchType.REPROMPT}
    noMatchPathName={data.else.pathName}
  />
);

export default ConnectedButtonsStep;
