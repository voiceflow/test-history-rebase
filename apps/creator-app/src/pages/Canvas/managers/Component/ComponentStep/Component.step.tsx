import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { FlowMapByDiagramIDContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../ComponentManager.constants';
import { useGoToDiagram } from '../ComponentManager.hook';

const ComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ ports, data, palette }) => {
  const flowMapByDiagramID = React.useContext(FlowMapByDiagramIDContext)!;
  const goToDiagram = useGoToDiagram({ diagramID: data.diagramID, activeNodeID: data.nodeID });
  const flow = data.diagramID ? flowMapByDiagramID[data.diagramID] : null;

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={flow?.name}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          attachment={flow?.name && <StepButton icon="edit" onClick={stopPropagation(goToDiagram)} />}
          placeholder="Select a component"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default ComponentStep;
