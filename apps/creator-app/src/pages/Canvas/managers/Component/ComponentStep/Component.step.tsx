import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import { stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section, StepButton } from '@/pages/Canvas/components/Step';
import { FlowMapContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

import { useMemoizedPropertyFilter } from '../../hooks/memoized-property-filter.hook';
import { NODE_CONFIG } from '../ComponentManager.constants';
import { useGoToDiagram } from '../ComponentManager.hook';

const ComponentStep: ConnectedStep<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = ({ ports, data, palette }) => {
  const componentMap = React.useContext(FlowMapContext)!;
  const diagramID = data.diagramID || undefined;
  const goToDiagram = useGoToDiagram({ diagramID, nodeID: data.nodeID });
  const [componentData] = useMemoizedPropertyFilter(Object.values(componentMap), { diagramID });

  return (
    <Step nodeID={data.nodeID}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={componentData?.name}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          attachment={componentData?.name && <StepButton icon="edit" onClick={stopPropagation(goToDiagram)} />}
          placeholder="Select a component"
          labelVariant={StepLabelVariant.PRIMARY}
        />
      </Section>
    </Step>
  );
};

export default ComponentStep;
