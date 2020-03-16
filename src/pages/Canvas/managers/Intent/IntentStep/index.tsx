import React from 'react';

import * as Intent from '@/ducks/intent';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { prettifyIntentName } from '@/utils/intent';

export type IntentStepProps = ConnectedStepProps['stepProps'] & {
  label?: string | null;
  portID?: string;
};

export const IntentStep: React.FC<IntentStepProps> = ({ portID, label, isActive, onClick, lockOwner, withPorts }) => (
  <Step isActive={isActive} onClick={onClick} lockOwner={lockOwner}>
    <Section>
      <Item label={label} portID={withPorts ? portID : null} icon="user" iconColor="#5589eb" placeholder="Create or select an intent" />
    </Section>
  </Step>
);

type ConnectedIntentStepProps = ConnectedStepProps<NodeData.Intent> & {
  intentsMap: Record<string, { name: string }>;
};

const ConnectedIntentStep: React.FC<ConnectedIntentStepProps> = ({ node, data, stepProps, platform, intentsMap }) => {
  const {
    [platform]: { intent },
  } = data;

  return <IntentStep portID={node.ports.out[0]} label={intentsMap[intent] ? prettifyIntentName(intentsMap[intent].name) : null} {...stepProps} />;
};

const mapStateToProps = {
  intentsMap: Intent.mapPlatformIntentsSelector,
};

export default connect(mapStateToProps)(ConnectedIntentStep);
