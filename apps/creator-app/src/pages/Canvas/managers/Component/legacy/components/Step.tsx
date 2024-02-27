import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { DiagramMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import perf, { PerfAction } from '@/performance';

import { NODE_CONFIG } from '../../ComponentManager.constants';

const LegacyComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ ports, data, palette }) => {
  const diagramMap = React.useContext(DiagramMapContext)!;
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const onClick = () => {
    perf.action(PerfAction.COMPONENT_NODE__LINK_CLICK);

    if (data.diagramID) goToDiagramHistoryPush(data.diagramID, undefined, data.nodeID);
  };

  const label = data.diagramID ? diagramMap[data.diagramID]?.name : null;

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={label}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          attachment={label && <StepButton icon="edit" onClick={stopPropagation(onClick)} />}
          placeholder="Select a component"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default LegacyComponentStep;
