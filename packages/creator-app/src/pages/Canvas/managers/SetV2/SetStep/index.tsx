import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface SetStepProps {
  title?: string;
  nodeID: string;
  nextPortID: string;
}

export const SetStep: React.FC<SetStepProps> = ({ title, nodeID, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={title || ''}
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Name Set step"
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
      />
    </Section>
  </Step>
);

const ConnectedSetStep: ConnectedStep<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ data, node }) => (
  <SetStep title={data.title} nodeID={node.id} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} />
);

export default ConnectedSetStep;
