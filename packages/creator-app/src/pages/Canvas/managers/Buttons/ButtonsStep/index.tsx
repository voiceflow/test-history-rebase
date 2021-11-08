import { Node } from '@voiceflow/base-types';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  ports: string[];
  nodeID: string;
  buttons: Node.Buttons.Button[];
  withElsePath: boolean;
  elsePathName: string;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({ ports, nodeID, buttons, elsePathName, withElsePath }) => {
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
                portID={!isGoToIntent ? ports[index + 1] : null}
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

      {withElsePath && <ElseItem label={elsePathName} portID={ports[0]} />}
    </Step>
  );
};

const ConnectedButtonsStep: React.FC<ConnectedStepProps<NodeData.Buttons>> = ({ node, data }) => (
  <ButtonsStep
    ports={node.ports.out}
    nodeID={node.id}
    buttons={data.buttons}
    withElsePath={!!data.else.type && data.else.type !== Node.Utils.NoMatchType.REPROMPT}
    elsePathName={data.else.pathName}
  />
);

export default ConnectedButtonsStep;
