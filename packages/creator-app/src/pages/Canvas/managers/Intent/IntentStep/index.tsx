import { BaseModels, BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { BlockVariant } from '@/constants';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  isLocal?: boolean;
  nextPortID?: string;
  variant: BlockVariant;
}

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, label, isLocal, nextPortID, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={isLocal ? 'intentLocal' : NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        variant={variant}
        placeholder="Create or select an intent"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

const ConnectedIntentStep: ConnectedStep<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = ({ ports, data, variant }) => {
  const intentMap = React.useContext(CustomIntentMapContext)!;

  const { intent, availability } = data;

  return (
    <IntentStep
      label={intentMap[intent!] ? prettifyIntentName(intentMap[intent!].name) : null}
      nodeID={data.nodeID}
      isLocal={availability === BaseNode.Intent.IntentAvailability.LOCAL}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      variant={variant}
    />
  );
};

export default ConnectedIntentStep;
