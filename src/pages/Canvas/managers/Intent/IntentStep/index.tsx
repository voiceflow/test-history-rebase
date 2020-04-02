import React from 'react';

import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyIntentName } from '@/utils/intent';

export type IntentStepProps = {
  label?: string | null;
  portID?: string;
};

export const IntentStep: React.FC<IntentStepProps> = ({ portID, label }) => (
  <Step>
    <Section>
      <Item label={label} portID={portID} icon="user" iconColor="#5589eb" placeholder="Create or select an intent" />
    </Section>
  </Step>
);

type ConnectedIntentStepProps = ConnectedStepProps<NodeData.Intent> & {
  intentsMap: Record<string, { name: string }>;
};

const ConnectedIntentStep: React.FC<ConnectedIntentStepProps> = ({ node, data, platform, intentsMap }) => {
  const {
    [platform]: { intent },
  } = data;

  return <IntentStep portID={node.ports.out[0]} label={intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null} />;
};

const mapStateToProps = {
  intentsMap: Intent.mapPlatformIntentsSelector,
};

export default connect(mapStateToProps)(ConnectedIntentStep);
