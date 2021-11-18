import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CustomPayloadStepProps {
  nodeID: string;
  nextPortID: string;
}

export const CustomPayloadStep: React.FC<CustomPayloadStepProps> = ({ nodeID, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Add custom response"
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Add custom response"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = ({ node }) => (
  <CustomPayloadStep nodeID={node.id} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} />
);

export default ConnectedActionStep;
