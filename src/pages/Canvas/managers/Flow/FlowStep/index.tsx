import React from 'react';
import { useDispatch } from 'react-redux';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { DiagramMapContext } from '@/pages/Canvas/contexts';
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

const MemoizedFlowStep = React.memo(FlowStep);

const ConnectedFlowStep: React.FC<ConnectedStepProps<NodeData.Flow>> = ({ node, data }) => {
  const dispatch = useDispatch();
  const diagramMap = React.useContext(DiagramMapContext)!;

  const goToDiagram = React.useCallback(() => data.diagramID && dispatch(Router.goToDiagram(data.diagramID)), [data.diagramID, dispatch]);

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return <MemoizedFlowStep label={label} nodeID={node.id} portID={node.ports.out[0]} onClickFlow={goToDiagram} />;
};

export default ConnectedFlowStep;
