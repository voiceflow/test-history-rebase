import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedProps, MergeArguments } from '@/types';
import { stopPropagation } from '@/utils/dom';

import { NODE_CONFIG } from '../constants';

export type FlowStepProps = {
  label: string | null;
  nodeID: string;
  portID: string;
  onClickFlow?: () => void;
};

export const FlowStep: React.FC<FlowStepProps> = ({ label, nodeID, portID, onClickFlow }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        portID={portID}
        onClick={label ? stopPropagation(onClickFlow) : undefined}
        labelVariant={StepLabelVariant.SECONDARY}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Connect a flow to this step"
      />
    </Section>
  </Step>
);

const ConnectedFlowStep: React.FC<ConnectedStepProps<NodeData.Flow> & ConnectedFlowStepProps> = ({ diagramName, node, goToDiagram }) => (
  <FlowStep label={diagramName} nodeID={node.id} portID={node.ports.out[0]} onClickFlow={goToDiagram} />
);

const mapStateToProps = {
  diagram: Diagram.diagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
};

const mergeProps = (
  ...[{ diagram: getDiagram }, { goToDiagram }, { data }]: MergeArguments<
    typeof mapStateToProps,
    typeof mapDispatchToProps,
    ConnectedStepProps<NodeData.Flow>
  >
) => ({
  goToDiagram: () => data.diagramID && goToDiagram(data.diagramID),
  diagramName: data.diagramID && getDiagram(data.diagramID)?.name,
});

type ConnectedFlowStepProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps, typeof mergeProps>;

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConnectedFlowStep);
