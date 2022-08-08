import { BaseModels } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { StepLabelVariant } from '@/constants/canvas';
import Step, { Item, Section } from '@/pages/Canvas/components/Step';
import { ConnectedStep } from '@/pages/Canvas/managers/types';

const SetStep: ConnectedStep<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = ({ ports, data, palette }) => (
  <Step nodeID={data.nodeID}>
    <Section>
      <Item
        icon="setV2"
        label={data.title || ''}
        portID={ports.out.builtIn[BaseModels.PortType.NEXT]}
        palette={palette}
        placeholder="Add set label"
        labelVariant={StepLabelVariant.PRIMARY}
        multilineLabel
      />
    </Section>
  </Step>
);

export default SetStep;
