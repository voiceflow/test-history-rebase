import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { HSLShades } from '@/constants';
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
  palette: HSLShades;
}

export const ComponentStep: React.FC<ComponentStepProps> = ({ label, nodeID, nextPortID, onClickComponent, palette }) => (
  <Step nodeID={nodeID}>
    <Section>
      <Item
        icon={NODE_CONFIG.icon}
        label={label}
        portID={nextPortID}
        onClick={label ? stopPropagation(onClickComponent) : undefined}
        palette={palette}
        placeholder="Select a flow"
        labelVariant={StepLabelVariant.PRIMARY}
      />
    </Section>
  </Step>
);

const ConnectedComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ ports, data, palette }) => {
  const diagramMap = React.useContext(DiagramMapContext)!;
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const onClickComponent = React.useCallback(() => {
    perf.action(PerfAction.COMPONENT_NODE__LINK_CLICK);

    if (data.diagramID) goToDiagramHistoryPush(data.diagramID);
  }, [data.diagramID, goToDiagramHistoryPush]);

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return (
    <ComponentStep
      label={label}
      nodeID={data.nodeID}
      nextPortID={ports.out.builtIn[BaseModels.PortType.NEXT]}
      onClickComponent={onClickComponent}
      palette={palette}
    />
  );
};

export default ConnectedComponentStep;
