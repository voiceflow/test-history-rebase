import { Node } from '@voiceflow/base-types';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, ElseItem, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface PromptStepProps {
  nodeID: string;
  isPath: boolean;
  elsePortID: string;
  elsePathName: string;
}

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID, isPath, elsePathName, elsePortID }) => (
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

    {isPath && <ElseItem label={elsePathName} portID={elsePortID} />}
  </Step>
);

const ConnectedPromptStep: React.FC<ConnectedStepProps<NodeData.Prompt>> = ({ node, data }) => (
  <PromptStep
    nodeID={node.id}
    isPath={!!data.noMatchReprompt.type && data.noMatchReprompt.type !== Node.Utils.NoMatchType.REPROMPT}
    elsePortID={node.ports.out[0]}
    elsePathName={data.noMatchReprompt.pathName}
  />
);

export default ConnectedPromptStep;
