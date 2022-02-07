import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  nextPortID?: string;
  variant: BlockVariant;
}

export const EventStep: React.FC<IntentStepProps> = ({ nodeID, nextPortID, label, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} portID={nextPortID} icon={NODE_CONFIG.icon} variant={variant} placeholder="Add Alexa Event" />
    </Section>
  </Step>
);

const ConnectedEventStep: ConnectedStep<Realtime.NodeData.Event, Realtime.NodeData.EventBuiltInPorts> = ({ ports, data, variant }) => (
  <EventStep nodeID={data.nodeID} nextPortID={ports.out.builtIn[Models.PortType.NEXT]} label={data.requestName} variant={variant} />
);

export default ConnectedEventStep;
