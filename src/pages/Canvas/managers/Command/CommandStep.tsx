/* eslint-disable no-shadow */
import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps, MergeArguments } from '@/types';
import { stopPropagation } from '@/utils/dom';

export type CommandStepProps = {
  nodeID: string;
  name?: string;
  onCommandClick: () => void;
};

export const CommandStep: React.FC<CommandStepProps> = ({ nodeID, name, onCommandClick }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="flow" iconColor="#3c6997" label={name} onClick={stopPropagation(onCommandClick)} />
    </Section>
  </Step>
);

const ConnectedCommandStep: React.FC<ConnectedStepProps<NodeData.Command> & ConnectedCommandStepProps> = ({ node, data, goToDiagram }) => (
  <CommandStep nodeID={node.id} onCommandClick={goToDiagram} name={data.name} />
);

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
};

const mergeProps = (
  ...[, { goToDiagram }, { data, platform }]: MergeArguments<{}, typeof mapDispatchToProps, ConnectedStepProps<NodeData.Command>>
) => ({
  goToDiagram: () => !!data[platform].diagramID && goToDiagram(data[platform].diagramID!),
});

export type ConnectedCommandStepProps = ConnectedProps<{}, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(null, mapDispatchToProps, mergeProps)(ConnectedCommandStep) as React.FC<ConnectedStepProps<NodeData.Command>>;
