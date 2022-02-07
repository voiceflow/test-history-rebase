import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface CustomPayloadStepProps {
  nodeID: string;
  nextPortID: string;
  variant: BlockVariant;
}

export const CustomPayloadStep: React.FC<CustomPayloadStepProps> = ({ nodeID, nextPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Add custom response"
        portID={nextPortID}
        variant={variant}
        placeholder="Add custom response"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = ({
  ports,
  data,
  variant,
}) => <CustomPayloadStep nodeID={data.nodeID} nextPortID={ports.out.builtIn[Models.PortType.NEXT]} variant={variant} />;

export default ConnectedActionStep;
