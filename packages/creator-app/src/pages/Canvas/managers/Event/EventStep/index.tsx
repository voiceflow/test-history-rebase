import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  portID?: string;
}

export const EventStep: React.FC<IntentStepProps> = ({ nodeID, portID, label }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} portID={portID} icon={NODE_CONFIG.icon} iconColor={NODE_CONFIG.iconColor} placeholder="Add Alexa Event" />
    </Section>
  </Step>
);

const ConnectedEventStep: React.FC<ConnectedStepProps<Realtime.NodeData.Event>> = ({ node, data }) => (
  <EventStep nodeID={node.id} portID={node.ports.out[0]} label={data.requestName} />
);

export default ConnectedEventStep;
