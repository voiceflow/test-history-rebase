import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';
import { getDistinctPlatformValue } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  portID?: string;
  isLocal?: boolean;
}

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, portID, label, isLocal }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        portID={portID}
        icon={isLocal ? 'intentLocal' : NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Create or select an intent"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

const ConnectedIntentStep: React.FC<ConnectedStepProps<Realtime.NodeData.Intent>> = ({ node, data, platform }) => {
  const intentMap = React.useContext(CustomIntentMapContext)!;

  const { intent, availability } = getDistinctPlatformValue(platform, data);

  return (
    <IntentStep
      label={intentMap[intent!] ? prettifyIntentName(intentMap[intent!].name) : null}
      nodeID={node.id}
      portID={node.ports.out[0]}
      isLocal={availability === Node.Intent.IntentAvailability.LOCAL}
    />
  );
};

export default ConnectedIntentStep;
