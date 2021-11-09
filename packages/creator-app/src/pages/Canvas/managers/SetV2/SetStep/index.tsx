import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface SetStepProps {
  nodeID: string;
  portID: string;
  title?: string;
}

export const SetStep: React.FC<SetStepProps> = ({ title, nodeID, portID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        multilineLabel
        label={title || ''}
        labelVariant={StepLabelVariant.SECONDARY}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        portID={portID}
        placeholder="Name Set step"
      />
    </Section>
  </Step>
);

type ConnectedSetStepProps = ConnectedStepProps<Realtime.NodeData.SetV2>;

const ConnectedSetStep: React.FC<ConnectedSetStepProps> = ({ data, node }) => (
  <SetStep title={data.title} nodeID={node.id} portID={node.ports.out[0]} />
);

export default ConnectedSetStep;
