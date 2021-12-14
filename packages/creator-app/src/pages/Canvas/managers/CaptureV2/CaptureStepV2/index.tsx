import { Models, Nullable } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, NoReplyItem, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CaptureStepProps {
  nodeID: string;
  noReply?: Nullable<Realtime.NodeData.NoReply>;
  noMatch?: Nullable<Realtime.NodeData.NoMatch>;
  nextPortID: string;
  noMatchPortID?: Nullable<string>;
  noReplyPortID?: Nullable<string>;
}

export const CaptureStep: React.FC<CaptureStepProps> = ({ nodeID, nextPortID, noReply, noReplyPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label="placeholder here"
        icon={NODE_CONFIG.icon}
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Capture a user response"
        labelVariant={StepLabelVariant.SECONDARY}
      />

      <NoReplyItem portID={noReplyPortID} noReply={noReply} />
    </Section>
  </Step>
);

const ConnectedCaptureStep: ConnectedStep<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = ({ data, node }) => (
  <CaptureStep
    nodeID={data.nodeID}
    noReply={data.noReply}
    nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    noReplyPortID={node.ports.out.builtIn[Models.PortType.NO_REPLY]}
  />
);

export default ConnectedCaptureStep;
