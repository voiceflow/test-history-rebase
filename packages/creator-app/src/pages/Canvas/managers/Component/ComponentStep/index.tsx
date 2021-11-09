import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';
import { useDispatch } from 'react-redux';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
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
        icon={NODE_CONFIG.icon}
        label={label}
        portID={portID}
        onClick={label ? stopPropagation(onClickComponent) : undefined}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Select a component"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const MemoizedComponentStep = React.memo(ComponentStep);

const ConnectedComponentStep: React.FC<ConnectedStepProps<Realtime.NodeData.Component>> = ({ node, data }) => {
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
