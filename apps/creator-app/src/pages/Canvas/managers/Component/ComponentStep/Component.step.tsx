import { BaseModels } from '@voiceflow/base-types';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { FlowMapByDiagramIDContext } from '@/pages/Canvas/contexts';
import type { ConnectedStep } from '@/pages/Canvas/managers/types';

import { NODE_CONFIG } from '../ComponentManager.constants';

const ComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({
  ports,
  data,
  palette,
}) => {
  const flowMapByDiagramID = React.useContext(FlowMapByDiagramIDContext)!;
  const goToDiagramHistoryPush = useDispatch(Router.goToDiagramHistoryPush);

  const onClick = () => {
    if (data.diagramID) goToDiagramHistoryPush(data.diagramID, undefined, data.nodeID);
  };

  const flow = data.diagramID ? flowMapByDiagramID[data.diagramID] : null;

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={flow?.name}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          attachment={flow?.name && <StepButton icon="edit" onClick={stopPropagation(onClick)} />}
          placeholder="Select a component"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default ComponentStep;
