import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface DeprecatedStepProps {
  nodeID: string;
  ports: string[];
  variant: BlockVariant;
}

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ nodeID, ports, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} variant={variant} placeholder="Deprecated" />
    </Section>

    <Section>
      {ports.map((portID, index) => (
        <Item key={portID} portID={portID} placeholder={`Path ${index + 1}`} />
      ))}
    </Section>
  </Step>
);

const ConnectedDeprecatedStep: React.FC<ConnectedStepProps<Realtime.NodeData.Deprecated>> = ({ ports, data, variant }) => (
  <DeprecatedStep nodeID={data.nodeID} ports={[ports.out.builtIn[BaseModels.PortType.NEXT]!, ...ports.out.dynamic]} variant={variant} />
);

export default ConnectedDeprecatedStep;
