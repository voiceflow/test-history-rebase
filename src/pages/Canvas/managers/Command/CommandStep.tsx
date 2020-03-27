/* eslint-disable no-shadow */
import React from 'react';

import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { MergeProps } from '@/types';
import { stopPropagation } from '@/utils/dom';

export type Command = {
  name?: string;
};

export type CommandStepProps = Command & {
  onCommandClick: () => void;
};

export const CommandStep: React.FC<CommandStepProps> = ({ name, onCommandClick }) => (
  <Step>
    <Section>
      <Item icon="flow" iconColor="#3c6997" label={name} onClick={stopPropagation(onCommandClick)} />
    </Section>
  </Step>
);

export type ConnectedCommandStep = ConnectedStepProps<NodeData.Command> & {
  goToDiagram: () => void;
};

const ConnectedCommandStep: React.FC<ConnectedCommandStep> = ({ data, goToDiagram }) => <CommandStep onCommandClick={goToDiagram} name={data.name} />;

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
};

const mergeProps: MergeProps<{}, typeof mapDispatchToProps, ConnectedStepProps<NodeData.Command>> = (_, { goToDiagram }, { data, platform }) => ({
  goToDiagram: () => data[platform].diagramID && goToDiagram(data[platform].diagramID),
});

export default connect(null, mapDispatchToProps, mergeProps)(ConnectedCommandStep);
