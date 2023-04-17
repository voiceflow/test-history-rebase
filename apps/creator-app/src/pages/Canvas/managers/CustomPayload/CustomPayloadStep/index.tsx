import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface CustomPayloadStepProps {
  nodeID: string;
  nextPortID: string;
  palette: HSLShades;
}

export const CustomPayloadStep: React.FC<CustomPayloadStepProps> = ({ nodeID, nextPortID, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label="Add custom response"
        portID={nextPortID}
        palette={palette}
        placeholder="Add custom response"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedActionStep: ConnectedStep<Realtime.NodeData.CustomPayload, Realtime.NodeData.CustomPayloadBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => <CustomPayloadStep nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} palette={palette} />;

export default ConnectedActionStep;
