import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface SetStepProps {
  title?: string;
  nodeID: string;
  nextPortID: string;
  variant: BlockVariant;
}

export const SetStep: React.FC<SetStepProps> = ({ title, nodeID, nextPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={title || ''}
        portID={nextPortID}
        variant={variant}
        placeholder="Name Set step"
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
      />
    </Section>
  </Step>
);

const ConnectedSetStep: ConnectedStep<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ ports, data, variant }) => (
  <SetStep title={data.title} nodeID={data.nodeID} nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]} variant={variant} />
);

export default ConnectedSetStep;
