import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Diagram from '@/ducks/diagram';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { MergeProps } from '@/types';
import { stopPropagation } from '@/utils/dom';

export type FlowStepProps = {
  label: string;
  portID: string;
  onClickFlow?: () => void;
};

export const FlowStep: React.FC<FlowStepProps> = ({ label, portID, onClickFlow }) => (
  <Step>
    <Section>
      <Item
        label={label}
        portID={portID}
        onClick={label ? stopPropagation(onClickFlow) : undefined}
        labelVariant={StepLabelVariant.SECONDARY}
        icon="flow"
        iconColor="#3c6997"
        placeholder="Connect a flow to this step"
      />
    </Section>
  </Step>
);

export type ConnectedFlowStepProps = ConnectedStepProps<NodeData.Flow> & {
  diagramName: string;
  goToDiagram: () => void;
};

const ConnectedFlowStep: React.FC<ConnectedFlowStepProps> = ({ diagramName, node, goToDiagram }) => (
  <FlowStep label={diagramName} portID={node.ports.out[0]} onClickFlow={goToDiagram} />
);

const mapStateToProps = {
  diagram: Diagram.diagramByIDSelector,
};

const mapDispatchToProps = {
  goToDiagram: Router.goToDiagram,
};

const mergeProps: MergeProps<typeof mapStateToProps, typeof mapDispatchToProps, ConnectedStepProps<NodeData.Flow>> = (
  { diagram: getDiagram },
  { goToDiagram },
  { data }
) => ({
  goToDiagram: () => data.diagramID && goToDiagram(data.diagramID),
  diagramName: data.diagramID && getDiagram(data.diagramID)?.name,
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ConnectedFlowStep);
