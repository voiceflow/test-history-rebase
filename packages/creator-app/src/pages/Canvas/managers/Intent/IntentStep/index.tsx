import React from 'react';

import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { CustomIntentMapContext } from '@/pages/Canvas/contexts';
import { prettifyIntentName } from '@/utils/intent';
import { getDistinctPlatformValue } from '@/utils/platform';

import { NODE_CONFIG } from '../constants';

export interface IntentStepProps {
  label?: string | null;
  nodeID: string;
  portID?: string;
}

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, portID, label }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        portID={portID}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Create or select an intent"
        multilineLabel
        labelLineClamp={5}
      />
    </Section>
  </Step>
);

const ConnectedIntentStep: React.FC<ConnectedStepProps<NodeData.Intent>> = ({ node, data, platform }) => {
  const intentMap = React.useContext(CustomIntentMapContext)!;

  const { intent } = getDistinctPlatformValue(platform, data);

  return <IntentStep nodeID={node.id} portID={node.ports.out[0]} label={intentMap[intent!] ? prettifyIntentName(intentMap[intent!].name) : null} />;
};

export default ConnectedIntentStep;
