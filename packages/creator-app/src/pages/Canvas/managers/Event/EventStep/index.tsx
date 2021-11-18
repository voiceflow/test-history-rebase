import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
}

export const EventStep: React.FC<IntentStepProps> = ({ nodeID, nextPortID, label }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} portID={nextPortID} icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} placeholder="Add Alexa Event" />
    </Section>
  </Step>
);

const ConnectedEventStep: ConnectedStep<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = ({ node, data }) => (
  <EventStep nodeID={node.id} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} label={data.requestName} />
);

export default ConnectedEventStep;
