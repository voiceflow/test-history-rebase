import React from 'react';

import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps } from '@/types';
import { prettifyIntentName } from '@/utils/intent';

export type IntentStepProps = {
  label?: string | null;
  nodeID: string;
  portID?: string;
};

export const IntentStep: React.FC<IntentStepProps> = ({ nodeID, portID, label }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item label={label} portID={portID} icon="user" iconColor="#5589eb" placeholder="Create or select an intent" />
    </Section>
  </Step>
);

const ConnectedIntentStep: React.FC<ConnectedStepProps<NodeData.Intent> & ConnectedIntentStepProps> = ({ node, data, platform, intentsMap }) => {
  const {
    [platform]: { intent },
  } = data;

  return <IntentStep nodeID={node.id} portID={node.ports.out[0]} label={intentsMap[intent!] ? prettifyIntentName(intentsMap[intent!].name) : null} />;
};

const mapStateToProps = {
  intentsMap: Intent.mapPlatformIntentsSelector,
};

type ConnectedIntentStepProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(ConnectedIntentStep) as React.FC<ConnectedStepProps<NodeData.Intent>>;
