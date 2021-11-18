import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface PromptStepProps {
  nodeID: string;
  isPath: boolean;
  noMatchPortID: string;
  noMatchPathName: string;
}

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID, isPath, noMatchPathName, noMatchPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label="Listening for an intent…"
        portID={null}
        labelVariant={StepLabelVariant.SECONDARY}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
      />
    </Section>

    {isPath && <ElseItem label={noMatchPathName} portID={noMatchPortID} />}
  </Step>
);

const ConnectedPromptStep: ConnectedStep<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = ({ node, data }) => (
  <PromptStep
    nodeID={node.id}
    isPath={!!data.noMatchReprompt.type && data.noMatchReprompt.type !== Node.Utils.NoMatchType.REPROMPT}
    noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    noMatchPathName={data.noMatchReprompt.pathName}
  />
);

export default ConnectedPromptStep;
