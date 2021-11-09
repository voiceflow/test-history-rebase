import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps, MergeArguments } from '@/types';
import { getDistinctPlatformValue } from '@/utils/platform';

export interface CommandStepProps {
  nodeID: string;
  name?: string;
  onCommandClick: () => void;
}

export const CommandStep: React.FC<CommandStepProps> = ({ nodeID, name, onCommandClick }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="flow" iconColor="#3c6997" label={name} onClick={stopPropagation(onCommandClick)} />
    </Section>
  </Step>
);

const ConnectedCommandStep: React.FC<ConnectedStepProps<Realtime.NodeData.Command> & ConnectedCommandStepProps> = ({ node, data, goToDiagram }) => (
  <CommandStep nodeID={node.id} onCommandClick={goToDiagram} name={data.name} />
);

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
};

const mergeProps = (
  ...[, { goToDiagram }, { data, platform }]: MergeArguments<{}, typeof mapDispatchToProps, ConnectedStepProps<Realtime.NodeData.Command>>
) => ({
  goToDiagram: () => {
    const platformData = getDistinctPlatformValue(platform, data);

    if (platformData.diagramID) {
      goToDiagram(platformData.diagramID);
    }
  },
});

export type ConnectedCommandStepProps = ConnectedProps<{}, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(null, mapDispatchToProps, mergeProps)(ConnectedCommandStep) as React.FC<ConnectedStepProps<Realtime.NodeData.Command>>;
