import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface PromptStepProps {
  nodeID: string;
  noMatch: Realtime.NodeData.NoMatch;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
  variant: BlockVariant;
}

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID, noMatch, noReply, noMatchPortID, noReplyPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} label="Listening for an intent…" portID={null} variant={variant} labelVariant={StepLabelVariant.PRIMARY} />

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedPromptStep: ConnectedStep<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = ({ node, data, variant }) => (
  <PromptStep
    nodeID={node.id}
    noMatch={data.noMatchReprompt}
    noReply={data.noReply}
    noMatchPortID={node.ports.out.builtIn[Models.PortType.NO_MATCH]}
    noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
    variant={variant}
  />
);

export default ConnectedPromptStep;
