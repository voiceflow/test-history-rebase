import { stopPropagation } from '@voiceflow/ui';
import React from 'react';
import { useDispatch } from 'react-redux';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { NodeData } from '@/models';
import Step, { ConnectedStepProps, Item, Section } from '@/pages/Canvas/components/Step';
import { DiagramMapContext } from '@/pages/Canvas/contexts';
import perf, { PerfAction } from '@/performance';

import { NODE_CONFIG } from '../constants';

export interface ComponentStepProps {
  label: string | null;
  nodeID: string;
  portID: string;
  onClickComponent?: () => void;
}

export const ComponentStep: React.FC<ComponentStepProps> = ({ label, nodeID, portID, onClickComponent }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        label={label}
        portID={portID}
        onClick={label ? stopPropagation(onClickComponent) : undefined}
        labelVariant={StepLabelVariant.SECONDARY}
        icon={NODE_CONFIG.icon}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Connect a component to this step"
      />
    </Section>
  </Step>
);

const MemoizedComponentStep = React.memo(ComponentStep);

const ConnectedComponentStep: React.FC<ConnectedStepProps<NodeData.Component>> = ({ node, data }) => {
  const dispatch = useDispatch();
  const diagramMap = React.useContext(DiagramMapContext)!;

  const goToDiagram = React.useCallback(() => {
    perf.action(PerfAction.COMPONENT_NODE__LINK_CLICK);

    if (data.diagramID) dispatch(Router.goToDiagramHistoryPush(data.diagramID));
  }, [data.diagramID, dispatch]);

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return <MemoizedComponentStep label={label} nodeID={node.id} portID={node.ports.out[0]} onClickComponent={goToDiagram} />;
};

export default ConnectedComponentStep;
