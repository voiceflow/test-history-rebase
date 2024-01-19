import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { ConnectedStep } from '@/pages/Canvas/managers/types';
import { isVariable, transformVariablesToReadable } from '@/utils/slot';

import { NODE_CONFIG } from '../constants';

const CardStep: ConnectedStep<Realtime.NodeData.Card, Realtime.NodeData.CardBuiltInPorts> = ({ ports, data, palette }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  return (
    <Step nodeID={data.nodeID} image={isVariable(data.largeImage) ? null : data.largeImage}>
      <Section>
        <Item
          icon={NODE_CONFIG.icon}
          label={transformVariablesToReadable(data.title, entitiesAndVariables.byKey)}
          portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
          palette={palette}
          placeholder="This card has no content"
          labelVariant={StepLabelVariant.SECONDARY}
        />
      </Section>
    </Step>
  );
};

export default CardStep;
