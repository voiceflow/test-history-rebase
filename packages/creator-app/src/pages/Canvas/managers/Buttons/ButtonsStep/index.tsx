import { Node } from '@voiceflow/base-types';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  ports: string[];
  nodeID: string;
  buttons: Node.Buttons.Button[];
  withElsePath: boolean;
  elsePathName: string;
}

export const ButtonsStep: React.FC<ButtonsStepProps> = ({ ports, nodeID, buttons, elsePathName, withElsePath }) => {
  return (
    <Step nodeID={nodeID}>
      <Section>
        {buttons.length ? (
          buttons.map(({ id, name, actions }, index) => (
            <Item
              key={id}
              icon={index === 0 ? NODE_CONFIG.icon : null}
              label={name}
              portID={actions.includes(Node.Buttons.ButtonAction.PATH) ? ports[index + 1] : null}
              iconColor={NODE_CONFIG.iconColor}
              placeholder="Add button text"
              withNewLines
              labelVariant={StepLabelVariant.PRIMARY}
              multilineLabel
              labelLineClamp={100}
            />
          ))
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
