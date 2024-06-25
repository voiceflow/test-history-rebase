import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { HSLShades } from '@/constants';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
  palette: HSLShades;
}

export const EventStep: React.FC<IntentStepProps> = ({ nodeID, nextPortID, label, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} portID={nextPortID} icon={NODE_CONFIG.icon} palette={palette} placeholder="Add Alexa Event" />
    </Section>
  </Step>
);

const ConnectedEventStep: ConnectedStep<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => (
  <EventStep
    nodeID={data.nodeID}
    nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    label={data.requestName}
    palette={palette}
  />
);

export default ConnectedEventStep;
