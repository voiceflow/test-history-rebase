import React from 'react';

import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';

export type IntentStepProps = {
  label?: string | null;
  portID?: string;
};

export const EventStep: React.FC<IntentStepProps> = ({ portID, label }) => (
  <Step>
    <Section>
      <Item label={label} portID={portID} icon="event" iconColor="#5589eb" placeholder="Add Alexa Event" />
    </Section>
  </Step>
);

const ConnectedEventStep: React.FC<ConnectedStepProps<NodeData.Event>> = ({ node, data }) => (
  <EventStep portID={node.ports.out[0]} label={data.requestName} />
);

export default ConnectedEventStep;
