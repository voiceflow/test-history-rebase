import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import { StepLabelVariant } from '@/constants/canvas';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface RandomStepProps {
  nodeID: string;
  ports: string[];
  palette: HSLShades;
}

export const RandomStep: React.FC<RandomStepProps> = ({ nodeID, ports, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      {ports.map((portID, index) => (
        <Item
          key={portID}
          icon={index === 0 ? NODE_CONFIG.icon : null}
          label={`Path ${index + 1}`}
          portID={portID}
          palette={palette}
          labelVariant={StepLabelVariant.SECONDARY}
        />
      ))}
    </Section>
  </Step>
);

const ConnectedRandomStep: ConnectedStep<Realtime.NodeData.Random> = ({ ports, data, palette }) => (
  <RandomStep nodeID={data.nodeID} ports={ports.out.dynamic} palette={palette} />
);

export default ConnectedRandomStep;
