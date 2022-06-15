import { BaseModels, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, NoMatchItem, NoReplyItem, Section } from '@/pages/Canvas/components/Step';
import { WAITING_FOR_INTENT_PLACEHOLDER } from '@/pages/Canvas/constants';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface PromptStepProps {
  nodeID: string;
  noMatch: Nullable<Realtime.NodeData.NoMatch>;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  palette: HSLShades;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const PromptStep: React.FC<PromptStepProps> = ({ nodeID, noMatch, noReply, noMatchPortID, noReplyPortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} label={WAITING_FOR_INTENT_PLACEHOLDER} portID={null} palette={palette} labelVariant={StepLabelVariant.PRIMARY} />

      <NoMatchItem portID={noMatchPortID} noMatch={noMatch} />
      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedPromptStep: ConnectedStep<Realtime.NodeData.Prompt, Realtime.NodeData.PromptBuiltInPorts> = ({ ports, data, palette }) => (
  <PromptStep
    nodeID={data.nodeID}
    noMatch={data.noMatch}
    noReply={data.noReply}
    palette={palette}
    noMatchPortID={ports.out.builtIn[BaseModels.PortType.NO_MATCH]}
    noReplyPortID={ports.out.builtIn[BaseModels.PortType.NO_REPLY]}
  />
);

export default ConnectedPromptStep;
