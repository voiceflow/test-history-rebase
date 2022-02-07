import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { BlockVariant, StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { DiagramMapContext } from '@/pages/Canvas/contexts';
import perf, { PerfAction } from '@/performance';

import { NODE_CONFIG } from '../constants';

export interface FlowStepProps {
  label: string | null;
  nodeID: string;
  nextPortID: string;
  onClickFlow?: () => void;
  variant: BlockVariant;
}

export const FlowStep: React.FC<FlowStepProps> = ({ label, nodeID, nextPortID, onClickFlow, variant }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        onClick={label ? stopPropagation(onClickFlow) : undefined}
        variant={variant}
        labelVariant={StepLabelVariant.PRIMARY}
        placeholder="Connect a flow to this step"
      />
    </Section>
  </Step>
);

const ConnectedFlowStep: ConnectedStep<Realtime.NodeData.Flow, Realtime.NodeData.FlowBuiltInPorts> = ({ ports, data, variant }) => {
  const diagramMap = React.useContext(DiagramMapContext)!;

  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const goToDiagram = React.useCallback(() => {
    perf.action(PerfAction.FLOW_NODE__LINK_CLICK);

    if (data.diagramID) goToDiagramHistoryPush(data.diagramID);
  }, [data.diagramID, goToDiagramHistoryPush]);

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return (
    <FlowStep label={label} nodeID={data.nodeID} nextPortID={ports.out.builtIn[Models.PortType.NEXT]} onClickFlow={goToDiagram} variant={variant} />
  );
};

export default ConnectedFlowStep;
