import { Node } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { Nullable } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { applySingleIntentNameFormatting } from '@/ducks/intent/utils';
import { Intent, NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { PlatformContext } from '@/pages/Skill/contexts';

import { NODE_CONFIG } from '../constants';

export interface ButtonsStepProps {
  ports: string[];
  nodeID: string;
  buttons: Node.Buttons.Button[];
  withElsePath: boolean;
  elsePathName: string;
}

const getIntentName = (
  intentMap: Record<string, Intent>,
  actions: string[],
  platform: Constants.PlatformType,
  intent: Nullable<string> | undefined
) => {
  const intentEnabled = actions.includes(Node.Buttons.ButtonAction.INTENT);
  const intentName = intent && intentEnabled && applySingleIntentNameFormatting(platform, intentMap[intent])?.name;
  return intentName || '';
};

export const ButtonsStep: React.FC<ButtonsStepProps> = ({ ports, nodeID, buttons, elsePathName, withElsePath }) => {
  const platform = React.useContext(PlatformContext)!;
  const intentsMap = React.useContext(CustomIntentMapContext)!;

  return (
    <Step nodeID={nodeID}>
      <Section>
        {buttons.length ? (
          buttons.map(({ id, name, actions, intent }, index) => {
            return (
              <Item
                key={id}
                icon={index === 0 ? NODE_CONFIG.icon : null}
                label={name || getIntentName(intentsMap, actions, platform, intent)}
                portID={actions.includes(Node.Buttons.ButtonAction.PATH) ? ports[index + 1] : null}
                iconColor={NODE_CONFIG.iconColor}
                placeholder="Add button text"
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
