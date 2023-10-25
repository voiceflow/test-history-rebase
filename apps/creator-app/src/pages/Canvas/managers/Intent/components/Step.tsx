import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { HSLShades } from '@/constants';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { IntentMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  isLocal?: boolean;
  palette: HSLShades;
  nextPortID?: string;
}

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, label, isLocal, palette, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={isLocal ? 'intentLocal' : NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        palette={palette}
        placeholder="Create or select an intent"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

const ConnectedIntentStep: ConnectedStep<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = ({ ports, data, palette }) => {
  const intentMap = React.useContext(IntentMapContext)!;

  const { intent, availability } = data;

  return (
    <IntentStep
      label={intent ? intentMap[intent]?.name ?? null : null}
      nodeID={data.nodeID}
      isLocal={availability === BaseNode.Intent.IntentAvailability.LOCAL}
      palette={palette}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
    />
  );
};

export default ConnectedIntentStep;
