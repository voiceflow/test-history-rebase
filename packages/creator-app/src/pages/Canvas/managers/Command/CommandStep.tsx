import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStepProps } from '@/pages/Canvas/managers/types';
import { ConnectedProps, MergeArguments } from '@/types';

export interface CommandStepProps {
  nodeID: string;
  name?: string;
  palette: HSLShades;
  onCommandClick: () => void;
}

export const CommandStep: React.FC<CommandStepProps> = ({ nodeID, name, palette, onCommandClick }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item icon="flow" palette={palette} label={name} onClick={stopPropagation(onCommandClick)} />
    </Section>
  </Step>
);

const ConnectedCommandStep: React.FC<ConnectedStepProps<Realtime.NodeData.Command> & ConnectedCommandStepProps> = ({
  data,
  goToDiagram,
  palette,
}) => <CommandStep nodeID={data.nodeID} onCommandClick={goToDiagram} name={data.name} palette={palette} />;

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagramHistoryPush,
};

const mergeProps = (
  ...[, { goToDiagram }, { data }]: MergeArguments<{}, typeof mapDispatchToProps, ConnectedStepProps<Realtime.NodeData.Command>>
) => ({
  goToDiagram: () => {
    if (data.diagramID) {
      goToDiagram(data.diagramID);
    }
  },
});

export type ConnectedCommandStepProps = ConnectedProps<{}, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(null, mapDispatchToProps, mergeProps)(ConnectedCommandStep) as React.FC<ConnectedStepProps<Realtime.NodeData.Command>>;
