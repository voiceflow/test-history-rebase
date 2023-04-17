import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface DeprecatedStepProps {
  nodeID: string;
  ports: string[];
  palette: HSLShades;
}

const DeprecatedStep: React.FC<DeprecatedStepProps> = ({ nodeID, ports, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon={NODE_CONFIG.icon} palette={palette} placeholder="Deprecated" />
    </Section>

    <Section>
      {ports.map((portID, index) => (
        <Item key={portID} portID={portID} placeholder={`Path ${index + 1}`} />
      ))}
    </Section>
  </Step>
);

const ConnectedDeprecatedStep: ConnectedStep<Realtime.NodeData.Deprecated> = ({ ports, data, palette }) => (
  <DeprecatedStep nodeID={data.nodeID} ports={[ports.out.builtIn[BaseModels.PortType.NEXT]!, ...ports.out.dynamic]} palette={palette} />
);

export default ConnectedDeprecatedStep;
