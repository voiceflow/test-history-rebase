import { Models } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { ConnectedStep, Item, Section } from '@/pages/Canvas/components/Step';
import { DiagramMapContext } from '@/pages/Canvas/contexts';
import perf, { PerfAction } from '@/performance';

import { NODE_CONFIG } from '../constants';

export interface ComponentStepProps {
  label: string | null;
  nodeID: string;
  nextPortID: string;
  onClickComponent?: () => void;
}

export const ComponentStep: React.FC<ComponentStepProps> = ({ label, nodeID, nextPortID, onClickComponent }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        onClick={label ? stopPropagation(onClickComponent) : undefined}
        iconColor={NODE_CONFIG.iconColor}
        placeholder="Select a component"
        labelVariant={StepLabelVariant.SECONDARY}
      />
    </Section>
  </Step>
);

const ConnectedComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ node, data }) => {
  const diagramMap = React.useContext(DiagramMapContext)!;
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const goToDiagram = React.useCallback(() => {
    perf.action(PerfAction.COMPONENT_NODE__LINK_CLICK);

    if (data.diagramID) goToDiagramHistoryPush(data.diagramID);
  }, [data.diagramID, goToDiagramHistoryPush]);

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return <ComponentStep label={label} nodeID={node.id} nextPortID={node.ports.out.builtIn[Models.PortType.NEXT]} onClickComponent={goToDiagram} />;
};

export default ConnectedComponentStep;
