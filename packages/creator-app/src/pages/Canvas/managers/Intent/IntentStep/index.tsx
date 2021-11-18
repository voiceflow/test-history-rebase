import { Models, Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';
import { getDistinctPlatformValue } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  isLocal?: boolean;
  nextPortID?: string;
}

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, label, isLocal, nextPortID }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={isLocal ? 'intentLocal' : NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Create or select an intent"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

const ConnectedIntentStep: ConnectedStep<Realtime.NodeData.Intent, Realtime.NodeData.IntentBuiltInPorts> = ({ node, data, platform }) => {
  const intentMap = React.useContext(CustomIntentMapContext)!;

  const { intent, availability } = getDistinctPlatformValue(platform, data);

  return (
    <IntentStep
      label={intentMap[intent!] ? prettifyIntentName(intentMap[intent!].name) : null}
      nodeID={node.id}
      isLocal={availability === Node.Intent.IntentAvailability.LOCAL}
      nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]}
    />
  );
};

export default ConnectedIntentStep;
