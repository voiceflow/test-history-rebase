import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface PromptStepProps {
  nodeID: string;
  noMatch: Realtime.NodeData.NoMatch;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID, noMatch, noReply, noMatchPortID, noReplyPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label="Listening for an intent…"
        portID={null}
        labelVariant={StepLabelVariant.SECONDARY}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
      />

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedPromptStep: ConnectedStep<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = ({ node, data }) => (
  <PromptStep
    nodeID={node.id}
    noMatch={data.noMatchReprompt}
    noReply={data.noReply}
    noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
  />
);

export default ConnectedPromptStep;
